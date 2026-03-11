import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api/teacher/';

function TeacherRegister() {
    const [teacherData, setTeacherData] = useState({
        full_name: '',
        email: '',
        password: '',
        qualification: '',
        mobile_no: '',
        skills: '',
        status: ''
    });

    // Change Element value
    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();

        const teacherFormData = new FormData();
        teacherFormData.append("full_name", teacherData.full_name);
        teacherFormData.append("email", teacherData.email);
        teacherFormData.append("password", teacherData.password);
        teacherFormData.append("qualification", teacherData.qualification);
        teacherFormData.append("mobile_no", teacherData.mobile_no);
        teacherFormData.append("skills", teacherData.skills);
        teacherFormData.append("status", teacherData.status);

        try {
            const response = await axios.post(baseUrl, teacherFormData);
            setTeacherData({
                full_name: '',
                email: '',
                password: '',
                qualification: '',
                mobile_no: '',
                skills: '',
                status: 'success'
            });
        } catch (error) {
            console.log('Error response:', error.response?.data);
            setTeacherData((prevData) => ({ ...prevData, status: 'false' }));
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
            <div className="row">
                <div className="col-6 offset-3">
                    {teacherData.status === 'success' && <p className="text-success">Thank you for registering.</p>}
                    {teacherData.status === 'error' && <p className="text-danger">Error in registration. Please try again.</p>}
                    <div className="card">
                        <h5 style={{ textAlign: "center" }} className="card-header">Teacher Register Portal</h5>
                        <div className="card-body">
                            <form onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="full_name" className="form-label">Full Name</label>
                                    <input type="text" name="full_name" value={teacherData.full_name} onChange={handleChange} className="form-control" id="full_name" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name="email" value={teacherData.email} onChange={handleChange} className="form-control" id="email" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name="password" value={teacherData.password} onChange={handleChange} className="form-control" id="password" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="qualification" className="form-label">Qualification</label>
                                    <input type="text" name="qualification" value={teacherData.qualification} onChange={handleChange} className="form-control" id="qualification" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mobile_no" className="form-label">Mobile Number</label>
                                    <input type="text" name="mobile_no" value={teacherData.mobile_no} onChange={handleChange} className="form-control" id="mobile_no" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="skills" className="form-label">Skills</label>
                                    <textarea name="skills" value={teacherData.skills} placeholder="PHP, HTML, CSS, etc." onChange={handleChange} className="form-control" id="skills" required></textarea>
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

export default TeacherRegister;
