const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
const port = 5050;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Signup
app.post("/sign-up", async (req, res) => {
  const { role } = req.body;
  if (role === "student") {
    const { username, email, password, teacherId, phone_number } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO students (username,email,password,teacher_id,phone_number) VALUES (?,?,?,?,?)",
      [username, email, hashed, teacherId, phone_number],
      (err) => err ? res.status(500).json({ error: err.message }) : res.status(201).json({ message: "Student registered" })
    );
  } else if (role === "teacher") {
    const { username, email, phone_number, password, school_name, school_address, government } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO teachers (username, email, phone_number, password, school_name, school_address, government) VALUES (?,?,?,?,?,?,?)",
      [username, email, phone_number, hashed, school_name, school_address, government],
      (err) => err ? res.status(500).json({ error: err.message }) : res.status(201).json({ message: "Teacher registered" })
    );
  } else res.status(400).json({ message: "Invalid role" });
});

// Login
app.post("/login", async (req, res) => {
  const { userid, password, role } = req.body;
  const table = role === "teacher" ? "teachers" : "students";

  db.query(
    `SELECT * FROM ${table} WHERE email=? OR username=?`,
    [userid, userid],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Incorrect password" });

      res.json({
        message: "Connected",
        role,
        userId: role === "teacher" ? user.teacher_id : user.student_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number || null,
      });
    }
  );
});

// Get students by teacher
app.get("/users/:teacherId", (req, res) => {
  const teacherId = Number(req.params.teacherId);
  db.query("SELECT student_id, username, email, phone_number FROM students WHERE teacher_id=?", [teacherId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get student profile
app.get("/student/:id", (req, res) => {
  const id = Number(req.params.id);
  const sql = `
    SELECT s.student_id, s.username, s.email, s.phone_number,
           t.username AS teacher_name, t.school_name
    FROM students s
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    WHERE s.student_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(results[0]);
  });
});

// Get student lessons
app.get("/lessons/:id", (req, res) => {
  const id = Number(req.params.id);
  db.query("SELECT lesson_id, date, time, status FROM lessons WHERE student_id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get lessons to edit
app.get('/lesson/:id',(req, res) => {
  const id = Number(req.params.id);
  db.query("SELECT lesson_id, date, time, status FROM lessons WHERE lesson_id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add lesson
app.post("/add_lesson/:id", (req, res) => {
  const { id } = req.params; 
  const { date, time, status } = req.body;

  if (!id || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query("SELECT * FROM students WHERE student_id=?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Student not found" });

    db.query(
      "INSERT INTO lessons (student_id, date, time, status) VALUES (?,?,?,?)",
      [id, date, time, status],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json({ message: "Lesson registered successfully!" });
      }
    );
  });
});

// Update a lesson
app.put("/edit_lesson/:id", (req, res) => {
  const { id } = req.params; // lesson_id
  const { date, time, status } = req.body;

  if (!date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query("SELECT * FROM lessons WHERE lesson_id=?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Lesson not found" });

    db.query(
      "UPDATE lessons SET date=?, time=?, status=? WHERE lesson_id=?",
      [date, time, status, id],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(200).json({ message: "Lesson updated successfully!" });
      }
    );
  });
});


// Delete lesson
app.delete('/delete_lesson/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM lessons WHERE id = ?";  
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Lesson deleted successfully." });
  });
});


// get techers
app.get("/partners", (req,res)=>{
  sql = "SELECT teacher_id, username, school_name, phone_number, government FROM teachers "
  db.query(sql, (err, results)=>{
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);   
  }) 
})

// delete student
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students WHERE student_id = ?"; 
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Student deleted successfully." }); 
  });
});


app.listen(port, () => console.log(`Server running on port ${port}`));
