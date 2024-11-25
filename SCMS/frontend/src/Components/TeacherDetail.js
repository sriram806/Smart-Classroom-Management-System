import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherDetail() {
    const [courseData, setcourseData] = useState([]);
    const [teacherData, setteacherData] = useState([]);
    const [skillList, setskillList] = useState([]);
    let { teacher_id } = useParams();

    useEffect(() => {
        axios.get(`${baseUrl}/teacher/${teacher_id}`)
            .then((res) => {
                console.log(res);
                setteacherData(res.data);
                setcourseData(res.data.teacher_courses);
                setskillList(res.data.skill_list);
            })
            .catch((error) => {
                console.error("Error fetching teacher data:", error);
            });
    }, []);
    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-4">
                    <img
                        src={teacherData.profile_image || "https://img.freepik.com/free-vector/robotic-artificial-intelligence-technology-smart-lerning-from-bigdata_1150-48136.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1725494400&semt=ais_hybrid"}
                        className="img-thumbnail"
                        alt={teacherData.full_name}
                    />
                </div>
                <div className="col-8">
                    <h3>{teacherData.full_name}</h3>
                    <p>{teacherData.detail}</p>
                    <p className="fw-bold">Skills:
                        {skillList.map((skills, index) => (
                            <Link
                                key={index} // Add key here
                                to={`/teacher-skill-courses/${skills.trim()}/${teacherData.id}`}
                                className="badge badge-pill text-dark bg-warning"
                            >
                                {skills.trim()}
                            </Link>
                        ))}
                    </p>
                    <p className="fw-bold">Recent Course: {teacherData.rating || "N/A"}</p>
                    <p className="fw-bold">Rating: {teacherData.rating || "N/A"}</p>
                </div>
            </div>

            {/* Course List */}
            <div className="card mt-4">
                <div className="card-header">
                    <h5 className="container">Course List</h5>
                </div>
                <div className="list-group list-group-flush">
                    {courseData.length > 0 ? (
                        courseData.map((course, index) => (
                            <Link
                                key={index}
                                to={`/detail/${course.id}`}
                                className="list-group-item list-group-item-action"
                            >
                                {course.title}
                            </Link>
                        ))
                    ) : (
                        <p className="list-group-item">No courses available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TeacherDetail;
