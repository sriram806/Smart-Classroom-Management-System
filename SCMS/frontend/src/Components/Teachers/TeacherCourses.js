import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherCourses() {
    const [courseData, setCourseData] = useState([]);
    const teacherId = localStorage.getItem('teacherId');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseUrl}/teacher-courses/${teacherId}`);
                setCourseData(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card shadow-sm">
                        <h5 className="card-header text-white bg-primary text-center">Your Courses</h5>
                        <div className="card-body">
                            <table className="table table-striped table-bordered table-hover table-responsive-md">
                                <thead className="table-active">
                                    <tr>
                                        <th>Name</th>
                                        <th>Image</th>
                                        <th>Total Enrolled</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.map((course, index) => (
                                        <tr key={course.id || index}>
                                            <td>
                                                <Link to={`/all-chapter/${course.id}`} >{course.title}</Link>
                                                <hr/>
                                                {course.course_rating &&
                                                <spam>Rating: {course.course_rating}/5 </spam>
                                                }
                                                {!course.course_rating &&
                                                <spam>Rating: 0/5 </spam>
                                                }
                                            </td>
                                            <td>
                                                <img src={course.featured_img} width='80' className="rounded" alt={course.title} />
                                            </td>
                                            <td>
                                                <Link to={`/enrolled-students/${course.id}`} className="fw-bold"><span className="text-success">{course.total_enrolled_students} Students</span></Link>
                                            </td>
                                            <td>
                                                <Link to={`/edit-course/${course.id}`} className="btn btn-info text-white btn-sm ms-1">EDIT</Link>
                                                <Link to={"/add-chapter/" + course.id} className="btn btn-success text-white btn-sm ms-2">ADD</Link>
                                                <button className="btn btn-danger text-white btn-sm ms-2">DELETE</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TeacherCourses;
