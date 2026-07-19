const pool = require("../config/db");

const getHospitals = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hospitals");

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getHospitals,
};
