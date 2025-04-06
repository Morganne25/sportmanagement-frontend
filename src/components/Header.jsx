
function Navbar() {

    return(
        <header className="header">
            <h1>APP</h1>
            <nav className="navbar">
                <ul>
                    <li><a href="/register">Register</a></li>
                    <li><a href="/login">Log In</a></li>
                    <li><a href="">About</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar