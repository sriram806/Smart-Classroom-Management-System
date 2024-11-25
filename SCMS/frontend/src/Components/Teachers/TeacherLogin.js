import { useEffect, useState } from "react";
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherLogin() {
    const [errormsg, setErrorMsg] = useState('');
    const [teacherLoginData, setTeacherLoginData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setTeacherLoginData({
            ...teacherLoginData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = () => {
        const teacherFormData = {
            email: teacherLoginData.email,
            password: teacherLoginData.password,
        };

        axios.post(baseUrl + '/teacher-login/', teacherFormData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.data.bool === true) {
                    localStorage.setItem('teacherLoginStatus', true);
                    localStorage.setItem('teacherId', res.data.teacher_id);
                    window.location.href = '/teacher-dashboard';
                } else {
                    setErrorMsg(res.data.error || 'Invalid Email or Password...');
                }
            })
            .catch((error) => {
                console.error("Error occurred during login:", error);
                setErrorMsg('Server Error: Unable to login at the moment.');
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
        <div className="container mt-4">
            <div className="row">
                <div className="col-6 offset-3">
                    <div className="card">
                        <h5 style={{ textAlign: "center" }} className="card-header">Teacher Login Portal</h5>
                        <div className="card-body">
                            {errormsg && <p className="text-danger">{errormsg}</p>}
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={teacherLoginData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={teacherLoginData.password}
                                    onChange={handleChange}
                                    id="exampleInputPassword1"
                                    required
                                />
                            </div>
                            <button type="submit" onClick={submitForm} className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherLogin;