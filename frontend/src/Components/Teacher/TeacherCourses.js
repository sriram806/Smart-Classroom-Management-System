import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherCourses() {
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const teacherId = localStorage.getItem('teacherId');

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/teacher-courses/${teacherId}`);
                setCourseData(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
            setLoading(false);
        };

        if (teacherId) fetchCourses();
    }, [teacherId]);

    const handleDeleteClick = async (course_id) => {
        const result = await Swal.fire({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this course?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${baseUrl}/teacher-course/${teacherId}/courses/${course_id}`);
                Swal.fire('Deleted!', 'The course has been deleted.', 'success');

                // Refresh the course list after deletion
                const response = await axios.get(`${baseUrl}/teacher-courses/${teacherId}`);
                setCourseData(response.data);
            } catch (error) {
                Swal.fire('Error!', 'The course could not be deleted.', 'error');
                console.error("Error deleting course:", error);
            }
        }
    };

    return (
        <div className="container mt-5" style={{ padding: "0 15px" }}>
            <div className="row">
                <aside className="col-md-3" style={{ paddingTop: "20px" }}>
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card shadow-lg rounded" style={{ border: "1px solid #ddd" }}>
                        <h5 className="card-header text-white bg-primary text-center py-3" 
                            style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                            Your Courses
                        </h5>
                        <div className="card-body" style={{ padding: "20px" }}>
                            {loading ? (
                                <p className="text-center">Loading courses...</p>
                            ) : (
                                <table className="table table-striped table-bordered table-hover table-responsive-lg shadow-sm">
                                    <thead className="table-light" style={{ backgroundColor: "#f8f9fa" }}>
                                        <tr>
                                            <th>Name</th>
                                            <th>Image</th>
                                            <th>Total Enrolled</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseData.length > 0 ? (
                                            courseData.map((course, index) => (
                                                <tr key={course.id || index} style={{ borderBottom: "1px solid #ddd" }}>
                                                    <td>
                                                        <Link to={`/all-chapter/${course.id}`} 
                                                            style={{ color: "#007bff", fontWeight: "600" }}>
                                                            {course.title}
                                                        </Link>
                                                        <div style={{ marginTop: "10px" }}>
                                                            {course.course_rating ? (
                                                                <span style={{ color: "#f39c12" }}>
                                                                    Rating: {course.course_rating}/5
                                                                </span>
                                                            ) : (
                                                                <span style={{ color: "#7f8c8d" }}>
                                                                    Rating: 0/5
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <center>
                                                            <img
                                                                src={course.featured_img}
                                                                alt={course.title}
                                                                width="80"
                                                                style={{ borderRadius: "5%", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                                                            />
                                                        </center>
                                                    </td>
                                                    <td>
                                                        <Link to={`/enrolled-students/${course.id}`} 
                                                            style={{ fontWeight: "bold", color: "#28a745" }}>
                                                            {course.total_enrolled_students} Students
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={`/edit-course/${course.id}`} 
                                                            className="btn btn-info btn-sm" 
                                                            style={{ marginRight: "5px" }}>
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Link>
                                                        <Link to={`/add-chapter/${course.id}`} 
                                                            className="btn btn-success btn-sm" 
                                                            style={{ marginRight: "5px" }}>
                                                            <i className="bi bi-plus-square"></i>
                                                        </Link>
                                                        <button className="btn btn-danger btn-sm" 
                                                            style={{ marginRight: "5px" }} 
                                                            onClick={() => handleDeleteClick(course.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">No courses found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TeacherCourses;
