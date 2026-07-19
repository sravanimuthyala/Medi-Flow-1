const {getUsers,updateDoctorStatus,getAppointments}= require("../controllers/adminController");
const express = require("express");
const router = express.Router();
router.get("/users", getUsers);
router.put("/doctors/:id/status", updateDoctorStatus);
router.get("/appointments", getAppointments);
module.exports = router;