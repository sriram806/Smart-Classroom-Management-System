import SideBar from "./Sidebar";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar */}
                <aside className="col-md-3" style={{ padding: '0', marginBottom: '20px' }}>
                    <SideBar />
                </aside>

                {/* Main Dashboard Content */}
                <section className="col-md-9">
                    <div className="card shadow-lg border-0 p-4 bg-light" style={{ borderRadius: '15px' }}>
                        <h2 className="mb-4 text-primary" style={{ fontWeight: 'bold' }}>Welcome to Your Dashboard</h2>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Here you can manage your courses and profile settings.</p>

                        <div className="row mt-5">
                            {/* My Courses Card */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0"
                                    style={{
                                        backgroundColor: '#17a2b8',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }}>
                                    <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>My Courses</h5>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>View and manage the courses you have enrolled in.</p>
                                    <Link to="/my-courses" className="btn btn-light" style={{
                                        backgroundColor: 'white',
                                        color: '#17a2b8',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        transition: '0.3s'
                                    }}>
                                        Go to My Course
                                    </Link>
                                </div>
                            </div>

                            {/* Profile Settings Card */}
                            <div className="col-md-6 mb-4">
                                <div className="card p-3 shadow-sm border-0"
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        borderRadius: '10px'
                                    }}>
                                    <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Profile Settings</h5>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>Edit your profile and change your account settings.</p>
                                    <Link to="/profile-setting" className="btn btn-light" style={{
                                        backgroundColor: 'white',
                                        color: '#28a745',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        transition: '0.3s'
                                    }}>
                                        Update Profile
                                    </Link>
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
