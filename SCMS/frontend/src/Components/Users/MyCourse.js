import { Link } from "react-router-dom";
import SideBar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

// Mock baseUrl for demonstration purposes, since we are using demo data here
const baseUrl = 'http://127.0.0.1:8000/api';

function StudentAttendance() {
    // Mock data for attendance percentage for demo purposes
    const [attendanceData, setAttendanceData] = useState([
        {
            course: { id: 1, title: 'React Development' },
            teacher: { full_name: 'John Doe', id: 1 },
            totalClasses: 30,
            attendedClasses: 25,
        },
        {
            course: { id: 2, title: 'JavaScript Fundamentals' },
            teacher: { full_name: 'Jane Smith', id: 2 },
            totalClasses: 40,
            attendedClasses: 35,
        },
        {
            course: { id: 3, title: 'Python for Data Science' },
            teacher: { full_name: 'Alice Johnson', id: 3 },
            totalClasses: 50,
            attendedClasses: 45,
        },
    ]);

    // Calculate attendance percentage
    const calculateAttendancePercentage = (totalClasses, attendedClasses) => {
        return ((attendedClasses / totalClasses) * 100).toFixed(2);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <SideBar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header">Student Attendance</h5>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Course By</th>
                                        <th>Attendance Percentage</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.length > 0 ? (
                                        attendanceData.map((row, index) => {
                                            // Safely check if course and teacher data exists
                                            const courseId = row.course ? row.course.id : null;
                                            const teacherId = row.course.teacher ? row.course.teacher.id : null;
                                            
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {courseId ? (
                                                            <Link to={`/detail/${courseId}`}>
                                                                {row.course.title}
                                                            </Link>
                                                        ) : (
                                                            'Course Not Available'
                                                        )}
                                                    </td>
                                                    <td>
                                                        {teacherId ? (
                                                            <Link to={`/teacher-detail/${teacherId}`}>
                                                                {row.course.teacher.full_name}
                                                            </Link>
                                                        ) : (
                                                            'Sriram'
                                                        )}
                                                    </td>
                                                    <td>
                                                        {calculateAttendancePercentage(row.totalClasses, row.attendedClasses)}%
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-info btn-sm">View Details</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                No attendance data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default StudentAttendance;
