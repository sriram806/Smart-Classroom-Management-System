import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const baseUrl = 'http://127.0.0.1:8000/api';

function StudentAttendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        if (studentId) {
            try {
                axios.get(`${baseUrl}/student/${studentId}/attendance/`)
                    .then((res) => {
                        setAttendanceData(res.data);
                    });
            } catch (error) {
                console.log(error);
            }
        }
    }, [studentId]);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <Sidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header bg-primary text-white">My Attendance History</h5>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Course</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.date}</td>
                                            <td>{row.course.title}</td>
                                            <td>
                                                <span className={row.status === 'Present' ? 'badge bg-success' : 'badge bg-danger'}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td>{row.remarks}</td>
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

export default StudentAttendance;
