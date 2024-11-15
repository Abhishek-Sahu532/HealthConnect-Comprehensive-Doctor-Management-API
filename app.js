const express = require("express");
const app = express();
const path = require("path");

const AppointmentController = require("./controller/AppointmentController");
const DoctorController = require("./controller/DoctorController");
const PatientController = require("./controller/PatientsControllers");

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/doctors", AppointmentController, DoctorController, PatientController);
app.listen(process.env.PORT, () => {
  console.log(
    "Project url: https://" + process.env.PORT + ".sock.hicounselor.com"
  );
});
