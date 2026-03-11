import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = "http://127.0.0.1:8000/api/";

function TeacherChangePassword() {
    const [teacherData, setteacherData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [passwordStrength, setPasswordStrength] = useState("");
    const teacher_id = localStorage.getItem("teacher_id");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setteacherData({
            ...teacherData,
            [name]: value
        });
        if (name === "password") {
            evaluatePasswordStrength(value);
        }
    };

    const evaluatePasswordStrength = (password) => {
        const strengthCriteria = [
            /.{8,}/, 
            /[A-Z]/, 
            /[a-z]/, 
            /\d/,   
            /[@$!%*?&#]/
        ];

        const score = strengthCriteria.reduce((acc, regex) => (regex.test(password) ? acc + 1 : acc), 0);

        if (score <= 2) setPasswordStrength("Weak");
        else if (score === 3) setPasswordStrength("Moderate");
        else setPasswordStrength("Strong");
    };

    const submitForm = async (event) => {
        event.preventDefault();
        if (teacherData.password !== teacherData.confirmPassword) {
            Swal.fire("Error", "Passwords do not match!", "error");
            return;
        }

        const teacherFormData = new FormData();
        teacherFormData.append("password", teacherData.password);

        try {
            const res = await axios.post(`${baseUrl}teacher/change-password/${teacher_id}/`, teacherFormData);
            if (res.status === 200) {
                Swal.fire("Success", "Password changed successfully!", "success").then(() => {
                    window.location.href = "/teacher-logout";
                });
            }
        } catch (error) {
            Swal.fire("Error", "Failed to change password. Please try again.", "error");
            console.log(error);
        }
    };

    useEffect(() => {
        document.title = "Teacher Change Password";
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="bg-light p-4 rounded border border-2">
                        <h4 className="text-center text-primary mb-4">Change Password</h4>
                        <form onSubmit={submitForm}>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={teacherData.password}
                                    onChange={handleChange}
                                    className="form-control"
                                    id="password"
                                    placeholder="Enter new password"
                                    required
                                />
                                {teacherData.password && (
                                    <small className={`d-block mt-1 ${passwordStrength === "Strong" ? "text-success" : passwordStrength === "Moderate" ? "text-warning" : "text-danger"}`}>
                                        Password Strength: {passwordStrength}
                                    </small>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={teacherData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Re-enter new password"
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-success px-4">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TeacherChangePassword;
