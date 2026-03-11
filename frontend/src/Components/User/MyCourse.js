import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert, Card, Button } from "react-bootstrap"; // Use react-bootstrap components

const EnrolledStudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/enrolled_students/");
        setStudents(response.data);
      } catch (err) {
        setError("Failed to fetch student enrollments.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger" className="w-50">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title>Enrolled Students</Card.Title>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Enrollment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.id}</td>
                        <td>{enrollment.student}</td>
                        <td>{enrollment.course}</td>
                        <td>{new Date(enrollment.enrollment_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="primary" className="mt-3">Add New Enrollment</Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudentsList;
