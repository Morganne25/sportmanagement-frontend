
function Footer() {
    return (
        <footer className="text-center py-3 mt-auto" style={{ backgroundColor: 'hsl(0, 13%, 9%)', color: 'white' }}>
            <p className="mb-0">&copy; {new Date().getFullYear()} Community Sports Facility Management</p>
        </footer>
    );
}

export default Footer
