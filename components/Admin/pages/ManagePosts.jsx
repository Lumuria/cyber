import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Context/AuthContext';
import { usePosts } from '../../Context/PostsContext';

const ManagePosts = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { posts, addPost, deletePost } = usePosts();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    addPost(title, body, user?.email);
    setTitle('');
    setBody('');
    setShowModal(false);
  };

  return (
    <div style={container}>
      <h2 style={titleStyle}>{t('admin_posts.title')}</h2>
      <p style={hint}>{t('admin_posts.hint')}</p>

      <button type="button" style={addBtn} onClick={() => setShowModal(true)}>
        {t('admin_posts.add')}
      </button>

      <div style={list}>
        {posts.length === 0 && <p style={{ color: '#64748b' }}>{t('admin_posts.empty')}</p>}
        {posts.map((item) => (
          <div key={item.id} style={card}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ margin: '0 0 8px' }}>{item.title}</h4>
              <p style={{ color: '#64748b', margin: 0, whiteSpace: 'pre-wrap' }}>{item.body}</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <button type="button" onClick={() => deletePost(item.id)} style={deleteBtn}>
              {t('admin_posts.delete')}
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={overlay} role="presentation" onClick={() => setShowModal(false)}>
          <div
            style={modal}
            role="dialog"
            aria-labelledby="post-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="post-modal-title">{t('admin_posts.modal_title')}</h3>
            <input
              type="text"
              placeholder={t('admin_posts.title_placeholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={input}
            />
            <textarea
              placeholder={t('admin_posts.body_placeholder')}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={textarea}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={handleAdd} style={saveBtn}>
                {t('admin_posts.save')}
              </button>
              <button type="button" onClick={() => setShowModal(false)} style={cancelBtn}>
                {t('admin_posts.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const container = { maxWidth: '720px', margin: '0 auto' };
const titleStyle = { marginBottom: '8px', textAlign: 'center' };
const hint = { textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 20 };
const addBtn = {
  marginBottom: '20px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
};
const list = { display: 'flex', flexDirection: 'column', gap: '12px' };
const card = {
  background: '#fff',
  padding: '16px',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
};
const deleteBtn = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  flexShrink: 0,
};
const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};
const modal = {
  background: '#fff',
  padding: '24px',
  borderRadius: '12px',
  width: 'min(420px, 92vw)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};
const input = { padding: '10px', borderRadius: '8px', border: '1px solid #ccc' };
const textarea = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  minHeight: '120px',
  resize: 'vertical',
};
const saveBtn = {
  background: '#22c55e',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
};
const cancelBtn = {
  background: '#e2e8f0',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default ManagePosts;
