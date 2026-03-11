function Footer() {
    return (
        <footer style={{ borderTop: "2px solid #dee2e6", marginTop: "3rem" }} className="text-muted py-5">
            <div className="container">
                <p className="float-end mb-1">
                    <a href="#">Back to top</a>
                </p>
                <p className="mb-1">Smart Classroom Management Software © 2024. All rights reserved.</p>
                <p className="mb-0">New to SCMS? <a href="/">Visit the homepage</a> or read our <a href="/docs/getting-started">getting started guide</a>.</p>
            </div>
        </footer>
    );
}

export default Footer;
