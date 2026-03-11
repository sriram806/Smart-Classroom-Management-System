import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TeacherSlidebar from './TeacherSlidebar';

const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherAttendanceStats() {
    const [stats, setStats] = useState([]);
    const teacherId = localStorage.getItem('teacherId');

    useEffect(() => {
        if (teacherId) {
            try {
                axios.get(`${baseUrl}/teacher/${teacherId}/attendance/stats/`)
                    .then((res) => {
                        setStats(res.data);
                    });
            } catch (error) {
                console.log(error);
            }
        }
    }, [teacherId]);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header bg-primary text-white">Attendance Statistics</h5>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Course Title</th>
                                        <th>Classes Conducted</th>
                                        <th>Enrolled Students</th>
                                        <th>Average Attendance (%)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.course_title}</td>
                                            <td>{row.total_classes}</td>
                                            <td>{row.total_students}</td>
                                            <td>
                                                <div className="progress">
                                                    <div className="progress-bar" role="progressbar" style={{ width: `${row.avg_attendance_percentage}%` }} aria-valuenow={row.avg_attendance_percentage} aria-valuemin="0" aria-valuemax="100">
                                                        {row.avg_attendance_percentage}%
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <Link className="btn btn-primary btn-sm" to={`/course-attendance-stats/${row.course_id}`}>View Details</Link>
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

export default TeacherAttendanceStats;
