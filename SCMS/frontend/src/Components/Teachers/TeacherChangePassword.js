import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api/';

function TeacherChangePassword() {
    const [teacherData, setTeacherData] = useState({
        password: '',
    });
    const teacherId = localStorage.getItem('teacherId');

    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();
        const teacherFormData = new FormData();
        teacherFormData.append("password", teacherData.password);

        try {
            const res = await axios.post(`${baseUrl}teacher/change-password/${teacherId}/`, teacherFormData);
            if (res.status === 200) {
                window.location.href = '/teacher-logout';
            }
        } catch (error) {
            console.log(error);
            setTeacherData({ 'status': 'error' });
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
                    <div className="card">
                        <h5 className="card-header">Change Password</h5>
                        <div className="card-body">
                            <form onSubmit={submitForm}>
                                <div className="mb-3 row">
                                    <label htmlFor="password" className="col-sm-2 col-form-label">New Password</label>
                                    <div className="col-sm-10">
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={teacherData.password} 
                                            onChange={handleChange} 
                                            className="form-control" 
                                            id="password" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <hr />
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TeacherChangePassword;
