import { Link } from "react-router-dom";
import { FaHome, FaBookOpen, FaPlusSquare, FaUsers, FaUserCog, FaKey, FaTable, FaSignOutAlt } from "react-icons/fa";

function TeacherSlidebar() {
    return (
        <div className="card" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
            <h5
                className="card-header text-white text-center"
                style={{
                    backgroundColor: '#007bff',
                    fontSize: '1.2rem',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    border: 'none'
                }}
            >
                Teacher Dashboard
            </h5>
            <div className="list-group list-group-flush mt-3">
                <Link to="/teacher-dashboard" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaHome className="me-2" /> Dashboard
                </Link>
                <Link to="/teacher-course" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaBookOpen className="me-2" /> My Courses
                </Link>
                <Link to="/add-course" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaPlusSquare className="me-2" /> Add Courses
                </Link>
                <Link to="/teacher-user" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaUsers className="me-2" /> My Users
                </Link>
                <Link to="/teacher-profilesetting" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaUserCog className="me-2" /> Profile Settings
                </Link>
                <Link to="/manual-attendance" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaTable className="me-2" /> Manual Attendance
                </Link>
                <Link to="/teacher-attendance-stats" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaTable className="me-2" /> Attendance Stats
                </Link>
                <Link to="/webcam" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaHome className="me-2" /> WEB Attendance
                </Link>
                <Link to="/studentsummary" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaHome className="me-2" /> Student Summary
                </Link>
                <Link to="/teacher-changepassword" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaKey className="me-2" /> Change Password
                </Link>
                <Link to="/teacher-timetable" className="list-group-item list-group-item-action" style={linkStyle}>
                    <FaTable className="me-2" /> Time Table
                </Link>
                <Link to="/teacher-logout" className="list-group-item list-group-item-action text-danger" style={logoutStyle}>
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
    border: 'none',
    backgroundColor: 'transparent'
};

const logoutStyle = {
    ...linkStyle,
    color: '#dc3545',
};

export default TeacherSlidebar;
