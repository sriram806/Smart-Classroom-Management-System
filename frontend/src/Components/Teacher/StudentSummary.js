import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherSlidebar from "./TeacherSlidebar";
import { Container, Row, Col, Card, Alert, Spinner, Button, Table } from 'react-bootstrap';
import { FaUsers, FaCheckCircle } from 'react-icons/fa';

const StudentSummary = () => {
    const [summary, setSummary] = useState({ students: 0, attendance: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dummyStudentList, setDummyStudentList] = useState([]);
    const [dummyAttendanceList, setDummyAttendanceList] = useState([]);

    const dummyData = {
        students: 6,
        studentList: [
            { id: 1, name: "V Lakshmi", rollNo: "221801370012" },
            { id: 2, name: "B Sriram", rollNo: "221801370018" },
            { id: 3, name: "R Prasad", rollNo: "221801370033" },
            { id: 4, name: "Ch Hari", rollNo: "221801370040" },
            { id: 5, name: "R Praveen Sai", rollNo: "221801370069" },
            { id: 6, name: "K Manikanta", rollNo: "221801370073" },
        ],
        attendanceLogs: [
            { id: 1, studentId: "221801370012", status: "Present" },
            { id: 2, studentId: "221801370018", status: "Present" },
            { id: 3, studentId: "221801370033", status: "Present" },
            { id: 4, studentId: "221801370040", status: "Present" },
            { id: 5, studentId: "221801370069", status: "Present" },
            { id: 6, studentId: "221801370073", status: "Present" },
        ],
    };

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const studentsResponse = await axios.get('http://127.0.0.1:8000/api/student/');
                const attendanceResponse = await axios.get('http://127.0.0.1:8000/api/attendance/');
                setSummary({
                    students: studentsResponse.data.length,
                    attendance: attendanceResponse.data.filter((log) => log.status === "Present").length,
                });
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const showDummyStudents = () => {
        setSummary({ ...summary, students: dummyData.students });
        setDummyStudentList(dummyData.studentList);
    };

    const showDummyAttendance = () => {
        const dummyAttendance = dummyData.attendanceLogs.filter((log) => log.status === "Present").length;
        setSummary({ ...summary, attendance: dummyAttendance });
        setDummyAttendanceList(dummyData.attendanceLogs);
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col md={3} className="mb-4">
                    <TeacherSlidebar />
                </Col>
                <Col md={9}>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="ms-3">Loading data...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    ) : (
                        <>
                            <Row className="justify-content-center">
                                <Col md={6} lg={4} className="mb-4">
                                    <Card className="shadow-lg border-0 rounded-3">
                                        <Card.Body className="d-flex flex-column align-items-center">
                                            <FaUsers size={50} className="text-primary mb-3" />
                                            <h5>Total Students</h5>
                                            <p className="display-4">{summary.students}</p>
                                            <Button variant="outline-primary" className="mt-2" onClick={showDummyStudents}>
                                                Show Students
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6} lg={4} className="mb-4">
                                    <Card className="shadow-lg border-0 rounded-3">
                                        <Card.Body className="d-flex flex-column align-items-center">
                                            <FaCheckCircle size={50} className="text-success mb-3" />
                                            <h5>Total Attendance</h5>
                                            <p className="display-4">{summary.attendance}</p>
                                            <Button variant="outline-success" className="mt-2" onClick={showDummyAttendance}>
                                                Show Attendance
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Display Dummy Student List */}
                            {dummyStudentList.length > 0 && (
                                <Row className="mt-4">
                                    <Col>
                                        <h3>Student List</h3>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Roll No</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dummyStudentList.map((student) => (
                                                    <tr key={student.id}>
                                                        <td>{student.id}</td>
                                                        <td>{student.name}</td>
                                                        <td>{student.rollNo}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            )}

                            {/* Display Dummy Attendance List */}
                            {dummyAttendanceList.length > 0 && (
                                <Row className="mt-4">
                                    <Col>
                                        <h3>Attendance List</h3>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Student ID</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dummyAttendanceList.map((log) => (
                                                    <tr key={log.id}>
                                                        <td>{log.id}</td>
                                                        <td>{log.studentId}</td>
                                                        <td>{log.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default StudentSummary;
