const pool = require("../db");


exports.addPatients = (name, contact) => {
    return new Promise((resolve, reject) => {
        // Validate inputs
        if (!name) {
            return reject({
                success: false,
                message: 'Name is not provided'
            });
        }
        if (!contact) {
            return reject({
                success: false,
                message: 'Contact is not provided'
            });
        }
        if (contact.length < 11) {
            return reject({
                success: false,
                message: 'Provide a valid mobile number'
            });
        }

        // Check if contact already exists
        const patientQueryContact = 'SELECT * FROM patients WHERE contact = ?';
        pool.query(patientQueryContact, [contact], (err, contactResult) => {
            if (err) {
                console.error('Error querying contact:', err);
                return reject(err);
            }
            if (contactResult?.length > 0) {
                return reject({
                    success: false,
                    message: 'The contact number is already used by someone'
                });
            }
        });



        // Insert new patient
        const patientQuery = 'INSERT INTO patients (contact, name) VALUES (?, ?)';
        pool.query(patientQuery, [contact, name], (err, result) => {
            if (err) {
                console.error('Error inserting patient:', err);
                return reject(err);
            }
            // Check if the insert was successful
            if (result.affectedRows > 0) {
                return resolve({
                    success: true,
                    id: result.insertId,
                    contact: contact,
                    name: name
                });
            } else {
                return reject({ success: false, message: 'Failed to add patient' });
            }
        });

    });
};
