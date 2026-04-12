import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <Sidebar />

            <div style={{ flex: 1, background: "#f1f5f9" }}>
                <Navbar />

                <div style={{ padding: "20px" }}>
                    {children}
                </div>
            </div>

        </div>
    );
};

export default AdminLayout;