import { Link } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api/';

function CourseChapter() {
    const [totalResult, settotalResult] = useState(0);
    const [chapterData, setchapterData] = useState([]);
    const { course_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (course_id) {
            axios.get(`${baseUrl}course-chapters/${course_id}`)
                .then((res) => {
                    settotalResult(res.data.length);
                    setchapterData(res.data);
                })
                .catch((error) => {
                    console.log("Error fetching chapters:", error);
                });
        }
    }, [course_id]);

    const handleDeleteClick = (chapter_id) => {
        Swal.fire({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this chapter?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.delete(`${baseUrl}chapter/${chapter_id}/`)
                        .then((res) => {
                            Swal.fire('Deleted!', 'The chapter has been deleted.', 'success');
                            if (course_id) {
                                axios.get(`${baseUrl}course-chapters/${course_id}`)
                                    .then((res) => {
                                        settotalResult(res.data.length);
                                        setchapterData(res.data);
                                    })
                                    .catch((error) => {
                                        console.log("Error fetching chapters:", error);
                                    });
                            }
                        });
                } catch (error) {
                    Swal.fire('Error!', 'The chapter could not be deleted.', 'error');
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
                        <h5 className="card-header text-center bg-primary text-white py-3" style={{ fontSize: "1.5rem" }}>
                            All Chapters - [ {totalResult} ]
                            <Link 
                                className="btn btn-success btn-sm float-end" 
                                to={`/add-chapter/${course_id}`} 
                                style={{ marginTop: "-5px" }}
                            >
                                Add Chapters
                            </Link>
                        </h5>
                        <div className="card-body" style={{ padding: "1.5rem" }}>
                            <table className="table table-striped table-bordered table-hover table-responsive-md">
                                <thead className="table-active">
                                    <tr>
                                        <th>Title</th>
                                        <th>Video</th>
                                        <th>Remarks</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chapterData.map((chapter) => (
                                        <tr key={chapter.id}>
                                            <td>
                                                <Link to={`/edit-chapter/${chapter.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                                                    {chapter.title}
                                                </Link>
                                            </td>
                                            <td>
                                                {chapter.video ? (
                                                    <video
                                                        width="100%"
                                                        height="auto"
                                                        controls
                                                        style={{ maxWidth: "300px", borderRadius: "5px" }}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/path/to/placeholder.mp4"; // Placeholder video URL
                                                        }}
                                                    >
                                                        <source src={`${baseUrl}${chapter.video.url}`} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    'No video available'
                                                )}
                                            </td>
                                            <td>{chapter.remarks}</td>
                                            <td>
                                                <Link 
                                                    to={`/edit-chapter/${chapter.id}`} 
                                                    className="btn btn-info btn-sm" 
                                                    style={{ marginRight: "10px", fontSize: "0.9rem" }}
                                                >
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(chapter.id)} 
                                                    className="btn btn-danger btn-sm"
                                                    style={{ fontSize: "0.9rem" }}
                                                >
                                                    Delete
                                                </button>
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

export default CourseChapter;
