const mysql = require("mysql");
const pool = mysql.createPool({
  host: "localhost",
  user: "b7f8225b",
  password: "Cab#22se",
  database: "b7f8225b",
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  }
  console.log("Connected to MySQL");
  connection.release();
});

module.exports = pool;
