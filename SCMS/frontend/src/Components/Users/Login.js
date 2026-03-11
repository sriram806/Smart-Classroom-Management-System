import { useEffect, useState } from "react";
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

function Login() {
    const [errormsg, setErrorMsg] = useState('');
    const [studentLoginData, setstudentLoginData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setstudentLoginData({
            ...studentLoginData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = () => {
        const studentFormData = {
            email: studentLoginData.email,
            password: studentLoginData.password,
        };

        axios.post(baseUrl + '/student-login/', studentFormData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.data.bool === true) {
                    localStorage.setItem('studentLoginStatus', true);
                    localStorage.setItem('studentId', res.data.student_id);
                    window.location.href = '/student-dashboard';
                } else {
                    setErrorMsg('Invalid Email or Password...');
                }
            })
            .catch((error) => {
                console.error("Error occurred during login:", error);
                setErrorMsg('Server Error: Unable to login at the moment.');
            });
    };

    const teacherLoginStatus = localStorage.getItem('studentLoginStatus');
    if (teacherLoginStatus === 'true') {
        window.location.href = '/student-dashboard';
    }

    useEffect(() => {
        document.title = 'Student | Login';
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-6 offset-3">
                    <div className="card">
                        <h5 style={{ textAlign: "center" }} className="card-header">Student Login Portal</h5>
                        <div className="card-body">
                            {errormsg && <p className="text-danger">{errormsg}</p>}
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={studentLoginData.email}
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
                                    value={studentLoginData.password}
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

export default Login;