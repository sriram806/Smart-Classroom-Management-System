import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api/student/';

function Register() {
    const [studentData, setStudentData] = useState({
        full_name: '',
        email: '',
        password: '',
        username: '',
        interested_categories: '',
        status: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudentData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const submitForm = async (event) => {
        event.preventDefault();

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
                interested_categories: '',
                status: 'success'
            });
        } catch (error) {
            console.log('Error response:', error.response?.data);
            setStudentData((prevData) => ({ ...prevData, status: 'error' }));
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
            <div className="row">
                <div className="col-6 offset-3">
                    {studentData.status === 'success' && <p className="text-success">Thank you for registering and re-login</p>}
                    {studentData.status === 'error' && <p className="text-danger">Error in registration. Please try again.</p>}
                    <div className="card">
                        <h5 style={{ textAlign: "center" }} className="card-header">Student Register Portal</h5>
                        <div className="card-body">
                            <form onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="full_name" className="form-label">Full Name</label>
                                    <input type="text" name="full_name" value={studentData.full_name} onChange={handleChange} className="form-control" id="full_name" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name="email" value={studentData.email} onChange={handleChange} className="form-control" id="email" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" name="username" value={studentData.username} onChange={handleChange} className="form-control" id="username" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name="password" value={studentData.password} onChange={handleChange} className="form-control" id="password" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="interested_categories" className="form-label">interested_categories</label>
                                    <textarea name="interested_categories" value={studentData.interested_categories} onChange={handleChange} className="form-control" id="interested_categories" ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;