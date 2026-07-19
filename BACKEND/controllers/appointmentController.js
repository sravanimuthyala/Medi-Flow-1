const pool = require("../config/db");
const addAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      time,
      type,
      reason,
      fee,
      status,
      payment,
    } = req.body;

     // Check whether doctor exists and is active
    const doctor = await pool.query(
      `SELECT active
       FROM doctors
       WHERE id = $1`,
      [doctorId]
    );

    if (doctor.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (!doctor.rows[0].active) {
      return res.status(400).json({
        message: "Doctor is currently unavailable for appointments.",
      });
    }

    const existingAppointment = await pool.query(
  `SELECT id
   FROM appointments
   WHERE doctor_id = $1
   AND date = $2
   AND time = $3
   AND status <> 'cancelled'`,
  [doctorId, date, time]
);

if (existingAppointment.rows.length > 0) {
  return res.status(409).json({
    message: "This slot is already booked. Please select another time."
  });
}

    // Book appointment
    const result = await pool.query(
      `INSERT INTO appointments
   (
        patient_id,
        doctor_id,
        date,
        time,
        type,
        reason,
        fee,
        status,
        payment
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        patientId,
        doctorId,
        date,
        time,
        type,
        reason,
        fee,
        status,
        payment,
      ]
    );

    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM appointments
       WHERE patient_id = $1
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

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE appointments
       SET status = 'cancelled'
       WHERE id = $1`,
      [id],
    );

    res.json({
      message: "Appointment Cancelled",
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

module.exports = {
  addAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctorAppointments,
};
