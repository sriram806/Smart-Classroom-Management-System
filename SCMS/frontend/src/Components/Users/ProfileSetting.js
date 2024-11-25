import { Link } from "react-router-dom";
import Slidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api/';

function ProfileSetting() {
    const [studentData, setstudentData] = useState({
        full_name: '',
        email: '',
        username: '',
        interested_categories: '',
        profile_img: '',
        p_img: '',
    });
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = () => {
        try {
            axios.get(`${baseUrl}student/${studentId}`)
                .then((res) => {
                    setstudentData({
                        full_name: res.data.full_name,
                        email: res.data.email,
                        interested_categories: res.data.interested_categories,
                        username: res.data.username,
                        profile_img: res.data.profile_img,
                        p_img: '',
                    });
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setstudentData({
            ...studentData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        setstudentData({
            ...studentData,
            profile_img: event.target.files[0]
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();

        const studentFormData = new FormData();
        studentFormData.append("full_name", studentData.full_name);
        studentFormData.append("email", studentData.email);
        studentFormData.append("username", studentData.username);
        studentFormData.append("interested_categories", studentData.interested_categories);
        
        // Append profile image if it's a new file
        if (studentData.profile_img instanceof File) {
            studentFormData.append('profile_img', studentData.profile_img, studentData.profile_img.name);
        }

        try {
            await axios.put(`${baseUrl}student/${studentId}/`, studentFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                setstudentData({
                    ...studentData,
                    ...response.data,
                    status: 'success'
                });
                Swal.fire('Success', 'Profile updated successfully', 'success');
            });
        } catch (error) {
            console.log('Error response:', error.response?.data);
            setstudentData((prevData) => ({ ...prevData, status: 'false' }));
            Swal.fire('Error', 'Profile update failed', 'error');
        }
    };

    useEffect(() => {
        document.title = "Student Profile Setting";
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <Slidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 style={{ textAlign: "center" }} className="card-header">Student Profile Settings</h5>
                        <div className="card-body">
                            <form onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="full_name" className="form-label">Full Name</label>
                                    <input type="text" name="full_name" value={studentData.full_name} onChange={handleChange} className="form-control" id="full_name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name="email" value={studentData.email} onChange={handleChange} className="form-control" id="email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" name="username" value={studentData.username} onChange={handleChange} className="form-control" id="username" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profile_img" className="form-label">Profile Photo</label>
                                    <input type="file" name="profile_img" onChange={handleFileChange} className="form-control" id="profile_img" />
                                    {studentData.profile_img && !(studentData.profile_img instanceof File) &&
                                        <p className="mt-2"><img src={studentData.profile_img} width="300" alt={studentData.full_name} /></p>
                                    }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="interested_categories" className="form-label">Interested Categories</label>
                                    <input type="text" name="interested_categories" value={studentData.interested_categories} onChange={handleChange} className="form-control" id="interested_categories" />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProfileSetting;
