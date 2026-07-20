const express = require("express");

const router = express.Router();

const {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  updateDoctorSlots,
  getDoctorDashboard,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllDoctors,
  getPatientMedicalRecords,
} = require("../controllers/doctorController");

router.get("/", getDoctors);
router.get("/admin/doctors", getAllDoctors);
router.get("/slots/:id", getDoctorSlots);
router.get("/doctor/:id", getDoctorAppointments);
router.get("/patients/:patientId/records", getPatientMedicalRecords);
router.put("/slots/:id", updateDoctorSlots);
router.put("/appointments/:id/status", updateAppointmentStatus);
router.get("/:id", getDoctorById);
router.get("/:doctorId/dashboard", getDoctorDashboard);
module.exports = router;
