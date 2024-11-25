import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaChalkboardTeacher } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const baseUrl = 'http://127.0.0.1:8000/api';

const primaryColor = "#87CEEB"; 
const textColor = "#000000"; 

const sectionHeadingStyle = {
    fontWeight: "bold",
    color: textColor,
    fontSize: "1.75rem"
};

const linkStyle = {
    color: primaryColor,
    textDecoration: "underline",
    fontSize: "1rem"
};

const cardStyle = {
    borderRadius: "15px",
    overflow: "hidden",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
};

const buttonStyle = {
    backgroundColor: primaryColor,
    border: "none",
    padding: "10px 20px",
    fontSize: "1.1rem",
    marginTop: "1rem",
    transition: "transform 0.3s ease-in-out"
};

function Home() {
    const [courseData, setCourseData] = useState([]);
    const [teacherData, setTeacherData] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${baseUrl}/course/?result=4`);
            setCourseData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(`${baseUrl}/teacher/?result=4`);
            setTeacherData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const CourseCard = ({ course }) => (
        <div className="col-md-3 mb-4">
            <div className="card hover-shadow" style={cardStyle}>
                <Link to={`/detail/${course.id}`}>
                    <img src={course.featured_img} className="card-img-top" alt={course.title} />
                </Link>
                <div className="card-body">
                    <h5 className="card-title">
                        <Link to={`/detail/${course.id}`} style={{ color: textColor }}>{course.title}</Link>
                    </h5>
                </div>
            </div>
        </div>
    );

    const TeacherCard = ({ teacher }) => (
        <div className="col-md-3 mb-4">
            <div className="card hover-shadow" style={cardStyle}>
                <Link to={`/detail/${teacher.id}`}>
                    <img src={teacher.profile_img} className="card-img-top" alt={teacher.full_name} />
                </Link>
                <div className="card-body">
                    <h5 className="card-title">
                        <Link to={`/teacher-detail/${teacher.id}`} style={{ color: textColor }}>{teacher.full_name}</Link>
                    </h5>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-5">
            {/* Welcome Section with Animation */}
            <section className="welcome-section text-center p-5 text-light" style={{
                backgroundImage: "url('path/to/welcome-background.jpg')",
                backgroundSize: "cover",
                borderRadius: "15px",
                marginBottom: "3rem",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 1.5s ease-in-out"
            }}>
                <h style={{ fontWeight: "bold", fontSize: "2.5rem", color: textColor }}>Welcome to Smart Classroom Management System</h>
                <p style={{ fontSize: "1.2rem", color: textColor }}>
                    Smart Classroom Management System enhances teaching, learning, and student engagement through digital tools, automating attendance, assignments, and grading, promoting personalized education.
                </p>
                <Link to="/all-courses" className="btn btn-success" style={buttonStyle}>
                    Get Started
                </Link>
            </section>

            {/* Motivation Section with Animated Gradient Background */}
            <section className="motivation-section text-center p-4 rounded text-light" style={{
                background: `linear-gradient(90deg, ${primaryColor}, #28a745)`,
                marginBottom: "3rem",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                animation: "slideInLeft 1.5s ease-in-out"
            }}>
                <h2 style={{ fontWeight: "bold", fontSize: "2rem", color: textColor }}>Empowering Your Future</h2>
                <p style={{ fontSize: "1.1rem", color: textColor }}>
                    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today." – Malcolm X
                </p>
            </section>

            {/* Events and Announcements Section */}
            <section className="events-section my-5">
                <h3 className="pb-1 mb-4" style={sectionHeadingStyle}>Events & Announcements</h3>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <div className="card hover-shadow h-100" style={cardStyle}>
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontWeight: "bold", color: primaryColor }}>Upcoming Workshop</h5>
                                <p className="card-text">Join our interactive workshop on modern web development techniques on October 20th.</p>
                                <a href="#" className="btn btn-primary" style={buttonStyle}>Learn More</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card hover-shadow h-100" style={cardStyle}>
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontWeight: "bold", color: primaryColor }}>New Course Announcement</h5>
                                <p className="card-text">Exciting new courses on AI and Data Science are now available. Enroll today!</p>
                                <a href="#" className="btn btn-primary" style={buttonStyle}>Explore Courses</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card hover-shadow h-100" style={cardStyle}>
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontWeight: "bold", color: primaryColor }}>Special Guest Lecture</h5>
                                <p className="card-text">Attend a guest lecture by a renowned AI expert on November 10th.</p>
                                <a href="#" className="btn btn-primary" style={buttonStyle}>Register Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Courses */}
            <h3 className="pd-1 mb-4" style={sectionHeadingStyle}>
                Latest Courses
                <Link to="/all-courses" className="float-end" style={linkStyle}>
                    See All <FaArrowRight />
                </Link>
            </h3>
            <div className="row mb-4">
                {courseData.map((course) => <CourseCard course={course} key={course.id} />)}
            </div>

            {/* Teacher Courses */}
            <h3 className="pd-1 mb-4" style={sectionHeadingStyle}>
                Teacher Courses
                <Link to="/all-courses" className="float-end" style={linkStyle}>
                    See All <FaArrowRight />
                </Link>
            </h3>
            <div className="row mb-4">
                {teacherData.map((teacher) => <TeacherCard teacher={teacher} key={teacher.id} />)}
            </div>

            {/* Teachers Section */}
            <h3 className="pd-1 mb-4 mt-5" style={sectionHeadingStyle}>
                Our Teachers
                <Link to="/popular-teachers" className="float-end" style={linkStyle}>
                    See All <FaArrowRight />
                </Link>
            </h3>
            <div className="row">
                <div className="col-md-3">
                    <div className="card shadow-lg" style={cardStyle}>
                        <img src="logo192.png" className="card-img-top" alt="Teacher Image" />
                        <div className="card-body" style={{ backgroundColor: "#f8f9fa" }}>
                            <h5 className="card-title" style={{ fontWeight: "bold", color: "#007bff" }}>
                                <FaChalkboardTeacher /> Mr. Sriram
                            </h5>
                            <p style={{ color: "#6c757d" }}>Expert in Web Development and AI technologies.</p>
                            <a href="#" className="btn btn-success" style={{ width: "100%", backgroundColor: primaryColor, border: "none" }}>
                                Learn More <FaArrowRight />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Testimonials */}
            <h3 className="pb-1 mb-4 mt-5">Student Testimonial</h3>
            <div id="carouselExampleIndicators" className="carousel slide bg-dark text-light py-5" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {[...Array(3)].map((_, index) => (
                        <button key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} className={index === 0 ? 'active' : ''} aria-current="true" aria-label={`Slide ${index + 1}`}></button>
                    ))}
                </div>
                <div className="carousel-inner">
                    {[...Array(3)].map((_, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <figure className="text-center">
                                <blockquote className="blockquote">
                                    <p>A well-known quote, contained in a blockquote element.</p>
                                </blockquote>
                                <figcaption className="blockquote-footer">
                                    Someone famous in <cite title="Source Title">Source Title</cite>
                                </figcaption>
                            </figure>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Home;