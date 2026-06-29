const pool = require("../config/db");

const getDoctors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM doctors");

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM doctors WHERE id=$1", [id]);
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
module.exports = { getDoctors ,getDoctorById};
