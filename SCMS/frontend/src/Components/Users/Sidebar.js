import { Link } from "react-router-dom";
import { FaHome, FaBook, FaHeart, FaUser, FaKey, FaSignOutAlt } from "react-icons/fa"; 

function SideBar() {
    return (
        <div className="card shadow-lg border-0">
            <h5 className="card-header bg-primary text-white text-center">User Dashboard</h5>
            <div className="list-group list-group-flush">
                <Link to="/student-dashboard" className="list-group-item list-group-item-action">
                    <FaHome className="me-2" /> Dashboard
                </Link>
                <Link to="/my-courses" className="list-group-item list-group-item-action">
                    <FaBook className="me-2" /> My Courses
                </Link>
                <Link to="/student-favouritecourse" className="list-group-item list-group-item-action">
                    <FaHeart className="me-2 text-danger" /> Favourite Courses
                </Link>
                <Link to="/recommanded-courses" className="list-group-item list-group-item-action">
                    <FaBook className="me-2" /> Recommended Courses
                </Link>
                <Link to="/profilesetting" className="list-group-item list-group-item-action">
                    <FaUser className="me-2" /> Profile Setting
                </Link>
                <Link to="/change-password" className="list-group-item list-group-item-action">
                    <FaKey className="me-2" /> Change Password
                </Link>
                <Link to="/user-login" className="list-group-item list-group-item-action text-danger">
                    <FaSignOutAlt className="me-2" /> Logout
                </Link>
            </div>
        </div>
    );
}

export default SideBar;
