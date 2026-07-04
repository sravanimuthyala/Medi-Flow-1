const pool = require("../config/db");
const getUsers = async (req, res) => {
  try {
const result = await pool.query(
  "SELECT * FROM users WHERE role = 'patient'"
);    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
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
const result = await pool.query(`
  SELECT
    a.*,
    p.fullname AS patient_name,
    d.fullname AS doctor_name
  FROM appointments a
  JOIN users p
    ON a.patient_id = p.id
  JOIN users d
    ON a.doctor_id = d.id
  ORDER BY a.date DESC
`);    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { getUsers, updateDoctorStatus, getAppointments };