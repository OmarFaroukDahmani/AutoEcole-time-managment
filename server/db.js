require("dotenv").config();
const mysql = require('mysql');

const urlDB =  `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`

const db = mysql.createConnection(urlDB);

db.connect(function(error){
    if(error){
        throw error;
    } else {
        console.log('Database connected');
        console.log("DB connection:", process.env.MYSQLHOST, process.env.MYSQLPORT, process.env.MYSQLDATABASE);

    }
});

module.exports = db;  