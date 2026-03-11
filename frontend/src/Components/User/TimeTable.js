import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from "./Sidebar";

const baseUrl = 'http://127.0.0.1:8000/api';

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [specialDays, setSpecialDays] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(baseUrl + '/timetable/')
            .then(response => setTimetable(response.data))
            .catch(() => setError('Error fetching timetable'))
            .finally(() => setLoading(false));

        axios.get(baseUrl + '/specialdays/')
            .then(response => setSpecialDays(response.data))
            .catch(() => setError('Error fetching special days'))
            .finally(() => setLoading(false));
    }, []);

    const getSessionClass = (day, sessionNumber) => {
        const specialDay = specialDays.find(
            (sd) => new Date(sd.date).toLocaleDateString() === `${day}-${sessionNumber}`
        );

        if (specialDay) {
            return specialDay.day_type === 'Holiday'
                ? 'bg-danger text-white'
                : 'bg-warning text-dark';
        }

        return '';
    };

    const renderTimetable = () => {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const sessions = [1, 2, 3, 4, 5, 6];

        return daysOfWeek.map((day, index) => (
            <tr key={index}>
                <td>{day}</td>
                {sessions.map((session) => {
                    const entry = timetable.find(
                        (entry) => entry.day === day && entry.session_number === session
                    );
                    return (
                        <td key={session} className={`text-center ${getSessionClass(day, session)}`}>
                            {entry ? (
                                <>
                                    <div>{entry.course ? entry.course.title : '  '}</div>
                                    <div>{entry.teacher ? entry.teacher.full_name : '  '}</div>
                                    {specialDays.some((sd) => sd.date === entry.special_days[0]?.date) && (
                                        <div className="mt-1 text-center success">
                                            <strong>
                                                {specialDays.find((sd) => sd.date === entry.special_days[0]?.date)?.name}
                                            </strong>
                                        </div>

                                    )}
                                </>
                            ) : (
                                <span className="text-muted">No class</span>
                            )}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar */}
                <aside className="col-md-3">
                    <SideBar />
                </aside>
                <section className="col-md-9">
                    <h1 className="text-center mb-4">Timetable</h1>

                    {loading && <div className="alert alert-info text-center">Loading timetable...</div>}
                    {error && <div className="alert alert-danger text-center">{error}</div>}

                    <div className="table-responsive">
                        <table className="table table-bordered  mt-3">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Day</th>
                                    {[1, 2, 3, 4, 5, 6].map((session) => (
                                        <th key={session}>Session {session}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>{renderTimetable()}</tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Timetable;
