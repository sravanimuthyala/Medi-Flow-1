const pool = require("../config/db");

// Get all active doctors
const getDoctors = async (req, res) => {
  try {
const search = req.query.search || "";
    const specialization = req.query.specialization || "";

    let query = `
      SELECT *
      FROM doctors
      WHERE active = TRUE
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

    const result = await pool.query(
      "SELECT * FROM doctors WHERE id = $1",
      [id]
    );
    
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
      [id]
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
      [JSON.stringify(slots), id]
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
      SELECT *
      FROM appointments
      WHERE doctor_id = $1
      ORDER BY date
      `,
      [id]
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

    await pool.query(
      `UPDATE appointments
       SET status = $1
       WHERE id = $2`,
      [status, id]
    );

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
        COUNT(*) FILTER (WHERE date = CURRENT_DATE) AS "todayAppointments",
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,
        COUNT(DISTINCT patient_id) AS "totalPatients"
      FROM appointments
      WHERE doctor_id = $1
      `,
      [doctorId]
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
      SELECT *
      FROM doctors
      WHERE 1 = 1
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

    query += " ORDER BY id";

    const result = await pool.query(query, values);

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
};
