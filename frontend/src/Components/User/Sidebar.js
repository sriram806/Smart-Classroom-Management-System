import { Link } from "react-router-dom";
import { FaHome, FaBookOpen, FaHeart, FaUserCog, FaKey, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

function SideBar() {
    return (
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5 
                className="text-white text-center" 
                style={{
                    backgroundColor: '#007bff',
                    fontSize: '1.2rem',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    marginBottom: '15px'
                }}
            >
                User Dashboard
            </h5>
            <div className="list-group">
                <Link to="/student-dashboard" className="list-group-item" style={linkStyle}>
                    <FaHome className="me-2" /> Dashboard
                </Link>
                <Link to="/my-courses" className="list-group-item" style={linkStyle}>
                    <FaBookOpen className="me-2" /> My Courses
                </Link>
                <Link to="/student-favouritecourse" className="list-group-item" style={linkStyle}>
                    <FaHeart className="me-2 text-danger" /> Favourite Courses
                </Link>
                <Link to="/recommanded-courses" className="list-group-item" style={linkStyle}>
                    <FaBookOpen className="me-2" /> Recommended Courses
                </Link>
                <Link to="/profilesetting" className="list-group-item" style={linkStyle}>
                    <FaUserCog className="me-2" /> Profile Setting
                </Link>
                <Link to="/change-password" className="list-group-item" style={linkStyle}>
                    <FaKey className="me-2" /> Change Password
                </Link>
                <Link to="/time-table" className="list-group-item" style={linkStyle}>
                    <FaCalendarAlt className="me-2" /> Time Table
                </Link>
                <Link to="/student-attendance" className="list-group-item" style={linkStyle}>
                    <FaCalendarAlt className="me-2" /> My Attendance
                </Link>
                <Link to="/user-login" className="list-group-item text-danger" style={logoutStyle}>
                    <FaSignOutAlt className="me-2" /> Logout
                </Link>
            </div>
        </div>
    );
}

const linkStyle = {
    color: '#333',
    fontSize: '1rem',
    padding: '10px 15px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    marginBottom: '5px',
};

const logoutStyle = {
    ...linkStyle,
    color: '#dc3545',
};

export default SideBar;
