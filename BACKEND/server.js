const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello from express API");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
const authRoutes = require("./routes/authRoutes");

const doctorRoutes = require("./routes/doctorRoutes");

const hospitalRoutes = require("./routes/hospitalRoutes");

const appointmentRoutes = require("./routes/appointmentRoutes");

const recordRoutes = require("./routes/recordRoutes");

const emergencyRoutes = require("./routes/emergencyRoutes");

const prescriptionRoutes = require("./routes/prescriptionRoutes");

const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);

app.use("/api/prescriptions",  prescriptionRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/hospitals", hospitalRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/records", recordRoutes);

app.use("/api/emergency", emergencyRoutes);
