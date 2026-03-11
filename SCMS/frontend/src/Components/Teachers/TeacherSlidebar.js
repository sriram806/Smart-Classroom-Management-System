import { Link } from "react-router-dom";
import { FaHome, FaBook, FaHeart, FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";

function TeacherSlidebar() {
    return (
        <div className="card shadow-lg border-0">
            <h5 className="card-header bg-primary text-white text-center">Teacher Dashboard</h5>
            <div className="list-group list-group-flush">
                <Link to="/teacher-dashboard" className="list-group-item list-group-item-action">
                    <FaHome className="me-2" /> Dashboard
                </Link>
                <Link to="/teacher-course" className="list-group-item list-group-item-action">
                    <FaBook className="me-2" /> My Courses
                </Link>
                <Link to="/add-course" className="list-group-item list-group-item-action">
                    <FaHeart className="me-2 text-danger" /> Add Courses
                </Link>
                <Link to="/teacher-user" className="list-group-item list-group-item-action">
                    <FaBook className="me-2" /> My Users
                </Link>
                <Link to="/teacher-profilesetting" className="list-group-item list-group-item-action">
                    <FaUser className="me-2" /> Profile Setting
                </Link>
                <Link to="/teacher-changepassword" className="list-group-item list-group-item-action">
                    <FaKey className="me-2" /> Change Password
                </Link>
                <Link to="/teacher-logout" className="list-group-item list-group-item-action text-danger">
                    <FaSignOutAlt className="me-2" /> Logout
                </Link>
            </div>
        </div>
    )
}

export default TeacherSlidebar;