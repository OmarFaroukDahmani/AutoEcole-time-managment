const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');


const app = express();
const port = 5050;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));


app.post('/test', async (req, res) => {
  const role = req.body.role;

  if (role === "teacher") {
    try {
      const { username, email, password, school_name, school_address, government } = req.body;

      const checkSql = "SELECT * FROM teachers WHERE email = ?";
      db.query(checkSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const insert = `
          INSERT INTO teachers (username, email, password, school_name, school_address, government) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [username, email, hashedPassword, school_name, school_address, government];

        db.query(insert, values, (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Teacher registered successfully!" });
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (role === "student") {
    try {
      const { username, email, password, teacherId } = req.body;

      const checkSql = "SELECT * FROM students WHERE email = ?";
      db.query(checkSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const insert = `
          INSERT INTO students (username, email, password, teacher_id) 
          VALUES (?, ?, ?, ?)
        `;
        const values = [username, email, hashedPassword, teacherId];

        db.query(insert, values, (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Student registered successfully!" });
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid role provided" });
  }
});


app.post('/login', async (req, res) => {
    try {
        const { userid, password, role } = req.body;

        // Helper function to query database using Promise
        const queryDb = (sql, params) => {
            return new Promise((resolve, reject) => {
                db.query(sql, params, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        };

        let sql;
        if (role === "teacher") {
            sql = 'SELECT * FROM teachers WHERE email = ? OR username = ?';
        } else if (role === "student") {
            sql = 'SELECT * FROM students WHERE email = ? OR username = ?';
        } else {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        const results = await queryDb(sql, [userid, userid]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Return user info including role for frontend redirection
        res.status(200).json({ 
            message: "Connected", 
            role: role,
            username: user.username,
            email: user.email,
            id: user.teacher_id || user.student_id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/users', (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
