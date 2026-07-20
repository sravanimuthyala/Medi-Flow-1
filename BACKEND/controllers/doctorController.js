const pool = require("../config/db");

// Get all active doctors
const getDoctors = async (req, res) => {
  try {
    const search = req.query.search || "";
    const specialization = req.query.specialization || "";

    let query = `
  SELECT
    d.*,
    u.onboarding_status
FROM doctors d
JOIN users u
ON d.user_id = u.id
`;

    const values = [];
    let paramIndex = 1;

    if (search) {
      query += `
        AND (
          name ILIKE $${paramIndex}
          OR specialization ILIKE $${paramIndex}
        )
      `;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (specialization) {
      query += `
        AND specialization = $${paramIndex}
      `;
      values.push(specialization);
      paramIndex++;
    }

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get doctor by id
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM doctors WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDoctorSlots = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT slots
      FROM doctors
      WHERE user_id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Update doctor slots
const updateDoctorSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { slots } = req.body;

    await pool.query(
      `UPDATE doctors
       SET slots = $1
       WHERE user_id = $2`,
      [JSON.stringify(slots), id],
    );

    res.json({
      message: "Slots Updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
  SELECT
    a.*,
    u.fullname AS patient_name
  FROM appointments a
  JOIN doctors d
    ON a.doctor_id = d.id
  JOIN users u
    ON a.patient_id = u.id
  WHERE d.user_id = $1
  ORDER BY a.date
  `,
      [id],
    );

    return res.json(result.rows);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === "completed") {
      // Get consultation fee
      const feeResult = await pool.query(
        "SELECT fee FROM appointments WHERE id = $1",
        [id],
      );

      const fee = Number(feeResult.rows[0].fee);

      const doctorShare = fee * 0.8;
      const adminShare = fee * 0.2;

      await pool.query(
        `
        UPDATE appointments
        SET
          status = $1,
          doctor_share = $2,
          admin_share = $3
        WHERE id = $4
        `,
        [status, doctorShare, adminShare, id],
      );
    } else {
      await pool.query(
        `
        UPDATE appointments
        SET status = $1
        WHERE id = $2
        `,
        [status, id],
      );
    }

    res.json({
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Doctor dashboard
const getDoctorDashboard = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const result = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE a.date = CURRENT_DATE) AS "todayAppointments",
        COUNT(*) FILTER (WHERE a.status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE a.status = 'completed') AS completed,
        COUNT(DISTINCT a.patient_id) AS "totalPatients"
      FROM appointments a
      JOIN doctors d
        ON a.doctor_id = d.id
      WHERE d.user_id = $1
      `,
      [doctorId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const search = req.query.search || "";
    const specialization = req.query.specialization || "";

    let query = `
      SELECT
        d.*,
        u.onboarding_status
      FROM doctors d
      JOIN users u
        ON d.user_id = u.id
      WHERE 1 = 1
    `;

    const values = [];
    let paramIndex = 1;

    if (search) {
      query += `
        AND (
          d.name ILIKE $${paramIndex}
          OR d.specialization ILIKE $${paramIndex}
        )
      `;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (specialization) {
      query += `
        AND d.specialization = $${paramIndex}
      `;
      values.push(specialization);
      paramIndex++;
    }

    query += " ORDER BY d.id";

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM medical_records
      WHERE patient_id = $1
      ORDER BY date DESC
      `,
      [patientId],
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  updateDoctorSlots,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorDashboard,
  getAllDoctors,
  getPatientMedicalRecords,
};
