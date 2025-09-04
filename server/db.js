const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    database: 'autoecole',
    user: 'root',
    password: ''
});

db.connect(function(error){
    if(error){
        throw error;
    } else {
        console.log('Database connected');
    }
});

module.exports = db;  