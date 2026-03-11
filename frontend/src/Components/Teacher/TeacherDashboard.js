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
                <aside className="col-md-3" style={{ padding: '0', marginBottom: '20px' }}>
                    <TeacherSlidebar />
                </aside>

                {/* Main Dashboard Content */}
                <section className="col-md-9">
                    <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
                        <h2 className="mb-4 text-primary" style={{ fontWeight: 'bold' }}>Welcome to Your Dashboard</h2>

                        <div className="row mt-5">
                            {/* Total Courses */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0"
                                    style={{
                                        backgroundColor: '#17a2b8',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }}>
                                    <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Courses</h5>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>View and manage the courses you have created.</p>
                                    <Link to="/teacher-course" className="btn btn-light" style={{
                                        backgroundColor: 'white',
                                        color: '#17a2b8',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        transition: '0.3s'
                                    }}>
                                        {dashboardData.total_teacher_courses || 0}
                                    </Link>
                                </div>
                            </div>

                            {/* Total Students */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0"
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }}>
                                    <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Students</h5>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>Check the students enrolled in your courses.</p>
                                    <Link to="/teacher-user" className="btn btn-light" style={{
                                        backgroundColor: 'white',
                                        color: '#28a745',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        transition: '0.3s'
                                    }}>
                                        {dashboardData.total_teacher_students || 0}
                                    </Link>
                                </div>
                            </div>

                            {/* Total Chapters */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0"
                                    style={{
                                        backgroundColor: '#ffc107',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }}>
                                    <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Chapters</h5>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>Manage chapters across all your courses.</p>
                                    <Link to="/teacher-course" className="btn btn-light" style={{
                                        backgroundColor: 'white',
                                        color: '#ffc107',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        transition: '0.3s'
                                    }}>
                                        {dashboardData.total_teacher_chapters || 0}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-5">
                            {/* Add Courses */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0"
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }}>
                                    <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Add Courses</h5>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>Expand your offerings by creating new courses.</p>
                                    <Link to="/add-courses" className="btn btn-light" style={{
                                        backgroundColor: 'white',
                                        color: '#dc3545',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        transition: '0.3s'
                                    }}>
                                        Add New Course
                                    </Link>
                                </div>
                            </div>

                            {/* Profile Settings */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0"
                                    style={{
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }}>
                                    <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Profile Settings</h5>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>Edit your profile and change your account settings.</p>
                                    <Link to="/teacher-profilesetting" className="btn btn-light" style={{
                                        backgroundColor: 'white',
                                        color: '#6c757d',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        transition: '0.3s'
                                    }}>
                                        Update Profile
                                    </Link>
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
