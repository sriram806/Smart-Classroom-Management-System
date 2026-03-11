import { useEffect, useState } from "react";
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherLogin() {
    const [teacherLoginData, setTeacherLoginData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        setTeacherLoginData({
            ...teacherLoginData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = (e) => {
        e.preventDefault();  // Prevent default form submission
        setLoading(true); // Start loading spinner

        const teacherFormData = {
            email: teacherLoginData.email,
            password: teacherLoginData.password,
        };

        axios.post(baseUrl + '/teacher-login/', teacherFormData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            setLoading(false);
            if (res.data.bool === true) {
                localStorage.setItem('teacherLoginStatus', 'true');
                localStorage.setItem('teacherId', res.data.teacher_id);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: "Invalid Email or Password. Please try again.",
                    confirmButtonText: "Try Again",
                });
            }
        }).catch((error) => {
            setLoading(false);
            console.error("Error occurred during login:", error);
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Unable to login at the moment. Please try again later.",
                confirmButtonText: "Ok",
            });
        });
    };

    const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');
    if (teacherLoginStatus === 'true') {
        window.location.href = '/teacher-dashboard';
    }

    useEffect(() => {
        document.title = 'Teacher | Login';
    }, []);

    return (
        <div className="container " style={{ marginTop: "50px" }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4 col-sm-8">
                    <div className="card" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "15px" }}>
                        <div className="card-header" style={{ textAlign: "center", backgroundColor: "#007bff", color: "white", fontSize: "1.5rem", borderTopLeftRadius: "15px", borderTopRightRadius: "15px", padding: "1rem" }}>
                            Teacher Login
                        </div>
                        <div className="card-body" style={{ padding: "2rem" }}>
                            <form onSubmit={submitForm}>
                                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                                    <label htmlFor="formEmail" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={teacherLoginData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="form-control"
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: "2rem" }}>
                                    <label
                                        htmlFor="password"
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: "0.5rem",
                                            display: "block",
                                        }}>
                                        Password
                                    </label>
                                    <div
                                        className="password-container"
                                        style={{ position: "relative" }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={teacherLoginData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            required
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "10px",
                                                border: "1px solid #ced4da",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }} />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer",
                                                fontSize: "0.9rem",
                                                color: "blue",
                                            }}>
                                            {showPassword ? "👁️" : "👁️‍🗨️"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    style={{
                                        padding: "0.75rem",
                                        borderRadius: "10px",
                                        fontSize: "1.1rem",
                                        backgroundColor: "#007bff",
                                        borderColor: "#007bff",
                                        transition: "all 0.3s ease"
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" /> Loading...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </form>
                        </div>
                        <div
                            className="card-footer"
                            style={{
                                textAlign: "center",
                                padding: "1rem",
                                backgroundColor: "#f8f9fa",
                                fontSize: "0.9rem",
                            }}
                        >
                            <small>
                                Don't have an account?{" "}
                                <Link to="/teacher-register" style={{ color: "#007bff", textDecoration: "none" }}>
                                    Register here
                                </Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherLogin;
