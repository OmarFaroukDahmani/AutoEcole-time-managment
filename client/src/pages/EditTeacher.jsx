import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditTeacher() {
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    school_name: "",
    school_address: "",
    government: "",
    price_per_hour: "",
  });

  useEffect(() => {
    if (user) {
      setTeacher({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        password: "",
        school_name: user.school_name || "",
        school_address: user.school_address || "",
        government: user.government || "",
        price_per_hour: user.price_per_hour || "",
      });
    }
  }, [user]);

  const handleTeacherChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://autotime-api-48989bed2553.herokuapp.com/edit_profile/${user.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teacher),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify({ ...user, ...teacher }));
        navigate("/admin");
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("⚠️ Something went wrong!");
    }
  };

  return (
    <div className="form-wrapper">
      <h1 className="form-title">Edit Profile</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={teacher.username}
          onChange={handleTeacherChange}
          required
        />
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={teacher.email}
          onChange={handleTeacherChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={teacher.phone_number}
          onChange={handleTeacherChange}
          required
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={teacher.password}
          onChange={handleTeacherChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="school_name"
          placeholder="School Name"
          value={teacher.school_name}
          onChange={handleTeacherChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="school_address"
          placeholder="School Address"
          value={teacher.school_address}
          onChange={handleTeacherChange}
          required
        />
        <input
          type="number"
          className="form-input"
          name="price_per_hour"
          placeholder="Price Per Hour"
          value={teacher.price_per_hour}
          onChange={handleTeacherChange}
          required
        />

        <label htmlFor="government" className="form-label">
          Government
        </label>
        <select
          className="form-select"
          name="government"
          value={teacher.government}
          onChange={handleTeacherChange}
          required
        >
          <option value="">Select Government</option>
          <option value="Tunis">Tunis</option>
          <option value="Ariana">Ariana</option>
          <option value="Ben Arous">Ben Arous</option>
          <option value="Manouba">Manouba</option>
          <option value="Nabeul">Nabeul</option>
          <option value="Zaghouan">Zaghouan</option>
          <option value="Bizerte">Bizerte</option>
          <option value="Béja">Béja</option>
          <option value="Jendouba">Jendouba</option>
          <option value="Kef">Kef</option>
          <option value="Siliana">Siliana</option>
          <option value="Sousse">Sousse</option>
          <option value="Monastir">Monastir</option>
          <option value="Mahdia">Mahdia</option>
          <option value="Sfax">Sfax</option>
          <option value="Kairouan">Kairouan</option>
          <option value="Kasserine">Kasserine</option>
          <option value="Sidi Bouzid">Sidi Bouzid</option>
          <option value="Gabès">Gabès</option>
          <option value="Medenine">Medenine</option>
          <option value="Tataouine">Tataouine</option>
          <option value="Gafsa">Gafsa</option>
          <option value="Tozeur">Tozeur</option>
          <option value="Kebili">Kebili</option>
        </select>

        <button type="submit" className="submit-btn">
          Update Info
        </button>
      </form>
    </div>
  );
}
