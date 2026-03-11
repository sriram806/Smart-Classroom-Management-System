import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = 'http://127.0.0.1:8000/api';

function CourseDetail() {
    const [courseData, setCourseData] = useState({});
    const [teacherData, setTeacherData] = useState({});
    const [chapterData, setChapterData] = useState([]);
    const [techlistData, setTechlistData] = useState([]);
    const [userLoginStatus, setUserLoginStatus] = useState(false);
    const [enrollStatus, setEnrollStatus] = useState(false);
    const [ratingStatus, setRatingStatus] = useState(false);
    const [AvgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [ratingData, setRatingData] = useState({
        rating: '',
        reviews: '',
    });
    
    const { course_id } = useParams();
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await axios.get(`${baseUrl}/course/${course_id}`);
                if (courseRes.data) {
                    setCourseData(courseRes.data);
                    setChapterData(courseRes.data.course_chapters || []);
                    setTeacherData(courseRes.data.teacher || {});
                    setTechlistData(courseRes.data.tech_list || []);
                    setAvgRating(courseRes.data.course_rating || 0);
                }

                if (studentId) {
                    const [enrollRes, ratingRes] = await Promise.all([
                        axios.get(`${baseUrl}/fetch-enroll-status/${studentId}/${course_id}`),
                        axios.get(`${baseUrl}/fetch-rating-status/${studentId}/${course_id}`),
                    ]);
                    setEnrollStatus(enrollRes.data.bool);
                    setRatingStatus(ratingRes.data.bool);
                }
            } catch (error) {
                console.log("Error loading course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const studentLoginStatus = localStorage.getItem('studentLoginStatus');
        setUserLoginStatus(studentLoginStatus === 'true');
    }, [course_id, studentId]);

    const enrollCourse = async () => {
        if (!studentId) {
            return Swal.fire({
                title: 'Please log in to enroll in the course',
                icon: 'warning',
                timer: 3000,
                position: 'top-right',
                showCancelButton: false,
                timerProgressBar: true,
            });
        }

        try {
            const formData = new FormData();
            formData.append('course', course_id);
            formData.append('student', studentId);

            const res = await axios.post(`${baseUrl}/student-enroll-course/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200 || res.status === 201) {
                setEnrollStatus(true);
                Swal.fire({
                    title: 'Successfully enrolled in the course!',
                    icon: 'success',
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showCancelButton: false,
                });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Enrollment failed!';
            Swal.fire({
                title: errorMsg,
                icon: 'error',
                timer: 3000,
                position: 'top-right',
                showCancelButton: false,
                timerProgressBar: true,
            });
        }
    };

    const handleChange = (event) => {
        setRatingData({
            ...ratingData,
            [event.target.name]: event.target.value
        });
    };

    const submitRating = async (event) => {
        event.preventDefault();
        
        if (!ratingData.rating) {
            return Swal.fire({
                title: 'Please select a rating',
                icon: 'warning',
                timer: 3000,
                position: 'top-right',
                showCancelButton: false,
                timerProgressBar: true,
            });
        }

        try {
            const formData = new FormData();
            formData.append('course', course_id);
            formData.append('student', studentId);
            formData.append('rating', ratingData.rating);
            formData.append('reviews', ratingData.reviews);

            const res = await axios.post(`${baseUrl}/course-rating/${course_id}`, formData);

            if (res.status === 200 || res.status === 201) {
                setRatingStatus(true);
                Swal.fire({
                    title: 'Rating has been successfully added!',
                    icon: 'success',
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showCancelButton: false,
                });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Error adding rating!';
            Swal.fire({
                title: errorMsg,
                icon: 'error',
                timer: 3000,
                position: 'top-right',
                showCancelButton: false,
                timerProgressBar: true,
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={courseData.featured_img}
                        className="img-fluid img-thumbnail"
                        alt={courseData.title || 'Course Image'}
                    />
                </div>
                <div className="col-md-8">
                    <h3>{courseData.title || 'Course Title'}</h3>
                    <p>{courseData.description || 'Course Description'}</p>
                    <p className="fw-bold">
                        Course by: <Link to={`/teacher-detail/${teacherData.id}`} className="text-primary">{teacherData.full_name || 'Unknown Teacher'}</Link>
                    </p>
                    <p className="fw-bold">Techs:
                        {techlistData.length > 0 ? (
                            techlistData.map((tech, index) => (
                                <Link
                                    to={`/category/${tech.trim()}`}
                                    className="badge bg-warning text-dark ms-2"
                                    key={index}
                                >
                                    {tech}
                                </Link>
                            ))
                        ) : (
                            <span>No technologies listed</span>
                        )}
                    </p>
                    <p className="fw-bold">Course Duration: <span className="text-success">4 hours 30 mins</span></p>
                    <p className="fw-bold">Total Enrolled: <span className="text-success">{courseData.total_enrolled_students} Students</span></p>
                    <p className="fw-bold">Course Rating: {AvgRating}/5</p>

                    {userLoginStatus && (
                        <>
                            {enrollStatus && !ratingStatus &&
                                <button className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#ratingModal">Rate</button>
                            }
                            {ratingStatus &&
                                <h5 className="btn btn-sm btn-info text-dark m-2">You already rated this course</h5>
                            }
                            <div className="modal fade" id="ratingModal" tabIndex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="ratingModalLabel">Rate this Course</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={submitRating}>
                                                <div className="mb-3">
                                                    <label className="form-label">Rating:</label>
                                                    <select className="form-control" onChange={handleChange} name="rating" value={ratingData.rating}>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Review</label>
                                                    <textarea onChange={handleChange} className="form-control" name="reviews" value={ratingData.reviews}></textarea>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {!enrollStatus && userLoginStatus && <button className="btn btn-success" onClick={enrollCourse}>Enroll Now</button>}
                </div>
            </div>

            <hr />
            <h5>Chapters</h5>
            <ul className="list-group">
                {chapterData.length > 0 ? (
                    chapterData.map((chapter, index) => (
                        <li key={index} className="list-group-item">{chapter.title}</li>
                    ))
                ) : (
                    <li className="list-group-item">No chapters available</li>
                )}
            </ul>
        </div>
    );
}

export default CourseDetail;
