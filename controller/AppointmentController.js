const express = require("express");
const router = express.Router();
const AppointmentService = require("../service/AppointmentService");

router.post("/:id/bookAppointments", async (req, res) => {
  let result = await AppointmentService.createAppointmentForDoctor();
  res.send(result);
});
router.get("/:id/appointments/upcoming", async (req, res) => {
  let result = await AppointmentService.getUpcomingAppointmentsForDoctor();
  res.send(result);
});
module.exports = router;
