const express = require("express");

const router = express.Router();

const {
  getDoctors,
  getDoctorById,
   getDoctorSlots,
  updateDoctorSlots,getDoctorAppointments,updateAppointmentStatus
} = require("../controllers/doctorController");

router.get("/", getDoctors);
router.get("/slots/:id", getDoctorSlots);
router.get("/doctor/:id", getDoctorAppointments);
router.put("/slots/:id", updateDoctorSlots);
router.put("/appointments/:id/status", updateAppointmentStatus);router.get("/:id", getDoctorById);
module.exports = router;
