const express = require("express");

const router = express.Router();

const {
  getPrescriptions,
  getPatientPrescriptions,
  addPrescription,
} = require("../controllers/prescriptionController");

router.get("/",getPrescriptions);

router.get(
  "/patient/:patientId",
  getPatientPrescriptions
);

router.post("/", addPrescription);

module.exports = router;