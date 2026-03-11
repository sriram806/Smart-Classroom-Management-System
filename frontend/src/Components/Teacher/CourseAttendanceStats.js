import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TeacherSlidebar from './TeacherSlidebar';

const baseUrl = 'http://127.0.0.1:8000/api';

function CourseAttendanceStats() {
    const [courseData, setCourseData] = useState({});
    const [studentStats, setStudentStats] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { course_id } = useParams();

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/course/${course_id}/attendance/stats/`)
                .then((res) => {
                    setCourseData(res.data.course_info);
                    setStudentStats(res.data.student_stats);
                });
        } catch (error) {
            console.log(error);
        }
    }, [course_id]);

    const handleDownloadCSV = () => {
        let url = `${baseUrl}/course/${course_id}/attendance/export/`;
        const params = [];
        if (startDate) params.push(`start_date=${startDate}`);
        if (endDate) params.push(`end_date=${endDate}`);
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        window.open(url, '_blank');
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card mb-4">
                        <h5 className="card-header bg-primary text-white">
                            {courseData.title} - Attendance Details
                        </h5>
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <strong>Total Classes:</strong> {courseData.total_classes_conducted}
                                </div>
                                <div className="col-md-4">
                                    <strong>Enrolled Students:</strong> {courseData.total_students_enrolled}
                                </div>
                                <div className="col-md-4">
                                    <strong>Overall Attendance:</strong> {courseData.overall_attendance_percentage}%
                                </div>
                            </div>

                            <hr />

                            <div className="row mb-3 align-items-end">
                                <div className="col-md-3">
                                    <label>Start Date (Optional)</label>
                                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </div>
                                <div className="col-md-3">
                                    <label>End Date (Optional)</label>
                                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                                <div className="col-md-6 text-end">
                                    <button onClick={handleDownloadCSV} className="btn btn-success">
                                        <i className="bi bi-file-earmark-spreadsheet me-2"></i>Download CSV
                                    </button>
                                </div>
                            </div>
                            
                            <table className="table table-bordered mt-3 text-center align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Roll Number</th>
                                        <th>Student Name</th>
                                        <th>Classes Attended</th>
                                        <th>Total Marked</th>
                                        <th>Attendance (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentStats.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.roll_number}</td>
                                            <td>{row.full_name}</td>
                                            <td>{row.classes_attended}</td>
                                            <td>{row.total_classes_marked}</td>
                                            <td>
                                                <span className={`badge ${row.attendance_percentage >= 75 ? 'bg-success' : 'bg-danger'}`}>
                                                    {row.attendance_percentage}%
                                                </span>
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

export default CourseAttendanceStats;
