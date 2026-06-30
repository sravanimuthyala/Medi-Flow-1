const express = require("express");

const router = express.Router();

const {
  getRecords,
  addRecord,
  deleteRecord,
} = require("../controllers/recordController");

router.get("/:patientId", getRecords);

router.post("/", addRecord);

router.delete("/:id", deleteRecord);

module.exports = router;