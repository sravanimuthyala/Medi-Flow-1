const express=require("express");
const router=express.Router();
const {getEmergencyResources}=require("../controllers/emergencyController");
router.get("/",getEmergencyResources);
module.exports=router;