const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./db"); // Assumes this now exports a 'pg' Pool
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("AutoEcole API is running!");
});

app.post("/sign-up", async (req, res) => {
  const { role } = req.body;

  try {
    if (role === "student") {
      const { username, email, password, teacherId, phone_number } = req.body;
      const hashed = await bcrypt.hash(password, 10);
      
      // Changed ? to $1, $2, etc.
      db.query(
        "INSERT INTO students (username, email, password, teacher_id, phone_number) VALUES ($1, $2, $3, $4, $5)",
        [username, email, hashed, teacherId, phone_number],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Student registered" });
        }
      );
    } else if (role === "teacher") {
      const {
        username,
        email,
        phone_number,
        password,
        school_name,
        school_address,
        government,
        price_per_hour,
      } = req.body;

      const hashed = await bcrypt.hash(password, 10);
      
      // Changed ? to $1...$8
      db.query(
        "INSERT INTO teachers (username, email, phone_number, password, school_name, school_address, government, price_per_hour) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          username,
          email,
          phone_number,
          hashed,
          school_name,
          school_address,
          government,
          price_per_hour,
        ],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Teacher registered" });
        }
      );
    } else {
      res.status(400).json({ message: "Invalid role" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { userid, password, role } = req.body;
  
  // Validate table name to prevent SQL injection since it's dynamic
  const table = role === "teacher" ? "teachers" : "students";

  db.query(
    `SELECT * FROM ${table} WHERE email=$1 OR username=$2`,
    [userid, userid],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Postgres: check results.rows.length
      if (results.rows.length === 0)
        return res.status(400).json({ message: "User not found" });

      // Postgres: Access data via results.rows[0]
      const user = results.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ message: "Incorrect password" });

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

// edit teacher profile
app.put("/edit_profile/:id", async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    phone_number,
    password,
    school_name,
    school_address,
    government,
    price_per_hour,
  } = req.body;

  const sql = `
    UPDATE teachers 
    SET username = $1, 
        email = $2, 
        phone_number = $3, 
        password = $4, 
        school_name = $5, 
        school_address = $6, 
        government = $7, 
        price_per_hour = $8
    WHERE teacher_id = $9
  `;

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    sql,
    [username, email, phone_number, hashed, school_name, school_address, government, price_per_hour, id],
    (err, results) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ error: err.message });
      }

      // Postgres: check results.rowCount
      if (results.rowCount === 0) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      res.status(200).json({ 
        message: "Profile updated successfully",
        updatedTeacher: { username, email, phone_number, school_name, school_address, government, price_per_hour }
      });
    }
  );
});

// Get students by teacher
app.get("/users/:teacherId", (req, res) => {
  const teacherId = Number(req.params.teacherId);
  db.query(
    "SELECT student_id, username, email, phone_number FROM students WHERE teacher_id=$1", 
    [teacherId], 
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      // Postgres: return results.rows
      res.json(results.rows);
    }
  );
});

// add driver 
app.post('/add_driver', (req, res) => {
    const { teacher_id, name, phone_number, vehicle_assigned } = req.body;

    const sql = 'INSERT INTO drivers (teacher_id, name, phone_number, vehicle_assigned) VALUES ($1, $2, $3, $4)';

    db.query(sql, [teacher_id, name, phone_number, vehicle_assigned], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Driver registered successfully!' });
    });
});

// Get student profile
app.get("/student/:id", (req, res) => {
  const id = Number(req.params.id);
  const sql = `
    SELECT
      s.student_id,
      s.username,
      s.email,
      s.phone_number,
      s.total_price,
      s.paid_amount,
      t.username AS teacher_name,
      t.school_name
    FROM students s
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    WHERE s.student_id = $1`;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(results.rows[0]);
  });
});

// Get student lessons with driver information
app.get("/lessons/:id", (req, res) => {
  const id = Number(req.params.id);
  const sql = `
    SELECT
      l.lesson_id,
      l.date,
      l.time,
      l.status,
      l.driver_id,
      d.name AS driver_name,
      d.vehicle_assigned
    FROM lessons l
    LEFT JOIN drivers d ON l.driver_id = d.driver_id
    WHERE l.student_id = $1`;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.rows);
  });
});

