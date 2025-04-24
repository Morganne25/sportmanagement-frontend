import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            <h1><a href="/">APP</a></h1>
            <nav className="navbar">
                <ul>
                    {/* Afficher seulement pour les admins */}
                    {user?.role === 'Admin' && (
                        <li><a href="/management">Admin management</a></li>
                    )}
                    
                    <li><a href="/report">Maintenance Report</a></li>
                    <li><a href="/about">About</a></li>

                    {!user ? (
                        <>
                            <li><a href="/login">Login</a></li>
                            <li><a href="/login">Log In</a></li>
                        </>
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
