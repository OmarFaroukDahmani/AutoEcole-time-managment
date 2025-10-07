import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

export default function AddDriver() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [driver, setDriver] = useState({
        teacher_id: user.userId,
        name: "",
        phone_number: "",
        vehicle_assigned: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Use a single handleChange function for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriver({ ...driver, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages
        
        try {
            const response = await fetch(`https://autotime-api-48989bed2553.herokuapp.com/add_driver`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // ➡️ CORRECTED: Use the 'driver' state variable
                body: JSON.stringify(driver), 
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle non-200 responses from the backend
                throw new Error(data.error || "Failed to add driver");
            }

            setMessage("Driver registered successfully!");
            setTimeout(() => {
                navigate("/admin");
            }, 1000); // Navigate after a short delay to show success message

        } catch (error) {
            console.error("Error occurred:", error);
            setMessage(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="form-wrapper">
            <h1 className="form-title">Add Driver</h1>
            {message && <p className="message">{message}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <input 
                    className="form-input" 
                    type="text" 
                    name="name"
                    placeholder='Name' 
                    value={driver.name}
                    onChange={handleChange} 
                />
                <input 
                    className="form-input" 
                    type="text" 
                    name="phone_number"
                    placeholder='Phone Number' 
                    value={driver.phone_number}
                    onChange={handleChange} 
                />
                <input 
                    className="form-input" 
                    type="text"
                    name="vehicle_assigned"
                    placeholder='Vehicle Assigned'
                    value={driver.vehicle_assigned} 
                    onChange={handleChange} 
                />
                <button type="submit" className="submit-btn">Add Driver</button>
            </form>

            <Link to='/admin'>
                <button className="return-btn primary-btn">Return Back</button>
            </Link>
        </div>
    );
}