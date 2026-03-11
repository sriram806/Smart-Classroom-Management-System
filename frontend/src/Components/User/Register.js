import { useEffect, useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate,Link } from 'react-router-dom';

const baseUrl = 'http://127.0.0.1:8000/api/student/';

function Register() {
    const [studentData, setStudentData] = useState({
        full_name: '',
        email: '',
        password: '',
        username: '',
        interested_categories: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudentData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    const validateForm = () => {
        const { full_name, email, password, mobile_no } = studentData;
        if (!full_name || !email || !password || !mobile_no) {
            Swal.fire("Error!", "All fields are required.", "error");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            Swal.fire("Error!", "Invalid email format.", "error");
            return false;
        }
        if (password.length < 6) {
            Swal.fire("Error!", "Password must be at least 6 characters.", "error");
            return false;
        }
        if (!/^\d{10}$/.test(mobile_no)) {
            Swal.fire("Error!", "Invalid mobile number.", "error");
            return false;
        }
        return true;
    };
    const submitForm = async (event) => {
        if (!validateForm()) return;
        event.preventDefault();
        setLoading(true);

        const studentFormData = new FormData();
        studentFormData.append("full_name", studentData.full_name);
        studentFormData.append("email", studentData.email);
        studentFormData.append("password", studentData.password);
        studentFormData.append("username", studentData.username);
        studentFormData.append("interested_categories", studentData.interested_categories);

        try {
            const response = await axios.post(baseUrl, studentFormData);
            setStudentData({
                full_name: '',
                email: '',
                password: '',
                username: '',
                interested_categories: ''
            });
            setLoading(false);
            Swal.fire({
                title: 'Registration Successful!',
                text: 'You have successfully registered. Please log in.',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(() => {
                navigate('/student-login');
            });
        } catch (error) {
            setLoading(false);
            if (error.response?.data?.email) {
                Swal.fire({
                    title: 'Error!',
                    text: 'This email is already in use. Please try another one.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            } else if (error.response?.data?.username) {
                Swal.fire({
                    title: 'Error!',
                    text: 'This username is already taken. Please choose another one.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            }
        }
    };

    useEffect(() => {
        document.title = "Student Registration";
    }, []);

    const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');
    if (teacherLoginStatus === 'success') {
        window.location.href = '/student-dashboard';
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-5 col-sm-8">
                    <div className="card " style={{
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        borderRadius: "15px",
                        overflow: "hidden",
                    }}>
                        <div className="card-header" style={{
                            textAlign: "center",
                            backgroundColor: "#007bff",
                            color: "white",
                            fontSize: "1.5rem",
                            padding: "1rem",
                        }}>
                            Student Registration
                        </div>
                        <div className="card-body" style={{ padding: "1rem" }}>
                            <form onSubmit={submitForm}>
                                <div className="form-group" style={{ marginBottom: "0.45rem" }}>
                                    <label htmlFor="full_name" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Full Name
                                    </label>
                                    <input type="text" name="full_name" value={studentData.full_name}
                                        onChange={handleChange} placeholder="Enter your full name" id="full_name" required style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}/>
                                </div>
                                <div className="form-group" style={{ marginBottom: "0.45rem" }}>
                                    <label htmlFor="email" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Email
                                    </label>
                                    <input type="email" name="email" value={studentData.email}
                                        onChange={handleChange} placeholder="Enter your email" id="email"
                                        required style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}/>
                                </div>
                                <div className="form-group" style={{ marginBottom: "0.45rem" }}>
                                    <label htmlFor="username" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Username
                                    </label>
                                    <input type="text" name="username" value={studentData.username}
                                        onChange={handleChange} placeholder="Enter your Username" id="username" required style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}/>
                                </div>
                                <div className="form-group" style={{ marginBottom: "0.45rem" }}>
                                    <label htmlFor="password"
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: "0.45rem",
                                            display: "block",
                                        }}>
                                        Password
                                    </label>
                                    <div className="password-container" style={{ position: "relative" }}>
                                        <input type={passwordVisible ? "text" : "password"}  name="password"
                                            value={studentData.password} onChange={handleChange}
                                            placeholder="Enter your password" required style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "10px",
                                                border: "1px solid #ced4da",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }} />
                                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} 
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "1.2rem",
                                                color: "#007bff",
                                                transition: "color 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => (e.target.style.color = "#0056b3")}
                                            onMouseLeave={(e) => (e.target.style.color = "#007bff")}>
                                            {passwordVisible ? "👁️" : "👁️‍🗨️"} 
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: "0.45rem" }}>
                                    <label htmlFor="interested_categories" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Interested Categories
                                    </label>
                                    <textarea name="interested_categories" value={studentData.interested_categories}
                                        onChange={handleChange} placeholder="Interested Categories" id="interested_categories" style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}/>
                                </div>
                                <button type="submit" style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "10px",
                                    fontSize: "1.1rem",
                                    color: "#fff",
                                    backgroundColor: "#007bff",
                                    border: "none",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "background-color 0.3s ease",
                                }}
                                    disabled={loading}
                                    onMouseEnter={(e) =>
                                        (e.target.style.backgroundColor = "#0056b3")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.backgroundColor = "#007bff")
                                    }>
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </form>
                        </div>
                        <div className="card-footer"
                            style={{
                                textAlign: "center",
                                padding: "1rem",
                                backgroundColor: "#f8f9fa",
                                fontSize: "0.9rem",
                            }}>
                            <small>
                                Already have an account?{" "}
                                <Link to="/student-login" style={{ color: "#007bff", textDecoration: "none" }}>
                                    Login here
                                </Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
