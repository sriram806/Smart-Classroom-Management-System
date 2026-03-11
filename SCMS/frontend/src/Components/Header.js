import React from 'react';
import { Link } from 'react-router-dom';

const teacherLoginStatus = localStorage.getItem('teacherLoginStatus')
const studentLoginStatus = localStorage.getItem('studentLoginStatus')
function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">SCMS</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="navbar-nav ms-auto">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/all-courses">Courses</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/chatbot">ChatBot</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">TEACHER</a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {teacherLoginStatus !='true' &&
                    <>
                      <li><Link className="dropdown-item" to="/teacher-login">Login</Link></li>
                      <li><Link className="dropdown-item" to="/teacher-register">Register</Link></li>
                    </>
                  }
                  {teacherLoginStatus ==='true' &&
                  <>
                  <li><Link className="dropdown-item" to="/teacher-dashboard">Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/teacher-logout">Logout</Link></li>
                  </>
                }
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">USER</a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {studentLoginStatus !='true' &&
                    <>
                      <li><Link className="dropdown-item" to="/student-login">Login</Link></li>
                      <li><Link className="dropdown-item" to="/student-register">Register</Link></li>
                    </>
                  }
                  {studentLoginStatus ==='true' &&
                  <>
                  <li><Link className="dropdown-item" to="/student-dashboard">Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/student-logout">Logout</Link></li>
                  </>
                }
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
