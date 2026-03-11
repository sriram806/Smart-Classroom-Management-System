import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = "http://127.0.0.1:8000/api";

function AddCourse() {
    const [cats, setCats] = useState([]);
    const [courseData, setCourseData] = useState({
        category: "",
        title: "",
        description: "",
        f_img: null,
        techs: "",
    });
    const [previewImg, setPreviewImg] = useState(null);
    const teacherId = localStorage.getItem("teacherId");

    useEffect(() => {
        // Fetch categories from the API
        axios
            .get(`${baseUrl}/category/`)
            .then((res) => setCats(res.data))
            .catch((error) => {
                console.error("Error fetching categories:", error.message);
                Swal.fire("Error", "Failed to load categories.", "error");
            });
    }, []);

    const handleChange = (event) => {
        setCourseData({
            ...courseData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCourseData({
                ...courseData,
                f_img: file,
            });
            const reader = new FileReader();
            reader.onload = () => setPreviewImg(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const formSubmit = (e) => {
        e.preventDefault();

        if (!teacherId) {
            Swal.fire("Error", "Teacher ID not found. Please log in.", "error");
            return;
        }

        if (
            !courseData.category ||
            !courseData.title ||
            !courseData.description ||
            !courseData.techs ||
            !courseData.f_img
        ) {
            Swal.fire("Error", "All fields are required, including the course image.", "warning");
            return;
        }

        // Prepare form data for submission
        const _formData = new FormData();
        _formData.append("category", courseData.category);
        _formData.append("teacher", teacherId);
        _formData.append("title", courseData.title);
        _formData.append("description", courseData.description);
        _formData.append("featured_img", courseData.f_img, courseData.f_img.name);
        _formData.append("techs", courseData.techs);

        axios
            .post(`${baseUrl}/course/`, _formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                Swal.fire("Success", "Course added successfully!", "success").then(() => {
                    window.location.href = "/teacher-course";
                });
            })
            .catch((error) => {
                if (error.response) {
                    Swal.fire(
                        "Error",
                        "Failed to add course: " + (error.response.data.detail || "Unknown error"),
                        "error"
                    );
                } else {
                    Swal.fire("Error", "Failed to connect to the server.", "error");
                }
            });
    };

    return (
        <div className="container my-5">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h4 className="text-center mb-0">Add New Course</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={formSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">
                                        Course Category
                                    </label>
                                    <select
                                        name="category"
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {cats.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        Course Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        placeholder="Enter course title"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Course Description
                                    </label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        placeholder="Write a brief description of the course"
                                        rows="4"
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="f_img" className="form-label">
                                        Course Image
                                    </label>
                                    <input
                                        type="file"
                                        name="f_img"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        required
                                    />
                                    {previewImg && (
                                        <div className="mt-3">
                                            <img
                                                src={previewImg}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                width="300"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="techs" className="form-label">
                                        Technologies Covered
                                    </label>
                                    <textarea
                                        name="techs"
                                        className="form-control"
                                        placeholder="List the technologies like PHP, JavaScript, etc."
                                        rows="3"
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary w-100 py-2">
                                        Add Course
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AddCourse;
