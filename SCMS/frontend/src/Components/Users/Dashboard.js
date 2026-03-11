import SideBar from "./Sidebar";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar */}
                <aside className="col-md-3">
                    <SideBar />
                </aside>

                {/* Main Dashboard Content */}
                <section className="col-md-9">
                    <div className="card shadow-lg border-0 p-4 bg-light">
                        <h2 className="mb-4 text-primary">Welcome to Your Dashboard</h2>
                        <p className="text-muted">...</p>

                        <div className="row mt-5">
                            {/* My Courses Card */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0 bg-info text-white">
                                    <h5 className="card-title">My Courses</h5>
                                    <p className="card-text">View and manage the courses you have enrolled in.</p>
                                    <Link to="/my-courses" className="btn btn-light">Go to My Courses</Link>
                                </div>
                            </div>
                            
                            {/* Profile Settings Card */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0 bg-success text-white">
                                    <h5 className="card-title">Profile Settings</h5>
                                    <p className="card-text">Edit your profile and change your account settings.</p>
                                    <Link to="/profile-setting" className="btn btn-light">Update Profile</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
