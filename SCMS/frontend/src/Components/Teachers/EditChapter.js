import { Link, useNavigate } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const baseUrl = 'http://127.0.0.1:8000/api';

function EditChapter() {
    const { course_id, chapter_id } = useParams();
    const navigate = useNavigate();

    const [chapterData, setChapterData] = useState({
        course: parseInt(course_id),
        title: '',
        description: '',
        video: '',
        remarks: ''
    });
    const [existingVideo, setExistingVideo] = useState(null);

    useEffect(() => {
        axios.get(`${baseUrl}/chapter/${chapter_id}/`)
            .then((response) => {
                setChapterData(prevData => ({
                    ...prevData,
                    course: response.data.course, 
                    title: response.data.title,
                    description: response.data.description,
                    remarks: response.data.remarks,
                }));
                setExistingVideo(response.data.video);
            })
            .catch((error) => {
                console.error('Error fetching chapter data:', error.response ? error.response.data : error.message);
            });
    }, [chapter_id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setChapterData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setChapterData(prevData => ({
            ...prevData,
            [name]: files[0]
        }));
    };

    const formSubmit = (event) => {
        event.preventDefault();

        const _formData = new FormData();
        _formData.append('course', chapterData.course);
        _formData.append('title', chapterData.title);
        _formData.append('description', chapterData.description);
        if (chapterData.video) {
            _formData.append('video', chapterData.video, chapterData.video.name);
        }
        _formData.append('remarks', chapterData.remarks);

        axios.put(`${baseUrl}/chapter/${chapter_id}/`, _formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            console.log('Chapter updated successfully:', res.data);
            Swal.fire({
                title: 'Success!',
                text: 'Chapter updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/teacher-course'); 
            });
        })
        .catch((error) => {
            console.error('Error updating chapter:', error.response ? error.response.data : error.message);
        });
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header">Update Chapter for Course ID: {chapter_id}</h5>
                        <div className="card-body">
                            <form onSubmit={formSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Chapter Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={chapterData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={chapterData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="video" className="form-label">Course Video</label>
                                    {existingVideo && (
                                        <div className="mb-2">
                                            <video width="80%" height="300" controls>
                                                <source src={existingVideo} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            <p>Current video: {existingVideo.split('/').pop()}</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="video"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="remarks" className="form-label">Remarks</label>
                                    <textarea
                                        className="form-control"
                                        name="remarks"
                                        value={chapterData.remarks}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EditChapter;
