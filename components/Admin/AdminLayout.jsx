import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                color: "#1e293b",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    background: "#f1f5f9",
                    color: "#1e293b",
                }}
            >
                <Navbar />

                <div
                    style={{
                        padding: "20px",
                        color: "#1e293b",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;