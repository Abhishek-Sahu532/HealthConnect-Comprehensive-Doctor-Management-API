const express = require("express");
const router = express.Router();
const PatientsService = require('../service/PatientsService');

router.post('/add/patients', async (req, res) => {
    try {
        const { name, contact } = req.body
        console.log(name, contact)
        const result = await PatientsService.addPatients(name, contact)
        if (!result?.success) {
            return res.status(400).json(result)
        }
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router;
