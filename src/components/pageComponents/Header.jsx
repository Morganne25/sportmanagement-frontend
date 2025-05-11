import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Assurez-vous que le chemin est correct

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) setUser(userData);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="header">
            <a href="/">
                <img src={logo} alt="App Logo" style={{ width: '105px' }} />
            </a>
            <nav className="navbar">
                <ul>
                    {user?.role === 'Admin' && (
                        <li><a href="/management">Admin management</a></li>
                    )}
                    <li><a href="/Dashboard">Dashboard</a></li>
                    <li><a href="/report">Maintenance Report</a></li>
                    <li><a href="/aboutPage">About</a></li>

                    {!user ? (
                        <li><a href="/login">Login</a></li>
                    ) : (
                        <>
                            <li><a href="#" onClick={handleLogout}>Logout</a></li>
                            <li><span style={{ fontWeight: 'bold' }}>you are logged in, {user.name}</span></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
