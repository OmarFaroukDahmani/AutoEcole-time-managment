const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const port = 5050;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.post('/sign-up', async (req, res) => {
  const role = req.body.role;

  if (role === "teacher") {
    try {
      const { username, email, phone_number, password, school_name, school_address, government } = req.body;

      const checkSql = "SELECT * FROM teachers WHERE email = ?";
      db.query(checkSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const insert = `
          INSERT INTO teachers (username, email, phone_number, password, school_name, school_address, government) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [username, email, phone_number, hashedPassword, school_name, school_address, government];

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
      const { username, email, password, teacherId, phone_number } = req.body;

      const checkSql = "SELECT * FROM students WHERE email = ?";
      db.query(checkSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const insert = `
          INSERT INTO students (username, email, password, teacher_id, phone_number) 
          VALUES (?, ?, ?, ?, ?)
        `;
        const values = [username, email, hashedPassword, teacherId, phone_number];

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

    res.status(200).json({
      message: "Connected",
      role: role,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number || null,
      id: user.teacher_id || user.student_id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:teacherId', (req, res) => {
  const teacherId = Number(req.params.teacherId);

  if (isNaN(teacherId)) {
    return res.status(400).json({ error: "Invalid teacher ID" });
  }

  const sql = `
    SELECT username, email, phone_number 
    FROM students 
    WHERE teacher_id = ?
  `;

  db.query(sql, [teacherId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
});

app.get('/partners', (req, res) => {
  const sql = `
    SELECT username, school_name, phone_number, government
    FROM teachers
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
});

app.get("/student/:id", (req, res) => {
  const studentId = Number(req.params.id);

  if (isNaN(studentId)) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  const sql = `
    SELECT s.student_id, s.username, s.email, s.phone_number,
           t.username AS teacher_name, t.school_name
    FROM students s
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    WHERE s.student_id = ?
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(results[0]);
  });
});


app.get("/student/:id/lessons", (req, res) => {
  const studentId = Number(req.params.id);

  if (isNaN(studentId)) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  const sql = `
    SELECT lesson_id AS id, date, time, status
    FROM lessons
    WHERE student_id = ?
    ORDER BY date ASC, time ASC
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(results);
  });
});

app.post('/add_lesson', (req, res)=>{
    try{
        const {student_id , date, time, status} = req.body;

        sql = `INSERT INTO lessons (student_id, date, time, status) VALUES (?,?,?,?)`

        db.query(sql, [student_id, date, time, status], (err, result)=>{
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Lesson registered successfully!" });
        })

    }catch(error){
        res.status(500).json({ error: error.message });
    }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
