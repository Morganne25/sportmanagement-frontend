import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./pageComponents/Header";
import Footer from "./pageComponents/Footer";
import './pageComponents/showcase.css';
import axios from 'axios';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            setUser(userData);
            setEditedName(userData.name);
        } else {
            navigate("/home");
        }
    }, [navigate]);

    const handleRedirect = (path) => {
        navigate(path);
    };

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleNameSave = async () => {
        const updatedUser = { ...user, name: editedName };
    
     
            try {
                await axios.put(`http://localhost:8080/api/v1/user`, updatedUser);
                setOpenEditDialog(false);
                showSnackbar('User updated successfully', 'success');
                fetchUsers();
                
    
            if (response.ok) {
                const newUser = { ...user, name: editedName };
                setUser(newUser);
                localStorage.setItem('userData', JSON.stringify(newUser));
                setShowEditForm(false);
                alert("Name updated successfully!");
            } else {
                alert("Failed to update name.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("An error occurred while updating name.");
        }
    };
    
    const handleManageProfileClick = () => {
        setShowEditForm(true);
    };

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <>
            <Header />
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="user-info">
                        <h2>Welcome, {user.name}</h2>
                        <div className="user-details">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>

                            {showEditForm && (
                                <div className="edit-name-form">
                                    <label htmlFor="name">Edit Name:</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={editedName}
                                        onChange={handleNameChange}
                                    />
                                    <button onClick={handleNameSave}>Save</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="dashboard-actions">
                        <h3>Your Actions</h3>
                        <div className="action-cards">
                            <div className="action-card card-blue" onClick={handleManageProfileClick}>
                                <h4>Manage Profile</h4>
                                <p>Edit your profile information.</p>
                            </div>
                            <div className="action-card card-green" onClick={() => handleRedirect('/booking/all')}>
                                <h4>My Bookings</h4>
                                <p>View and manage your facility bookings.</p>
                            </div>
                            <div className="action-card card-red" onClick={() => handleRedirect('/logout')}>
                                <h4>Logout</h4>
                                <p>Logout of your account.</p>
                            </div>

                            {user.role === 'Admin' && (
                                <div className="action-card card-orange" onClick={() => handleRedirect('/management')}>
                                    <h4>User Management</h4>
                                    <p>Manage platform users and their roles.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Dashboard;