// Get lessons to edit
app.get('/lesson/:id',(req, res) => {
  const id = Number(req.params.id);
  db.query("SELECT lesson_id, date, time, status FROM lessons WHERE lesson_id=$1", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.rows);
  });
});

// set money
app.post('/set_money/:id', (req, res) => {
  const { id } = req.params;
  const { total_price, paid_amount } = req.body;

  if (total_price === undefined || paid_amount === undefined) {
    return res.status(400).json({ error: "Missing total_price or paid_amount in request body." });
  }

  const sql = 'UPDATE students SET total_price = $1, paid_amount = $2 WHERE student_id = $3';
  
  db.query(sql, [total_price, paid_amount, id], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Database error occurred.' });
    }

    if (results.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json({ message: 'Payment information updated successfully.' });
  });
});

// Add lesson
app.post("/add_lesson/:id", (req, res) => {
  const { id } = req.params;
  const { date, time, status, driverId } = req.body;

  if (!id || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query("SELECT * FROM students WHERE student_id=$1", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Rows check for the SELECT query
    if (rows.rows.length === 0) return res.status(404).json({ error: "Student not found" });

    db.query(
      "INSERT INTO lessons (student_id, date, time, status, driver_id) VALUES ($1, $2, $3, $4, $5)",
      [id, date, time, status, driverId],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json({ message: "Lesson registered successfully!" });
      }
    );
  });
});

// Update a lesson
app.put("/edit_lesson/:id", (req, res) => {
  const { id } = req.params; 
  const { date, time, status, driverId } = req.body;

  if (!date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query("SELECT * FROM lessons WHERE lesson_id=$1", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.rows.length === 0) return res.status(404).json({ error: "Lesson not found" });

    db.query(
      "UPDATE lessons SET date=$1, time=$2, status=$3, driver_id=$4 WHERE lesson_id=$5",
      [date, time, status, driverId, id],
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
  
  const sql = "DELETE FROM lessons WHERE lesson_id = $1"; 
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "An internal server error occurred." });
    }
    
    if (results.rowCount === 0) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    res.status(200).json({ message: "Lesson deleted successfully." });
  });
});


// get teachers
app.get("/partners", (req,res)=>{
  const sql = "SELECT teacher_id, username, school_name, phone_number, government, price_per_hour FROM teachers"
  db.query(sql, (err, results)=>{
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results.rows);   
  }) 
})

// get drivers
app.get('/drivers/:id', (req,res)=>{
  const { id } = req.params;
  const sql = "SELECT name, driver_id, phone_number, vehicle_assigned FROM drivers WHERE teacher_id=$1"
  db.query(sql, [id], (err, results)=>{
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results.rows);   
  }) 
})

// edit teacher profile 
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, phone_number } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE users 
    SET username = $1, email = $2, phone_number = $3 
    WHERE user_id = $4
  `;

  db.query(sql, [username, email, phone_number, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Profile updated successfully" });
  });
});


// get stats 
app.get("/stats/:teacher_id", (req, res) => {
  const { teacher_id } = req.params;

  const driversQuery = "SELECT COUNT(*) AS drivers_count FROM drivers WHERE teacher_id = $1";
  const studentsQuery = "SELECT COUNT(*) AS students_count FROM students WHERE teacher_id = $1";
  const paymentsQuery = `
    SELECT 
      COALESCE(SUM(paid_amount), 0) AS total_paid,
      COALESCE(SUM(total_price - paid_amount), 0) AS total_remaining
    FROM students
    WHERE teacher_id = $1`;

  db.query(driversQuery, [teacher_id], (err, driversResult) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(studentsQuery, [teacher_id], (err, studentsResult) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(paymentsQuery, [teacher_id], (err, paymentsResult) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          // Note: PostgreSQL COUNT returns a BigInt (string) by default, 
          // but frontend usually handles it fine.
          drivers_count: driversResult.rows[0].drivers_count,
          students_count: studentsResult.rows[0].students_count,
          total_paid: paymentsResult.rows[0].total_paid,
          total_remaining: paymentsResult.rows[0].total_remaining,
        });
      });
    });
  });
});

// delete student
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students WHERE student_id = $1"; 
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Student deleted successfully." }); 
  });
});

// delete driver
app.delete("/delete-driver/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM drivers WHERE driver_id = $1";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found." });
    }

    res.status(200).json({ message: "Driver deleted successfully." });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));