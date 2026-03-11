import { useState, useEffect } from "react"; // Removed 'Link'
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";

const baseUrl = "http://127.0.0.1:8000/api/";

function ProfileSetting() {
    const [studentData, setStudentData] = useState({
        full_name: "",
        roll_number: "",
        username: "",
        interested_categories: "",
        student_profile_img: "",
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const studentId = localStorage.getItem("studentId");

    useEffect(() => {
        if (!studentId) {
            console.error("Student ID not found!");
            return;
        }

        const fetchStudentData = async () => {
            try {
                const res = await axios.get(`${baseUrl}student/${studentId}`);
                setStudentData({
                    full_name: res.data.full_name,
                    roll_number: res.data.roll_number,
                    username: res.data.username,
                    interested_categories: res.data.interested_categories,
                    student_profile_img: res.data.profile_img, // Ensure backend returns correct field
                });
            } catch (error) {
                console.error("Error fetching student data:", error);
                Swal.fire("Error", "Failed to fetch profile data. Please try again.", "error");
            }
        };

        fetchStudentData();
    }, [studentId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setStudentData((prevData) => ({
            ...prevData,
            student_profile_img: file,
        }));
        setPreviewImage(file ? URL.createObjectURL(file) : null);
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const updatedData = new FormData();
        updatedData.append("full_name", studentData.full_name);
        updatedData.append("roll_number", studentData.roll_number);
        updatedData.append("username", studentData.username);
        updatedData.append("interested_categories", studentData.interested_categories);

        if (studentData.student_profile_img instanceof File) {
            updatedData.append("profile_img", studentData.student_profile_img); // Ensure correct field
        }

        try {
            const res = await axios.put(`${baseUrl}student/update/${studentId}/`, updatedData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                Swal.fire("Success", "Profile updated successfully!", "success");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            Swal.fire("Error", "Failed to update profile. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Student Profile Setting";
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <Sidebar />
                </aside>
                <section className="col-md-9">
                    <div className="bg-light p-4 rounded border border-2">
                        <h4 className="text-center text-primary mb-4">Student Profile Settings</h4>
                        <form onSubmit={submitForm}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="full_name" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={studentData.full_name}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="full_name"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="roll_number" className="form-label">
                                        Roll Number
                                    </label>
                                    <input
                                        type="number"
                                        name="roll_number"
                                        value={studentData.roll_number}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="roll_number"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="username" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={studentData.username}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="username"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="interested_categories" className="form-label">
                                        Interested Categories
                                    </label>
                                    <textarea
                                        name="interested_categories"
                                        value={studentData.interested_categories}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="interested_categories"
                                        placeholder="PHP, HTML, CSS, etc."
                                        required
                                    ></textarea>
                                </div>
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
                                {studentData.student_profile_img && (
                                    <div className="mt-3">
                                        <img
                                            src={studentData.student_profile_img}
                                            width="150"
                                            alt={studentData.full_name}
                                            className="img-thumbnail"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-success px-4" disabled={isLoading}>
                                    {isLoading ? "Updating..." : "Update Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProfileSetting;
