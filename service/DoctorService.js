const pool = require("../db");

exports.createDoctor = ({ name, email, specialization, weeklySchedule }) => {

    return new Promise((resolve, reject) => {
        if ([name, email, specialization].some((field) => field.trim() == '')) {
            return reject({
                success: false,
                message: 'The details are missing or invalid.'
            })
        }

        if (weeklySchedule.length == 0) {
            return reject({
                success: false,
                message: 'The details are missing or invalid.'
            })
        }

        weeklySchedule.map((schedule) => {
            if (schedule.dayOfWeek == '' || schedule.startTime == '' || schedule.endTime == '') {
                return reject({
                    success: false,
                    message: 'A valid weekly schedule is required.'
                })
            }

        })

        const queryToCheckEmail = 'select * from doctors where email = ?'

        pool.query(queryToCheckEmail, [email], (err, resultOfEmailCheck) => {
            if (err) {
                return reject(err)
            }
            console.log('resultOfEmailCheck', resultOfEmailCheck)
            if (resultOfEmailCheck.length > 0) {
                return reject({
                    success: false,
                    message: `A doctor with ${email} email already exists.`
                })
            }
            if (resultOfEmailCheck.length == 0) {
                const queryToInsertRecord = 'INSERT INTO doctors (email, name, specialization, weekly_schedule) VALUES  (?,?,?,?)'


                // Convert weeklySchedule array to a JSON string
                const weeklyScheduleJson = JSON.stringify(weeklySchedule);

                console.log(weeklyScheduleJson)

                pool.query(queryToInsertRecord, [email, name, specialization, weeklyScheduleJson], (err, resultOfInsertQuery) => {
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }
                    console.log(resultOfInsertQuery)
                    if (resultOfInsertQuery.affectedRows > 0) {
                        const insertId = resultOfInsertQuery.insertId

                        let resultObject = {
                            success: true,
                        }

                        const queryToGetFinalResult = 'select * from doctors where id = ?'
                        pool.query(queryToGetFinalResult, [insertId], (err, FinalResult) => {
                            if (err) {
                                return reject(err)
                            }
                            console.log('FinalResult', FinalResult)
                            if (FinalResult.length > 0) {
                                resultObject.id = FinalResult[0].id
                                resultObject.name = FinalResult[0].name
                                resultObject.email = FinalResult[0].email
                                resultObject.specialization = FinalResult[0].specialization
                                resultObject.weeklySchedule =  JSON.parse(FinalResult[0].weekly_schedule);
                                return resolve(resultObject)
                            }
                        })
                    }
                })
            }
        })
    })
}
exports.getAllDoctors = () => {
    return new Promise((resolve, reject) => {
        const queryToGetDoctorsDetails = 'select * from doctors'
        pool.query(queryToGetDoctorsDetails, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.length == 0) {
                return reject({
                    success: false,
                    message: "Doctor not found for hospital."
                })
            }
            let resultObject = {
                success: true,
            }
            if (result.length > 0) {
                resultObject['result'] = result.map((res) => ({
                    id: res.id,
                    name: res.name,
                    email: res.email,
                    specialization: res.specialization
                }
                ))
                return resolve(resultObject)
            }
        })
    })
}

exports.searchDoctorsBySpecialization = ({ specialization }) => {
    return new Promise((resolve, reject) => {
        if (!specialization) {
            return reject({
                success: false,
                message: 'specialization missing'
            })
        }

        const queryToGetSpecializationResult = 'select id, email, name, specialization from doctors where specialization = ?'

        pool.query(queryToGetSpecializationResult, [specialization], (err, specialiezResult) => {
            if (err) {
                return reject(err)
            }
            let resultObject = { success: true }

            //if the specialization category are not found in the database, it will return the doctors list
            if (specialiezResult.length == 0) {
                const queryToGetDoctorResult = 'select id, email, name, specialization from doctors'

                pool.query(queryToGetDoctorResult, (err, result) => {
                    if (err) {
                        return reject(err)
                    }
                    resultObject['result'] = result
                    return resolve(resultObject)
                })
            }
            if (specialiezResult.length > 0) {
                resultObject['result'] = specialiezResult
                return resolve(resultObject)
            }
        })
    })
}

exports.getDoctorById = () => ({ msg: "tesnpt" });
exports.updateDoctorDetails = () => ({ msg: "test" });
exports.deleteDoctor = () => ({ msg: "test" });
exports.addDoctorLeave = () => ({ msg: "test" });
exports.deleteDoctorLeave = () => ({ msg: "test" });
exports.getDoctorAvailability = () => ({ msg: "test" });
