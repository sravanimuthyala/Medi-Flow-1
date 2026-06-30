const express= require("express");
const router= express.Router();
const {addAppointment,getPatientAppointments,cancelAppointment}=require("../controllers/appointmentController");
router.post("/",addAppointment);
router.get(
 "/patient/:id",
 getPatientAppointments
);

router.put(
 "/cancel/:id",
 cancelAppointment
);

module.exports = router;