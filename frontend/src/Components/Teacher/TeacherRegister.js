import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = 'http://127.0.0.1:8000/api/teacher/';

function TeacherRegister() {
    const [teacherData, setTeacherData] = useState({
        full_name: '',
        email: '',
        password: '',
        qualification: '',
        skills: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setLoading(false);

        const teacherFormData = new FormData();
        teacherFormData.append("full_name", teacherData.full_name);
        teacherFormData.append("email", teacherData.email);
        teacherFormData.append("password", teacherData.password);
        teacherFormData.append("qualification", teacherData.qualification);
        teacherFormData.append("skills", teacherData.skills);

        try {
            const response = await axios.post(baseUrl, teacherFormData);
            setTeacherData({
                full_name: '',
                email: '',
                password: '',
                qualification: '',
                skills: '',
            });
            setLoading(false);
            Swal.fire({
                title: 'Registration Successful!',
                text: 'You have successfully registered. Please log in.',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(() => {
                navigate('/teacher-login');
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
        document.title = "Teacher Registration";
    }, []);

    const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');
    if (teacherLoginStatus === 'success') {
        window.location.href = '/teacher-dashboard';
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-5 col-sm-8">
                    <div className="card" style={{
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
                            Teacher Registration
                        </div>
                        <div className="card-body" style={{ padding: "1rem" }}>
                            <form onSubmit={submitForm}>
                                <div className="form-group" style={{ marginTop: "0.45rem" }}>
                                    <label htmlFor="full_name" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Full Name
                                    </label>
                                    <input type="text" name="full_name" value={teacherData.full_name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        id="full_name"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={teacherData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your Email"
                                        id="email"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
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
                                        <input type={passwordVisible ? "text" : "password"} name="password"
                                            value={teacherData.password} onChange={handleChange}
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
                                <div className="mb-3">
                                    <label htmlFor="qualification" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Qualification
                                    </label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={teacherData.qualification}
                                        onChange={handleChange}
                                        placeholder="Enter your Qualification"
                                        id="qualification"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="skills" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.45rem",
                                        display: "block",
                                    }}>
                                        Skills
                                    </label>
                                    <textarea
                                        name="skills"
                                        value={teacherData.skills}
                                        placeholder="PHP, HTML, CSS, etc."
                                        onChange={handleChange}
                                        className="form-control"
                                        id="skills"
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            padding: '12px',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Register
                                    </button>
                                </div>
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
                                <Link to="/teacher-login" style={{ color: "#007bff", textDecoration: "none" }}>
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

export default TeacherRegister;
