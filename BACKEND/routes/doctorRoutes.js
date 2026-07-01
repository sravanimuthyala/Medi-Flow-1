const express = require("express");

const router = express.Router();

const {
  getDoctors,
  getDoctorById,
   getDoctorSlots,
  updateDoctorSlots,
} = require("../controllers/doctorController");

router.get("/", getDoctors);
router.get("/slots/:id", getDoctorSlots);

router.put("/slots/:id", updateDoctorSlots);
router.get("/:id", getDoctorById);
module.exports = router;
