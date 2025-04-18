import React, { useEffect, useState } from 'react';
import Header from "./pageComponents/Header";
import Footer from "./pageComponents/Footer";
import './pageComponents/showcase.css'

function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user info from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log(userData);
        if (userData) {
        
            setUser(userData);
        }
    }, []);

    return (
        <div className="dashboard-page">
            <Header />
            <div className="dashboard-container">
                {user ? (
                    <div className="user-info">
                        <h2>Welcome, {user.name}</h2>
                        <div className="user-details">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            {/* <p><strong>Member since:</strong> {new Date(user.joinedAt).toLocaleDateString()}</p> */}
                        </div>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}

                <div className="dashboard-actions">
                    <h3>Your Actions</h3>
                    <div className="action-cards">
                        <div className="action-card">
                            <h4>Manage Profile</h4>
                            <p>Edit your profile information.</p>
                        </div>
                        <div className="action-card">
                            <h4>My Bookings</h4>
                            <p>View and manage your facility bookings.</p>
                        </div>
                        <div className="action-card">
                            <h4>Logout</h4>
                            <p>Logout of your account.</p>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default Dashboard;
