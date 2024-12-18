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

});
router.get("/", async (req, res) => {
  try {
    let result = await DoctorService.getAllDoctors();
    if (result.success) {
      return res.status(200).json(result)
    }
    if (!result.success) {
      return res.status(400).json(result)
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    let result = await DoctorService.getDoctorById({ id });
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
});

router.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, specialization, weeklySchedule } = req.body
    let result = await DoctorService.updateDoctorDetails({ id, name, email, specialization, weeklySchedule });
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

});

router.post("/delete/:id", async (req, res) => {
  try {
    const {id} = req.params
    let result = await DoctorService.deleteDoctor({id});
    if(!result.success){
      return res.status(400).json(result)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
});

router.get("/search/:specialization", async (req, res) => {
  try {
    const { specialization } = req.params
    console.log(specialization)
    let result = await DoctorService.searchDoctorsBySpecialization({ specialization });
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


});

router.post("/:id/leave", async (req, res) => {
  try {
    const { id } = req.params
    const { leaveDate, startTime, endTime } = req.body
    let result = await DoctorService.addDoctorLeave({ id ,leaveDate, startTime, endTime});
    if (!result?.success) {
      return res.status(400).json(result)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

});

router.post("/:id/deleteLeave", async (req, res) => {
  try {
    const doctorId = req.params.id
    const leaveDate = req.query.leaveDate
    let result = await DoctorService.deleteDoctorLeave(doctorId, leaveDate);
    // if (!result.success) {
    //   return res.status(400).json(result)
    // }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
})


router.get("/:id/availability", async (req, res) => {
  let result = await DoctorService.getDoctorAvailability();
  res.send(result);
});
module.exports = router;
