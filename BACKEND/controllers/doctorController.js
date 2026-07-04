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
const getDoctorSlots = async (req, res) => {
  try {
    const { id } = req.params;

   

    const result = await pool.query(
      `SELECT slots
       FROM doctors
       WHERE user_id = $1`,
      [id]
    );


    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

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
      `SELECT *
       FROM appointments
       WHERE doctor_id = $1
       ORDER BY date`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
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
      message: "Status Updated"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = { getDoctors, getDoctorById, getDoctorSlots, updateDoctorSlots ,getDoctorAppointments, updateAppointmentStatus};
