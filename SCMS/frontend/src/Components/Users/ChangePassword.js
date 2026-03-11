import { Link } from "react-router-dom";
import Slidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api/';

function ChangePassword() {
    const [StudentData, setStudentData] = useState({
        password: '',
    });
    const studentId = localStorage.getItem('studentId');

    const handleChange = (event) => {
        setStudentData({
            ...StudentData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();
        const studentFormData = new FormData();
        studentFormData.append("password", StudentData.password);

        try {
            const res = await axios.post(`${baseUrl}student/change-password/${studentId}/`, studentFormData);
            if (res.status === 200) {
                window.location.href = '/student-logout';
            }
        } catch (error) {
            console.log(error);
            setStudentData({ 'status': 'error' });
        }
    };

    useEffect(() => {
        document.title = "Student Change Password";
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <Slidebar />
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
                                            value={StudentData.password} 
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

export default ChangePassword;
