import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'hsl(0, 13%, 9%)' }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img src={logo} alt="App Logo" style={{ width: '105px' }} />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user?.role === 'Admin' && (
                            <li className="nav-item">
                                <a className="nav-link" href="/management">Admin management</a>
                            </li>
                        )}
                        <li className="nav-item">
                            <a className="nav-link" href="/Dashboard">Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/report">Maintenance Report</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/aboutPage">About</a>
                        </li>

                        {!user ? (
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" onClick={handleLogout}>Logout</a>
                                </li>
                                <li className="nav-item">
                                    <span className="navbar-text fw-bold">you are logged in, {user.name}</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
