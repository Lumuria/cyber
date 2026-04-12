import React from "react";

const Dashboard = () => {
    return (
        <div style={containerStyle}>

            {/* title */}
            <h1 style={titleStyle}> Admin Dashboard</h1>

            {/* cards */}
            <div style={cardsContainer}>

                <div
                    style={cardStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                    }
                >
                    <h3>📰 News</h3>
                    <p>عدد الأخبار</p>
                </div>

                <div
                    style={cardStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                    }
                >
                    <h3>👥 Users</h3>
                    <p>عدد المستخدمين</p>
                </div>

                <div
                    style={cardStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                    }
                >
                    <h3>🛠 Tools</h3>
                    <p>عدد الأدوات</p>
                </div>

            </div>

        </div>
    );
};



// Style
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    textAlign: "center"
};

//  title
const titleStyle = {
    marginBottom: "40px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#0f172a"
};

//  cards
const cardsContainer = {
    display: "flex",
    gap: "25px",
    justifyContent: "center",
    flexWrap: "wrap"
};

// cardStyle
const cardStyle = {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "15px",
    width: "220px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer"
};

export default Dashboard;