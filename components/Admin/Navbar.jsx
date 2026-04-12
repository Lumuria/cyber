const Navbar = () => {
    return (
        <div style={navStyle}>

            <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                Dashboard
            </div>


            <div style={rightSide}>
                <span> Admin</span>
                <div style={avatar}>A</div>
            </div>

        </div>
    );
};

const navStyle = {
    background: "#ffffff",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0"
};

const rightSide = {
    display: "flex",
    alignItems: "center",
    gap: "15px"
};

const avatar = {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
};

export default Navbar;