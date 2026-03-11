import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const baseUrl = "http://127.0.0.1:8000/api";

function Login() {
    const [studentLoginData, setStudentLoginData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        setStudentLoginData({
            ...studentLoginData,
            [event.target.name]: event.target.value,
        });
    };

    const submitForm = () => {
        const studentFormData = {
            email: studentLoginData.email,
            password: studentLoginData.password,
        };
        setLoading(true);

        axios.post(`${baseUrl}/student-login/`, studentFormData, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => {
            setLoading(false);
            if (res.data.bool === true) {
                localStorage.setItem("studentLoginStatus", "true");
                localStorage.setItem("studentId", res.data.student_id);
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

    const studentLoginStatus = localStorage.getItem("studentLoginStatus");
    if (studentLoginStatus === "true") {
        window.location.href = "/student-dashboard";
    }

    useEffect(() => {
        document.title = "Student Login";
    }, []);

    return (
        <div className="container" style={{ marginTop: "50px" }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4 col-sm-8">
                    <div className="card" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "15px", overflow: "hidden" }}>
                        <div className="card-header" style={{
                            textAlign: "center",
                            backgroundColor: "#007bff",
                            color: "white",
                            fontSize: "1.5rem",
                            padding: "1rem"
                        }}>
                            Student Login
                        </div>
                        <div className="card-body" style={{ padding: "2rem" }}>
                            <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
                                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                                    <label htmlFor="email" style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.5rem",
                                        display: "block",
                                    }}>
                                        Email
                                    </label>
                                    <input type="email" name="email" value={studentLoginData.email} onChange={handleChange} placeholder="Enter your email"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ced4da",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }} />
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
                                            value={studentLoginData.password}
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
                                    style={{
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
                                    {loading ? (
                                        <span>
                                            <i
                                                className="bi bi-arrow-repeat"
                                                style={{ marginRight: "10px" }}
                                            ></i>
                                            Loading...
                                        </span>
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
                                <Link to="/student-register" style={{ color: "#007bff", textDecoration: "none" }}>
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

export default Login;