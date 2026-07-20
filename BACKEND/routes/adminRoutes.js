const {
  getUsers,
  updateDoctorStatus,
  getAppointments,
  approveDoctorOnboarding,
} = require("../controllers/adminController");
const express = require("express");
const router = express.Router();
router.get("/users", getUsers);
router.put("/doctors/:id/status", updateDoctorStatus);
router.put("/doctors/:id/onboarding", approveDoctorOnboarding);
router.get("/appointments", getAppointments);
module.exports = router;
