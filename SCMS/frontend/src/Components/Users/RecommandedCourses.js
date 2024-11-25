import { Link } from "react-router-dom";
import SideBar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api';

function RecommendedCourses() {
    const [courseData, setCourseData] = useState([]);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        const fetchRecommendedCourses = async () => {
            if (!studentId) {
                console.error("Student ID not found in local storage.");
                return;
            }

            try {
                const response = await axios.get(`${baseUrl}/fetch-recommanded-course/${studentId}/`);
                setCourseData(response.data);
            } catch (error) {
                console.error("Error fetching recommended courses:", error.response ? error.response.data : error.message);
            }
        };

        fetchRecommendedCourses();
    }, [studentId]);

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <SideBar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header">Recommended Courses</h5>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Technologies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.length > 0 ? (
                                        courseData.map((row, index) => (
                                            <tr key={index}>
                                                <td><Link to={`/detail/${row.id}`}>{row.title}</Link></td>
                                                <td><Link to={`/`} >{row.techs}</Link></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">No recommended courses found.</td>
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

export default RecommendedCourses;
