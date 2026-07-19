const pool = require("../config/db");
const getUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    let query = `
      SELECT *
      FROM users
      WHERE role = 'patient'
    `;

    const values = [];
    let paramIndex = 1;

    if (search) {
      query += `
        AND (
          fullname ILIKE $${paramIndex}
          OR email ILIKE $${paramIndex}
        )
      `;

      values.push(`%${search}%`);
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
const updateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const result = await pool.query(
      "UPDATE doctors SET active = $1 WHERE id = $2 RETURNING *",
      [active, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating doctor status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getAppointments = async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";

    let query = `
      SELECT
        a.*,
        u.fullname AS patient_name,
        d.name AS doctor_name
      FROM appointments a
      JOIN users u
        ON a.patient_id = u.id
      JOIN doctors d
        ON a.doctor_id = d.id
      WHERE 1 = 1
    `;

    const values = [];
    let paramIndex = 1;

    if (search) {
      query += `
        AND (
          d.name ILIKE $${paramIndex}
          OR u.fullname ILIKE $${paramIndex}
        )
      `;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      query += `
        AND a.status = $${paramIndex}
      `;
      values.push(status);
      paramIndex++;
    }

    query += `
      ORDER BY a.date DESC, a.time DESC
    `;

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


module.exports = { getUsers, updateDoctorStatus, getAppointments };
