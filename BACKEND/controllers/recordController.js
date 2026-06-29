const pool = require("../config/db");

const getRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    const result = await pool.query(
      `SELECT * FROM medical_records
       WHERE patient_id=$1
       ORDER BY date DESC`,
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

const addRecord = async (req, res) => {
  try {
    const {
      patientId,
      title,
      description,
      type,
      date,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO medical_records
      (patient_id,title,description,type,date)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        patientId,
        title,
        description,
        type,
        date,
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

const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM medical_records WHERE id=$1",
      [id]
    );

    res.json({
      message: "Record Deleted",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getRecords,
  addRecord,
  deleteRecord,
};