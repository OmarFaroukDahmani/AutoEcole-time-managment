import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

/* ROOT */
app.get("/", (req, res) => {
  res.send("AutoEcole API is running!");
});

/* ================= SIGN UP ================= */
app.post("/sign-up", async (req, res) => {
  const { role } = req.body;

  try {
    if (role === "student") {
      const { username, email, password, teacherId, phone_number } = req.body;
      const hashed = await bcrypt.hash(password, 10);

      await db.query(
        `INSERT INTO students 
         (username,email,password,teacher_id,phone_number) 
         VALUES ($1,$2,$3,$4,$5)`,
        [username, email, hashed, teacherId, phone_number]
      );

      return res.status(201).json({ message: "Student registered" });
    }

    if (role === "teacher") {
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

      await db.query(
        `INSERT INTO teachers
         (username,email,phone_number,password,school_name,school_address,government,price_per_hour)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          username,
          email,
          phone_number,
          hashed,
          school_name,
          school_address,
          government,
          price_per_hour,
        ]
      );

      return res.status(201).json({ message: "Teacher registered" });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { userid, password, role } = req.body;

  const table =
    role === "teacher" ? "teachers" :
    role === "student" ? "students" : null;

  if (!table) return res.status(400).json({ message: "Invalid role" });

  try {
    const result = await db.query(
      `SELECT * FROM ${table} WHERE email=$1 OR username=$1`,
      [userid]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result.rows[0];
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= EDIT TEACHER ================= */
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

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      `UPDATE teachers 
       SET username=$1,email=$2,phone_number=$3,password=$4,
           school_name=$5,school_address=$6,government=$7,price_per_hour=$8
       WHERE teacher_id=$9`,
      [
        username,
        email,
        phone_number,
        hashed,
        school_name,
        school_address,
        government,
        price_per_hour,
        id,
      ]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Teacher not found" });

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= STUDENTS BY TEACHER ================= */
app.get("/users/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  const result = await db.query(
    "SELECT student_id,username,email,phone_number FROM students WHERE teacher_id=$1",
    [teacherId]
  );

  res.json(result.rows);
});

/* ================= ADD DRIVER ================= */
app.post("/add_driver", async (req, res) => {
  const { teacher_id, name, phone_number, vehicle_assigned } = req.body;

  await db.query(
    `INSERT INTO drivers (teacher_id,name,phone_number,vehicle_assigned)
     VALUES ($1,$2,$3,$4)`,
    [teacher_id, name, phone_number, vehicle_assigned]
  );

  res.json({ message: "Driver registered successfully!" });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
