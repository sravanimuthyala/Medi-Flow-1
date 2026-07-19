const express = require("express");
const router = express.Router();
const {
  addAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctorAppointments,
} = require("../controllers/appointmentController");
router.post("/", addAppointment);
router.get("/patient/:id", getPatientAppointments);

router.put("/cancel/:id", cancelAppointment);
router.get("/doctor/:id", getDoctorAppointments);
module.exports = router;
