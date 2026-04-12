import { useState } from "react";

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const addNews = () => {
        if (!title.trim()) return;

        const newItem = {
            id: Date.now(),
            title,
            desc,
        };

        setNews([newItem, ...news]);

        setTitle("");
        setDesc("");
        setShowModal(false);
    };

    const deleteNews = (id) => {
        setNews(news.filter(item => item.id !== id));
    };

    return (
        <div style={container}>

            <h2 style={titleStyle}> Manage News</h2>

            {/* button to add news */}
            <button style={addBtn} onClick={() => setShowModal(true)}>
                + Add News
            </button>

            {/* news list */}
            <div style={list}>
                {news.length === 0 && <p>لا يوجد أخبار</p>}

                {news.map(item => (
                    <div key={item.id} style={card}>
                        <div>
                            <h4>{item.title}</h4>
                            <p style={{ color: "#555" }}>{item.desc}</p>
                        </div>

                        <button onClick={() => deleteNews(item.id)} style={deleteBtn}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/*  Modal */}
            {showModal && (
                <div style={overlay}>
                    <div style={modal}>

                        <h3>إضافة خبر جديد</h3>

                        <input
                            type="text"
                            placeholder="عنوان الخبر"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={input}
                        />

                        <textarea
                            placeholder="وصف الخبر"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            style={textarea}
                        />

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={addNews} style={saveBtn}>
                                Save
                            </button>

                            <button onClick={() => setShowModal(false)} style={cancelBtn}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};


//  styles

const container = {
    maxWidth: "700px",
    margin: "0 auto"
};

const titleStyle = {
    marginBottom: "20px",
    textAlign: "center"
};

const addBtn = {
    marginBottom: "20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "10px",
    cursor: "pointer"
};

const list = {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
};

const card = {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const deleteBtn = {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer"
};

// Modal styles
const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const modal = {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
};

const input = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
};

const textarea = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "80px"
};

const saveBtn = {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer"
};

const cancelBtn = {
    background: "#ccc",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer"
};

export default ManageNews;