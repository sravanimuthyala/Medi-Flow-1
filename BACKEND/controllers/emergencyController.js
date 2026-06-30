const pool=require("../config/db");
const getEmergencyResources=async(req,res)=>{
try{
const result=await pool.query(`
    SELECT
      e.*,
      h.name,
      h.address,
      h.city,
      h.phone,
      h.image
      FROM emergency_resources e
      JOIN hospitals h
      ON e.hospital_id=h.id`);
      res.json(result.rows);
}
catch(error){
    console.log(error);
    res.status(500).json({
        message:"Server Error"
    });
}
}
module.exports={getEmergencyResources};