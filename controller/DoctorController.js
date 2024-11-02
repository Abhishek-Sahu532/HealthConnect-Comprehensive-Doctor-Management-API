const express = require("express");
const router = express.Router();
const DoctorService = require("../service/DoctorService");

router.post("/create", async (req, res) => {
  let result = await DoctorService.createDoctor();
  res.send(result);
});
router.get("/", async (req, res) => {
  let result = await DoctorService.getAllDoctors();
  res.send(result);
});
router.get("/:id", async (req, res) => {
  let result = await DoctorService.getDoctorById();
  res.send(result);
});
router.post("/update/:id", async (req, res) => {
  let result = await DoctorService.updateDoctorDetails();
  res.send(result);
});
router.post("/delete/:id", async (req, res) => {
  let result = await DoctorService.deleteDoctor();
  res.send(result);
});
router.get("/search", async (req, res) => {
  let result = await DoctorService.searchDoctorsBySpecialization();
  res.send(result);
});
router.post("/:id/leave", async (req, res) => {
  let result = await DoctorService.addDoctorLeave();
  res.send(result);
});
router.post("/:id/deleteLeave", async (req, res) => {
  let result = await DoctorService.deleteDoctorLeave();
  res.send(result);
});
router.get("/:id/availability", async (req, res) => {
  let result = await DoctorService.getDoctorAvailability();
  res.send(result);
});
module.exports = router;
