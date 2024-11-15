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


exports.deleteDoctor = ({ id }) => {
    return new Promise((resolve, reject) => {
        const doctorQuery = 'select * from doctors where id = ?'
        pool.query(doctorQuery, [id], (err, doctorResult) => {
            if (err) {
                return reject(err)
            }
            if (doctorResult.length == 0) {
                return reject({
                    success: false,
                    message: `ID ${id} not found`
                })
            }

            const deleteQuery = 'delete from doctors where id = ?'

            pool.query(deleteQuery, [id], (err, result) => {
                if (err) {
                    return reject(err)
                }
                console.log('result', result)
                if (result.affectedRows > 0) {
                    return resolve({
                        success: true
                    })
                } else {
                    return reject({
                        success: false,
                        message: 'Delete action failed'
                    })
                }
            })
        })
    })
}

exports.addDoctorLeave = async ({ id, leaveDate, startTime, endTime }) => {
    return new Promise(async (resolve, reject) => {
        if (!leaveDate && !startTime) {
            return reject({
                success: false,
                message: 'Please provide the leave date & start time'
            })
        }
        if (endTime && !startTime) {
            return reject({
                success: false,
                message: 'Please provide the start time'

            })
        }

        //checking the endTime is not before the startTime
        let convertedStartTime = convertTo24Hour(startTime)
        let convertedEndTime = convertTo24Hour(endTime)

        if (convertedEndTime < convertedStartTime) {
            return reject({
                success: false,
                message: 'End time is not earlier than the start time'
            })
        }

        let todayDate = new Date();
        let convertLeaveDate = new Date(leaveDate);
        let Difference_In_Time = convertLeaveDate.getTime() - todayDate.getTime();

        // Calculate the difference in days
        let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
        //do not works on past dates
        if (Difference_In_Days < 0) {
            return reject({
                success: false,
                message: 'Please use future dates to apply an leave'
            })
        }
        const doctorQuery = 'select * from doctors where id = ?'
        await pool.query(doctorQuery, [id], (err, doctorResult) => {
            if (err) {
                return reject(err)
            }
            // console.log('doctorResult', doctorResult)
            if (doctorResult.length == 0) {
                return reject({
                    success: false,
                    message: `Doctor not found with the given ID ${id}`
                })
            }

            if (doctorResult.length > 0) {
                const leaveQuery = 'select * from doctor_leaves where doctor_id = ? and leave_date = ?'
                pool.query(leaveQuery, [id, leaveDate], (err, leaveResult) => {
                    if (err) {
                        return reject(err)
                    }
                    let resultObject = {
                        success: true,
                    }
                    // console.log('leaveResult', leaveResult)
                    if (leaveResult.length == 0) {
                        const insertLeaveQuery = 'INSERT INTO doctor_leaves (end_time, leave_date, start_time, doctor_id) values(?,?,?,?)'
                        pool.query(insertLeaveQuery, [endTime, leaveDate, startTime, id], (err, InsertQueryResult) => {
                            if (err) {
                                return reject(err)
                            }
                            // console.log('InsertQueryResult', InsertQueryResult)
                            if (InsertQueryResult.affectedRows > 0) {
                                resultObject["Doctor Id"] = id
                                resultObject["LeaveId"] = InsertQueryResult.insertId
                                resultObject["LeaveDate"] = leaveDate
                                resultObject["StartTime"] = startTime
                                resultObject["EndTime"] =  endTime
                                return resolve(resultObject)
                            }
                            // console.log('InsertQueryResult', InsertQueryResult)

                        })
                    }
                    if (leaveResult.length > 0) {
                        const updateQuery = 'update doctor_leaves set start_time = ?, end_time = ? where id = ?'
                        pool.query(updateQuery, [startTime, endTime, leaveResult[0].id], (err, updateQueryResult) => {
                            if (err) {
                                return reject(err)
                            }
                            // console.log('updateQueryResult', updateQueryResult)
                            if (updateQueryResult.affectedRows > 0) {
                                resultObject["Doctor Id"] = id
                                resultObject["LeaveId"] = leaveResult[0].id
                                resultObject["LeaveDate"] = leaveDate
                                resultObject["StartTime"] = startTime
                                resultObject["EndTime"] = endTime
                                return resolve(resultObject)

                                // console.log('data updated')
                            }
                        })
                    }
                })
            }
        })
    })
}

exports.deleteDoctorLeave = (doctorId, leaveDate) => {
    return new Promise((resolve, reject) => {
        const doctorQuery = 'select * from doctors where id = ?'
        pool.query(doctorQuery, [doctorId], (err, doctorResult) => {
            if (err) {
                return reject(err)
            }
            if (doctorResult.length == 0) {
                return reject({
                    success: false,
                    messgae: `Doctor not found of specified ID ${doctorId}`
                })
            }
            if (doctorResult.length > 0) {
                const leaveDateQuery = 'select * from doctor_leaves where doctor_id= ? and leave_date =?'

                pool.query(leaveDateQuery, [doctorId, leaveDate], (err, leaveDateResult) => {
                    if (err) {
                        return result(err)
                    }
                    if (leaveDateResult.length == 0) {
                        return reject({
                            success: false,
                            message: `Leave not found with the given date ${leaveDate} & ID ${doctorId}`
                        })
                    }
                    const deleteQuery = 'delete from doctor_leaves where id = ?'
                    pool.query(deleteQuery, [leaveDateResult[0].id], (err, deleteResult) => {
                        if (err) {
                            return reject(err)
                        }
                        if (deleteResult.affectedRows > 0) {
                            return resolve({
                                success: true
                            })
                        }
                    })
                })
            }
        })
    })
}


exports.getDoctorAvailability = () => ({ msg: "test" });
