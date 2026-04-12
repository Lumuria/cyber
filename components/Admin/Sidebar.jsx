import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div style={{
            width: "240px",
            background: "#0f172a",
            color: "#fff",
            padding: "20px",
            display: "flex",
            flexDirection: "column"
        }}>
            <h2 style={{ marginBottom: "30px" }}> Admin Panel</h2>

            <Link to="/admin" style={linkStyle}>Dashboard</Link>
            <Link to="/admin/news" style={linkStyle}>Manage News</Link>
            <Link to="/admin/posts" style={linkStyle}>Manage Posts</Link>

        </div>
    );
};

const linkStyle = {
    color: "#cbd5f5",
    textDecoration: "none",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "8px"
};

export default Sidebar;