import { useNavigate, useParams } from "react-router-dom";
import TeacherSlidebar from "./TeacherSlidebar";
import { useState } from "react";
import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api';

function AddChapter() {
    const { course_id } = useParams();
    const navigate = useNavigate();

    const [chapterData, setChapterData] = useState({
        course: course_id,
        title: '',
        description: '',
        video: '',
        remarks: ''
    });

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

    const formSubmit = async (event) => {
        event.preventDefault();
        const _formData = new FormData();
        _formData.append('course', chapterData.course);
        _formData.append('title', chapterData.title);
        _formData.append('description', chapterData.description);
        _formData.append('video', chapterData.video);
        _formData.append('remarks', chapterData.remarks);

        try {
            await axios.post(`${baseUrl}/chapter/`, _formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/teacher-course');
        } catch (error) {
            console.error('Error adding chapter:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSlidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header">Add Chapter for Course ID: {course_id}</h5>
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
                                        id="title"
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
                                        id="description"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="video" className="form-label">Course Video</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="video"
                                        onChange={handleFileChange}
                                        required
                                        id="video"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="remarks" className="form-label">Remarks</label>
                                    <textarea
                                        className="form-control"
                                        name="remarks"
                                        value={chapterData.remarks}
                                        onChange={handleChange}
                                        id="remarks"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AddChapter;