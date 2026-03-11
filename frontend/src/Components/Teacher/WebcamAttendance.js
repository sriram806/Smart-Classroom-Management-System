import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import TeacherSlidebar from "./TeacherSlidebar";
import { Button, Alert, Spinner, Container, Row, Col, Card, Modal } from "react-bootstrap";

const WebcamAttendance = () => {
    const webcamRef = useRef(null);
    const [recognizedStudent, setRecognizedStudent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Dummy data for testing
    const dummyStudents = [
        { id: "221801370012", name: "V Lakshmi" },
        { id: "221801370018", name: "B SRIRAM" },
        { id: "221801370033", name: "R Prasad" },
        { id: "221801370040", name: "Ch Hari" },
        { id: "221801370069", name: "R Praveen Sai" },
        { id: "221801370073", name: "K Manikanta" },
    ];

    const captureImage = async () => {
        setLoading(true);
        setError(null);
        setRecognizedStudent(null);

        // Ensure webcam is available and capture image
        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
            setError("Error capturing image.");
            setLoading(false);
            return;
        }

        // Simulate recognition (replace this with actual recognition logic)
        // For now, we can simply display all students.
        setTimeout(() => {
            setRecognizedStudent(dummyStudents); // Display all students
            setShowModal(true); // Show modal with recognition result
            setLoading(false);
        }, 1500);
    };

    return (
        <Container className="mt-5">
            <Row>
                <aside className="col-md-3" style={{ padding: '0', marginBottom: '20px' }}>
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                <Col md={6}>
                    <h3 className="mb-4">Student Attendance System</h3>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Capture Student Image</Card.Title>
                            <Webcam
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                    facingMode: "user",  // Automatically uses the front camera
                                }}
                                className="img-thumbnail mb-3"
                            />
                            <Button
                                onClick={captureImage}
                                disabled={loading}
                                variant="primary"
                                block
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : "Capture & Recognize"}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        {recognizedStudent ? (
                            <Alert variant="success">
                                <h4>Recognized Students</h4>
                                <ul>
                                    {recognizedStudent.map(student => (
                                        <li key={student.id}>
                                            <strong>ID:</strong> {student.id} <br />
                                            <strong>Name:</strong> {student.name}
                                        </li>
                                    ))}
                                </ul>
                            </Alert>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <Alert variant="info">Capture an image to recognize a student.</Alert>
                        )}
                    </Card>
                </Col>
                </section>
            </Row>

            {/* Modal for showing recognition results */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Recognition Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {recognizedStudent ? (
                        <ul>
                            {recognizedStudent.map((student) => (
                                <li key={student.id}>
                                    <strong>ID:</strong> {student.id} <br />
                                    <strong>Name:</strong> {student.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No student recognized.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default WebcamAttendance;
