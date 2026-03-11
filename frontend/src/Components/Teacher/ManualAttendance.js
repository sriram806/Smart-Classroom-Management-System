import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api';

function ManualAttendance() {
    const [teacherData, setTeacherData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({}); // { student_id: status }
    const teacherId = localStorage.getItem('teacherId');

    useEffect(() => {
        // Fetch Teacher's Courses
        try {
            axios.get(`${baseUrl}/teacher-courses/${teacherId}`)
                .then((res) => {
                    setCourses(res.data);
                });
        } catch (error) {
            console.log(error);
        }
    }, [teacherId]);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        
        if (courseId) {
            // Fetch enrolled students for this course
            axios.get(`${baseUrl}/course/${courseId}/attendance/students/`)
                .then((res) => {
                    setStudents(res.data);
                    // Initialize attendance data payload to 'Present'
                    const initData = {};
                    res.data.forEach(student => {
                        initData[student.id] = 'Present';
                    });
                    setAttendanceData(initData);
                })
                .catch((error) => {
                    console.log(error);
                    setStudents([]);
                });
        } else {
            setStudents([]);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const markAll = (status) => {
        const updatedData = {};
        students.forEach(student => {
            updatedData[student.id] = status;
        });
        setAttendanceData(updatedData);
    };

    const submitAttendance = () => {
        if (!selectedCourse || students.length === 0) {
            Swal.fire({title: 'Error', text: 'Please select a course with enrolled students.', icon: 'error'});
            return;
        }

        const payload = {
            date: attendanceDate,
            attendanceData: Object.keys(attendanceData).map(studentId => ({
                student_id: studentId,
                status: attendanceData[studentId],
                remarks: ''
            }))
        };

        axios.post(`${baseUrl}/course/${selectedCourse}/attendance/submit/`, payload)
            .then((res) => {
                Swal.fire({title: 'Success', text: 'Attendance recorded successfully!', icon: 'success'});
            })
            .catch((error) => {
                Swal.fire({title: 'Error', text: 'Failed to record attendance.', icon: 'error'});
            });
    };

    return (
         <div className="container mt-4">
            <div className="card">
                <h5 className="card-header border-bottom">
                     Manual Attendance
                </h5>
                <div className="card-body">
                    
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label">Select Course</label>
                            <select className="form-select" value={selectedCourse} onChange={handleCourseChange}>
                                <option value="">-- Select Course --</option>
                                {courses.map((course, index) => (
                                    <option key={index} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Attendance Date</label>
                            <input type="date" className="form-control" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
                        </div>
                    </div>

                    {selectedCourse && students.length > 0 && (
                        <>
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <h6>Enrolled Students ({students.length})</h6>
                                <div>
                                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => markAll('Present')}>Mark All Present</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => markAll('Absent')}>Mark All Absent</button>
                                </div>
                            </div>
                            
                            <table className="table table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Roll No</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={index} className={attendanceData[student.id] === 'Absent' ? 'table-danger' : ''}>
                                            <td>{student.roll_number || 'N/A'}</td>
                                            <td>{student.full_name}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <input type="radio" className="btn-check" name={`btnradio_${student.id}`} 
                                                        id={`btnradio_present_${student.id}`} autoComplete="off" 
                                                        checked={attendanceData[student.id] === 'Present'}
                                                        onChange={() => handleAttendanceChange(student.id, 'Present')} />
                                                    <label className="btn btn-outline-success btn-sm" htmlFor={`btnradio_present_${student.id}`}>Present</label>

                                                    <input type="radio" className="btn-check" name={`btnradio_${student.id}`} 
                                                        id={`btnradio_absent_${student.id}`} autoComplete="off" 
                                                        checked={attendanceData[student.id] === 'Absent'}
                                                        onChange={() => handleAttendanceChange(student.id, 'Absent')} />
                                                    <label className="btn btn-outline-danger btn-sm" htmlFor={`btnradio_absent_${student.id}`}>Absent</label>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="d-grid mt-3">
                                <button className="btn btn-primary" onClick={submitAttendance}>
                                    Submit Attendance
                                </button>
                            </div>
                        </>
                    )}

                    {selectedCourse && students.length === 0 && (
                         <div className="alert alert-warning">No students enrolled in this course yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManualAttendance;
