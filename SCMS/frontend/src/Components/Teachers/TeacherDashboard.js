import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api/';

function TeacherDashboard() {
    const [dashboardData, setDashboardData] = useState({});
    const teacherId = localStorage.getItem('teacherId');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${baseUrl}teacher/dashboard/${teacherId}`);
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchDashboardData();
    }, [teacherId]);

    return (
        <div className="container mt-5">
            <div className="row">
                {/* TeacherSlidebar */}
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>

                {/* Main Dashboard Content */}
                <section className="col-md-9">
                    <div className="card shadow-lg border-0 p-4">
                        <h2 className="mb-4 text-primary">Welcome to Your Dashboard</h2>

                        <div className="row mt-5">
                            {/* Total Courses */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0 bg-info text-white">
                                    <h5 className="card-title">Total Courses</h5>
                                    <p className="card-text">View and manage the courses you have created.</p>
                                    <Link to="/teacher-course" className="btn btn-light">
                                        {dashboardData.total_teacher_courses || 0}
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Total Students */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0 bg-success text-white">
                                    <h5 className="card-title">Total Students</h5>
                                    <p className="card-text">Check the students enrolled in your courses.</p>
                                    <Link to="/teacher-user" className="btn btn-light">
                                        {dashboardData.total_teacher_students || 0}
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Total Chapters */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0 bg-warning text-white">
                                    <h5 className="card-title">Total Chapters</h5>
                                    <p className="card-text">Manage chapters across all your courses.</p>
                                    <Link to="/teacher-course" className="btn btn-light">
                                        {dashboardData.total_teacher_chapters || 0}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-5">
                            {/* Add Courses */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0 bg-danger text-white">
                                    <h5 className="card-title">Add Courses</h5>
                                    <p className="card-text">Expand your offerings by creating new courses.</p>
                                    <Link to="/add-courses" className="btn btn-light">Add New Course</Link>
                                </div>
                            </div>
                            
                            {/* Profile Settings */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0 bg-secondary text-white">
                                    <h5 className="card-title">Profile Settings</h5>
                                    <p className="card-text">Edit your profile and change your account settings.</p>
                                    <Link to="/teacher-profilesetting" className="btn btn-light">Update Profile</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TeacherDashboard;
