import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {FaHeart} from "react-icons/fa"; 

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
    const { course_id } = useParams();
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        // Fetch course data
        const fetchCourseData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/course/${course_id}`);
                setCourseData(res.data);
                setChapterData(res.data.course_chapters || []);
                setTeacherData(res.data.teacher || {});
                setTechlistData(res.data.tech_list || []);
                if (res.data.course_rating) {
                    setAvgRating(res.data.course_rating);
                }
            } catch (error) {
                console.log("Error loading course data:", error);
            }
        };

        fetchCourseData();

        const studentLoginStatus = localStorage.getItem('studentLoginStatus');
        if (studentLoginStatus === 'true') {
            setUserLoginStatus(true);
        }

        // Check enrollment status
        if (studentId) {
            axios.get(`${baseUrl}/fetch-enroll-status/${studentId}/${course_id}`)
                .then((res) => setEnrollStatus(res.data.bool))
                .catch((error) => console.log("Error fetching enrollment status:", error));

            // Check rating status
            axios.get(`${baseUrl}/fetch-rating-status/${studentId}/${course_id}`)
                .then((res) => setRatingStatus(res.data.bool))
                .catch((error) => console.log("Error fetching rating status:", error));
        }


    }, [course_id, studentId]);

    const enrollCourse = () => {
        if (!studentId) {
            Swal.fire({
                title: 'Please log in to enroll in the course',
                icon: 'warning',
                timer: 3000,
                position: 'top-right',
                showCancelButton: false,
                timerProgressBar: true,
            });
            return;
        }

        const formData = new FormData();
        formData.append('course', course_id);
        formData.append('student', studentId);

        axios.post(`${baseUrl}/student-enroll-course/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    Swal.fire({
                        title: 'Successfully enrolled in the course!',
                        icon: 'success',
                        toast: true,
                        timer: 3000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showCancelButton: false,
                    });
                    setEnrollStatus(true);
                }
            })
            .catch((error) => {
                console.log("Error during enrollment:", error);
                Swal.fire({
                    title: 'Enrollment failed!',
                    text: error.response ? error.response.data.error : 'An unknown error occurred.',
                    icon: 'error',
                    timer: 3000,
                    position: 'top-right',
                    showCancelButton: false,
                    timerProgressBar: true,
                });
            });        
    };

    //Add Favourite Course
    const markAsFavourite=()=>{
         
    }
    // Add Review
    const [ratingData, setRatingData] = useState({
        rating: '',
        reviews: '',
    });

    const handleChange = (event) => {
        setRatingData({
            ...ratingData,
            [event.target.name]: event.target.value
        });
    };

    const formSubmit = async (event) => {
        event.preventDefault();
        const _formData = new FormData();
        _formData.append('course', course_id);
        _formData.append('student', studentId);
        _formData.append('rating', ratingData.rating);
        _formData.append('reviews', ratingData.reviews);
        try {
            const res = await axios.post(`${baseUrl}/course-rating/${course_id}`, _formData);
            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    title: 'Rating has been successfully added!',
                    icon: 'success',
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showCancelButton: false
                });
                window.location.reload();
            }
        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };

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
                        {techlistData.map((tech, index) => (
                            <Link
                                to={`/category/${tech.trim()}`}
                                className="badge bg-warning text-dark ms-2"
                                key={index}
                            >
                                {tech}
                            </Link>
                        ))}
                    </p>
                    <p className="fw-bold">Course Duration: <span className="text-success">4 hours 30 mins</span></p>
                    <p className="fw-bold">Total Enrolled: <span className="text-success">{courseData.total_enrolled_students} Students</span></p>
                    <p className="fw-bold">Course Rating: {AvgRating}/5</p>
                    {enrollStatus && userLoginStatus &&
                        <>
                            {ratingStatus !== true &&
                                <button className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#ratingModal">Rate</button>
                            }
                            {ratingStatus === true &&
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
                                            <form onSubmit={formSubmit}>
                                                <div className="mb-3">
                                                    <label className="form-label">Rating:</label>
                                                    <select className="form-control" onChange={handleChange} name="rating">
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Review</label>
                                                    <textarea onChange={handleChange} className="form-control" name="reviews"></textarea>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {!enrollStatus && userLoginStatus && <button className="btn btn-success" onClick={enrollCourse}>Enroll Now</button>}
                    {ratingStatus === true &&
                                <button className="btn btn-success btn-sm m-2" onClick={enrollCourse}><FaHeart/></button>
                            }
                </div>
            </div>

            <hr />
            <h5>Chapters</h5>
            <ul className="list-group">
                {chapterData.map((chapter, index) => (
                    <li key={index} className="list-group-item">{chapter.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default CourseDetail;