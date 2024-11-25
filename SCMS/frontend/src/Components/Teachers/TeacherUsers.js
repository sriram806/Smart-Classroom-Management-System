import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherUsers() {
    const [studentData, setStudentData] = useState([]);
    const teacherId = localStorage.getItem('teacherId');

    useEffect(() => {
        const fetchStudents = async () => {
            if (!teacherId) {
                console.error("Teacher ID not found in local storage.");
                return;
            }

            try {
                const response = await axios.get(`${baseUrl}/fetch-all-enrolled-students/${teacherId}/`);
                setStudentData(response.data);
            } catch (error) {
                console.error("Error fetching enrolled students:", error);
            }
        };

        fetchStudents();
    }, [teacherId]);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card shadow-sm">
                        <h5 className="card-header text-white bg-primary text-center">All Enrolled Students List</h5>
                        <div className="card-body">
                            <table className="table table-striped table-bordered table-hover table-responsive-md">
                                <thead className="table-active">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>Interested Categories</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData.length > 0 ? (
                                        studentData.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Link to={`/view-student/${row.student.id}`}>
                                                        {row.student.full_name}
                                                    </Link>
                                                </td>
                                                <td>{row.student.email}</td>
                                                <td>{row.student.username}</td>
                                                <td>{row.student.interested_categories}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">No enrolled students found.</td>
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

export default TeacherUsers;