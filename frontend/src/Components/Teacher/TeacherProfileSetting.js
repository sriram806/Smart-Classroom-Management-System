import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = "http://127.0.0.1:8000/api/";

function TeacherProfileSetting() {
    const [teacherData, setTeacherData] = useState({
        full_name: "",
        qualification: "",
        mobile_no: "",
        skills: "",
        profile_img: "",
        p_img: "",
    });
    const teacherId = localStorage.getItem("teacherId");

    useEffect(() => {
        fetchTeacherData();
    }, [teacherId]);

    const fetchTeacherData = () => {
        try {
            axios.get(`${baseUrl}teacher/${teacherId}`).then((res) => {
                setTeacherData({
                    full_name: res.data.full_name,
                    qualification: res.data.qualification,
                    mobile_no: res.data.mobile_no,
                    skills: res.data.skills,
                    profile_img: res.data.profile_img,
                    p_img: ""
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
        const updatedData = new FormData();
        updatedData.append("full_name", teacherData.full_name);
        updatedData.append("qualification", teacherData.qualification);
        updatedData.append("mobile_no", teacherData.mobile_no);
        updatedData.append("skills", teacherData.skills);

        if (teacherData.profile_img instanceof File) {
            updatedData.append("profile_img", teacherData.profile_img);
        }

        try {
            const res = await axios.put(`${baseUrl}teacher/update/${teacherId}/`, updatedData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.status === 200) {
                Swal.fire("Success", "Profile updated successfully!", "success");
            }
        } catch (error) {
            Swal.fire("Error", "Failed to update profile. Please try again.", "error");
            console.log(error);
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
                    <div className="bg-light p-4 rounded border border-2">
                        <h4 className="text-center text-primary mb-4">Teacher Profile Settings</h4>
                        <form onSubmit={submitForm}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="full_name" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={teacherData.full_name}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="full_name"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="mobile_no" className="form-label">
                                        Mobile No
                                    </label>
                                    <input
                                        type="text"
                                        name="mobile_no"
                                        value={teacherData.mobile_no}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="mobile_no"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="qualification" className="form-label">
                                        Qualification
                                    </label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={teacherData.qualification}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="qualification"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="skills" className="form-label">
                                    Skills
                                </label>
                                <textarea
                                    name="skills"
                                    value={teacherData.skills}
                                    onChange={handleChange}
                                    className="form-control"
                                    id="skills"
                                    placeholder="PHP, HTML, CSS, etc."
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="profile_img" className="form-label">
                                    Profile Photo
                                </label>
                                <input
                                    type="file"
                                    name="profile_img"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    id="profile_img"
                                />
                                {teacherData.profile_img && (
                                    <div className="mt-3">
                                        <img
                                            src={
                                                teacherData.profile_img instanceof File
                                                    ? URL.createObjectURL(teacherData.profile_img)
                                                    : teacherData.profile_img
                                            }
                                            width="150"
                                            alt={teacherData.full_name}
                                            className="img-thumbnail"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-success px-4">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TeacherProfileSetting;