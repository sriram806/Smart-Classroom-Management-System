import { Link, useParams, useNavigate } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = 'http://127.0.0.1:8000/api';

function EditCourse() {
    const [cats, setCats] = useState([]);
    const [courseData, setCourseData] = useState({
        category: '',
        title: '',
        description: '',
        prev_img: '',
        f_img: '',
        techs: ''
    });

    const { course_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories and course details
        const fetchData = async () => {
            try {
                const categoryRes = await axios.get(`${baseUrl}/category`);
                setCats(categoryRes.data);
            } catch (error) {
                console.log("Error fetching categories:", error);
            }

            try {
                const courseRes = await axios.get(`${baseUrl}/teacher-course-detail/${course_id}`);
                setCourseData({
                    category: courseRes.data.category,
                    title: courseRes.data.title,
                    description: courseRes.data.description,
                    prev_img: courseRes.data.featured_img,
                    f_img: '',
                    techs: courseRes.data.techs,
                });
            } catch (error) {
                console.log("Error fetching course details:", error);
            }
        };

        fetchData();
    }, [course_id]);

    const handleChange = (event) => {
        setCourseData({
            ...courseData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        setCourseData({
            ...courseData,
            [event.target.name]: event.target.files[0]
        });
    };

    const formSubmit = async (event) => {
        event.preventDefault();

        const _formData = new FormData();
        _formData.append('category', courseData.category);
        _formData.append('teacher', 1); 
        _formData.append('title', courseData.title);
        _formData.append('description', courseData.description);

        if (courseData.f_img !== '') {
            _formData.append('featured_img', courseData.f_img, courseData.f_img.name);
        }

        _formData.append('techs', courseData.techs);

        try {
            const res = await axios.put(`${baseUrl}/teacher-course-detail/${course_id}/`, _formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Course updated successfully:', res.data);
            Swal.fire({
                title: 'Success!',
                text: 'Course updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/teacher-course');
            });
        } catch (error) {
            console.error('Error updating course:', error.response ? error.response.data : error.message);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update the course.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header text-white bg-primary text-center">UPDATE COURSE : {courseData.title}</h5>
                        <div className="card-body">
                            <form onSubmit={formSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select
                                        name="category"
                                        onChange={handleChange}
                                        value={courseData.category}
                                        className="form-control"
                                    >
                                        <option value="">Select Category</option>
                                        {cats.map((category, index) => (
                                            <option key={index} value={category.id}>{category.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        onChange={handleChange}
                                        name="title"
                                        className="form-control"
                                        id="title"
                                        value={courseData.title}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        onChange={handleChange}
                                        name="description"
                                        id="description"
                                        value={courseData.description}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="f_img" className="form-label">Featured Image</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        name="f_img"
                                        className="form-control"
                                        id="f_img"
                                    />
                                    {courseData.prev_img && (
                                        <p className="mt-3">
                                            <img src={courseData.prev_img} width="300" alt="Course" />
                                        </p>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="techs" className="form-label">Technologies</label>
                                    <textarea
                                        className="form-control"
                                        onChange={handleChange}
                                        name="techs"
                                        placeholder="PHP, HTML, etc."
                                        id="techs"
                                        value={courseData.techs}
                                    ></textarea>
                                </div>
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <button type="submit" className="btn btn-primary mt-2">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EditCourse;