import { Link, useParams } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api';

function EnrolledCourses() {
    const [studentData, setStudentData] = useState([]);
    let {course_id}=useParams();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseUrl}/fetch-enrolled-students/${course_id}`);
                setStudentData(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card shadow-sm">
                        <h5 className="card-header text-white bg-primary text-center">Enrolled Students List</h5>
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
                                    {studentData.map((row, index) => (
                                        <tr key={ index}>
                                            <td><Link to={`/view-student/${row.student.id}`} >{row.student.full_name}</Link></td>
                                            <td>{row.student.email} </td>
                                            <td>{row.student.username} </td>
                                            <td>{row.student.interested_categories} </td>
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

export default EnrolledCourses;
