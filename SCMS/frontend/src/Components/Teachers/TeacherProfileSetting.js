import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api/';

function TeacherProfileSetting() {
    const [teacherData, setTeacherData] = useState({
        full_name: '',
        email: '',
        qualification: '',
        mobile_no: '',
        skills: '',
        profile_img: '',
        p_img: '',
        status: ''
    });
    const teacherId = localStorage.getItem('teacherId');

    useEffect(() => {
        fetchTeacherData();
    }, [teacherId]);

    const fetchTeacherData = () => {
        try {
            axios.get(`${baseUrl}teacher/${teacherId}`)
                .then((res) => {
                    setTeacherData({
                        full_name: res.data.full_name,
                        email: res.data.email,
                        qualification: res.data.qualification,
                        mobile_no: res.data.mobile_no,
                        skills: res.data.skills,
                        profile_img: res.data.profile_img,
                        p_img: '',
                    });
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        setTeacherData({
            ...teacherData,
            profile_img: event.target.files[0]
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();

        const teacherFormData = new FormData();
        teacherFormData.append("full_name", teacherData.full_name);
        teacherFormData.append("email", teacherData.email);
        teacherFormData.append("qualification", teacherData.qualification);
        teacherFormData.append("mobile_no", teacherData.mobile_no);
        teacherFormData.append("skills", teacherData.skills);

        // Check if profile_img is a File object before appending
        if (teacherData.profile_img instanceof File) {
            teacherFormData.append('profile_img', teacherData.profile_img, teacherData.profile_img.name);
        }

        try {
            await axios.put(`${baseUrl}teacher/${teacherId}/`, teacherFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                setTeacherData({
                    ...teacherData,
                    ...response.data,
                    status: 'success'
                });
                Swal.fire('Success', 'Profile updated successfully', 'success');
            });
        } catch (error) {
            console.log('Error response:', error.response?.data);
            setTeacherData((prevData) => ({ ...prevData, status: 'false' }));
            Swal.fire('Error', 'Profile update failed', 'error');
        }
    };

    useEffect(() => {
        document.title = "Teacher Profile Setting";
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 style={{ textAlign: "center" }} className="card-header">Teacher Profile Settings</h5>
                        <div className="card-body">
                            <form onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="full_name" className="form-label">Full Name</label>
                                    <input type="text" name="full_name" value={teacherData.full_name} onChange={handleChange} className="form-control" id="full_name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name="email" value={teacherData.email} onChange={handleChange} className="form-control" id="email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profile_img" className="form-label">Profile Photo</label>
                                    <input type="file" name="profile_img" onChange={handleFileChange} className="form-control" id="profile_img" />
                                    {teacherData.profile_img &&
                                        <p className="mt-2"><img src={teacherData.profile_img} width="300" alt={teacherData.full_name} /></p>
                                    }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mobile_no" className="form-label">Mobile No</label>
                                    <input type="text" name="mobile_no" value={teacherData.mobile_no} onChange={handleChange} className="form-control" id="mobile_no" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="skills" className="form-label">Skills</label>
                                    <textarea name="skills" value={teacherData.skills} placeholder="PHP, HTML, CSS, etc." onChange={handleChange} className="form-control" id="skills"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="qualification" className="form-label">Qualification</label>
                                    <input type="text" name="qualification" value={teacherData.qualification} onChange={handleChange} className="form-control" id="qualification" />
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

export default TeacherProfileSetting;
