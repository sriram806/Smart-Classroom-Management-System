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
            text: "Are you sure you want to delete this data?",
            icon: "info",
            confirmButtonText: 'Continue',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.delete(`${baseUrl}chapter/${chapter_id}/`)
                        .then((res) => {
                            Swal.fire('success', 'Data has been deleted.');
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
                    Swal.fire('error', 'Data has not been deleted!');
                }
            } else {
                Swal.fire('error', 'Data not been deleted!');
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
                    <div className="card shadow-sm">
                        <h5 className="card-header text-center bg-primary text-white">
                            All Chapters - [ {totalResult} ]
                            <Link className="btn btn-success btn-sm float-end" to={`/add-chapter/${course_id}`}>Add Chapters</Link>
                        </h5>
                        <div className="card-body">
                            <table className="table table-striped table-bordered table-hover table-responsive-md">
                                <thead className="table-active">
                                    <tr>
                                        <th>Title</th>
                                        <th>Video</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chapterData.map((chapter) => (
                                        <tr key={chapter.id}>
                                            <td><Link to={`/edit-chapter/${chapter.id}`}>{chapter.title}</Link></td>
                                            <td>
                                                {chapter.video ? (
                                                    <video width="auto" height="auto" controls>
                                                        <source src={`${baseUrl}${chapter.video.url}`} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    'No video available'
                                                )}
                                            </td>
                                            <td>{chapter.remarks}</td>
                                            <td>
                                                <Link to={`/edit-chapter/${chapter.id}`} className="btn text-white btn-info btn-sm">
                                                    EDIT
                                                </Link>
                                                <button onClick={() => handleDeleteClick(chapter.id)} className="btn text-white btn-danger btn-sm ms-2">
                                                    DELETE
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