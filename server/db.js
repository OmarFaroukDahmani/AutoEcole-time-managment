require("dotenv").config();
const mysql = require("mysql2"); // <-- changed from 'mysql'

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
});

module.exports = db;
