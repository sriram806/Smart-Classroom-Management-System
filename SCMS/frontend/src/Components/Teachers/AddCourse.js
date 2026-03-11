import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api';

function AddCourse() {
    const [cats, setCats] = useState([]);
    const [courseData, setCourseData] = useState({
        category: '',
        title: '',
        description: '',
        f_img: null,
        techs: ''
    });

    const teacherId = localStorage.getItem('teacherId');

    // Fetch categories from the API
    useEffect(() => {
        axios.get(`${baseUrl}/category/`)
            .then((res) => setCats(res.data))
            .catch((error) => {
                console.error("Error fetching categories:", error.message);
                alert("Failed to load categories.");
            });
    }, []);

    const handleChange = (event) => {
        setCourseData({
            ...courseData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCourseData({
                ...courseData,
                f_img: file
            });
        }
    };

    const formSubmit = (e) => {
        e.preventDefault();

        if (!teacherId) {
            alert("Teacher ID not found. Please log in.");
            return;
        }

        if (!courseData.category || !courseData.title || !courseData.description || !courseData.techs || !courseData.f_img) {
            alert("All fields are required, including the course image.");
            return;
        }

        // Prepare form data for submission
        const _formData = new FormData();
        _formData.append('category', courseData.category);
        _formData.append('teacher', teacherId);
        _formData.append('title', courseData.title);
        _formData.append('description', courseData.description);
        _formData.append('featured_img', courseData.f_img, courseData.f_img.name);
        _formData.append('techs', courseData.techs);

        console.log("Submitting Form Data:");
        for (const [key, value] of _formData.entries()) {
            console.log(`${key}:`, value);
        }

        axios.post(`${baseUrl}/course/`, _formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
            alert("Course added successfully!");
            console.log("Response:", res.data);
            window.location.href = '/teacher-course';
        })
        .catch((error) => {
            if (error.response) {
                console.error("Error Response:", error.response.data);
                alert("Failed to add course: " + (error.response.data.detail || "Unknown error"));
            } else {
                console.error("Network Error:", error.message);
                alert("Failed to connect to the server.");
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header text-center bg-primary text-white">Add Course</h5>
                        <div className="card-body">
                            <form onSubmit={formSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select name="category" onChange={handleChange} className="form-control" required>
                                        <option value="">Select Category</option>
                                        {cats.map((category) => (
                                            <option key={category.id} value={category.id}>{category.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="f_img" className="form-label">Course Image</label>
                                    <input
                                        type="file"
                                        name="f_img"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="techs" className="form-label">Technologies</label>
                                    <textarea
                                        name="techs"
                                        className="form-control"
                                        placeholder="PHP, HTML, etc."
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AddCourse;