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


exports.getDoctorById = ({ id }) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            return reject({
                success: false,
                message: 'Id is missing'
            })
        }
        const queryToGetResultByID = 'select * from doctors where id = ?'
        pool.query(queryToGetResultByID, [id], (err, result) => {
            if (err) {
                console.log('err', err)
                return reject(err)
            }
            if (result.length == 0) {
                return reject({
                    success: false,
                    message: `Doctor not found with ID ${id}`
                })
            }
            let resultObject = {
                success: true
            }
            // console.log('result', result)
            if (result.length > 0) {
                resultObject['id'] = result[0].id
                resultObject['name'] = result[0].name
                resultObject['email'] = result[0].email
                resultObject['specialization'] = result[0].specialization
                resultObject['weeklySchedule'] = JSON.parse(result[0].weekly_schedule)
                return resolve(resultObject)
            }
        })
    })
}

exports.updateDoctorDetails = async ({ id, name, email, specialization, weeklySchedule }) => {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject({
                success: false,
                message: 'ID is missing'
            })
        }

        if ([name, email, specialization].some((field) => {
            field == ''
        })) {
            return reject({
                success: false,
                message: 'Details are missing'
            })
        }
        if (weeklySchedule.length == 0) {
            return reject({
                success: false,
                message: 'Details are missing'
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

        const queryForDoctorDetails = 'select * from doctors where id = ? '
        pool.query(queryForDoctorDetails, [id], (err, resultOfDoctorquery) => {
            if (err) {
                return reject(err)
            }
            //checking the doctor's id is presented in the database
            console.log('resultOfDoctorquery', resultOfDoctorquery)
            if (resultOfDoctorquery.length == 0) {
                return reject({
                    success: false,
                    "message": `Doctor not found with ID:${id}`
                })
            }
            if (resultOfDoctorquery.length > 0) {
                //checking the email is not used by another doctor

                if (resultOfDoctorquery[0].email !== email) {
                    const queryToGetDetailsByEmail = 'select * from doctors where email = ?'
                    pool.query(queryToGetDetailsByEmail, [email], (err, resultOfDoctorByEmail) => {
                        if (err) {
                            return reject(err)
                        }
                        console.log('resultOfDoctorByEmail', resultOfDoctorByEmail)
                        if (resultOfDoctorByEmail.length > 0) {
                            return reject({
                                success: false,
                                message: `The email id ${email} is used by another doctor`
                            })
                        }
                    })
                }

                let newName = name ? name : resultOfDoctorquery[0].name
                let newEmail = email ? email : resultOfDoctorquery[0].email
                let newSpecialization = specialization ? specialization : resultOfDoctorquery[0].specialization
                let newWeeklySchedule = weeklySchedule ? JSON.stringify(weeklySchedule) : resultOfDoctorquery[0].weeklySchedule

                const queryToUpdateTheResponse = 'update doctors set email = ?,	name= ?, specialization = ?,	weekly_schedule = ? where id = ?'
                pool.query(queryToUpdateTheResponse, [newEmail, newName, newSpecialization, newWeeklySchedule, id], (err, resultOfUpdateQuery) => {
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }

                    console.log('resultOfUpdateQuery', resultOfUpdateQuery)

                    if (resultOfUpdateQuery.affectedRows > 0) {
                        // const insertId = resultOfUpdateQuery.insertId
                        let resultObject = {
                            success: true,
                            name: newName,
                            email: newEmail,
                            specialization: newSpecialization,
                            weeklySchedule: JSON.parse(newWeeklySchedule)
                        }
                        return resolve(resultObject)
                    }
                })

            }
        })
    })
}



exports.deleteDoctor = () => ({ msg: "test" });
exports.addDoctorLeave = () => ({ msg: "test" });
exports.deleteDoctorLeave = () => ({ msg: "test" });
exports.getDoctorAvailability = () => ({ msg: "test" });
