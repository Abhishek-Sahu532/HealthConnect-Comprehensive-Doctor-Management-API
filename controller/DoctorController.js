const express = require("express");
const router = express.Router();
const DoctorService = require("../service/DoctorService");

router.post("/create", async (req, res) => {
  try {
    const { name, email, specialization, weeklySchedule } = req.body
    let result = await DoctorService.createDoctor({ name, email, specialization, weeklySchedule });

    if (!result.success) {
      return res.status(400).json(result)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

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
