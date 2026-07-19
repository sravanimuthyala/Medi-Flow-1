const pool = require("../config/db");

const getPrescriptions = async (
  req,
  res
) => {
  try {
    const result = await pool.query(
      "SELECT * FROM prescriptions ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getPatientPrescriptions =
  async (req, res) => {
    try {
      const { patientId } = req.params;

      const result = await pool.query(
        `SELECT *
         FROM prescriptions
         WHERE patient_id = $1
         ORDER BY created_at DESC`,
        [patientId]
      );

      res.json(result.rows);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

const addPrescription = async (
  req,
  res
) => {
  try {
    const {
      appointmentId,
      patientId,
      diagnosis,
      medications,
      notes,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO prescriptions
      (
        appointment_id,
        patient_id,
        diagnosis,
        medications,
        notes
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        appointmentId,
        patientId,
        diagnosis,
        JSON.stringify(medications),
        notes,
      ]
    );

    res.status(201).json(
      result.rows[0]
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getPrescriptions,
  getPatientPrescriptions,
  addPrescription,
};