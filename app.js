const express = require("express");
const app = express();
const path = require("path");

const AppointmentController = require("./controller/AppointmentController");
const DoctorController = require("./controller/DoctorController");

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/doctors", AppointmentController, DoctorController);
app.listen(process.env.PORT, () => {
  console.log(
    "Project url: https://" + process.env.PORT + ".sock.hicounselor.com"
  );
});
