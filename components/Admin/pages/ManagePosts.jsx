import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Context/AuthContext';
import { usePosts } from '../../Context/PostsContext';

const ManagePosts = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const {
    posts,
    addPost,
    updatePost,
    deletePost,
  } = usePosts();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;

    if (editingId) {
      updatePost(editingId, title, body);
      setEditingId(null);
    } else {
      addPost(title, body, user?.email);
    }

    setTitle('');
    setBody('');
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setBody(item.body || '');
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setTitle('');
    setBody('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setTitle('');
    setBody('');
  };

  return (
    <div style={container}>
      <div style={pageHeader}>
        <div>
          <h2 style={titleStyle}>
            {t('admin_posts.title')}
          </h2>

          <p style={hint}>
            {t('admin_posts.hint')}
          </p>
        </div>

        <button
          type="button"
          style={addBtn}
          onClick={openCreate}
        >
          {t('admin_posts.add')}
        </button>
      </div>

      <div style={list}>
        {posts.length === 0 && (
          <div style={emptyState}>
            {t('admin_posts.empty')}
          </div>
        )}

        {posts.map((item) => (
          <div
            key={item.id}
            style={card}
          >
            <div style={contentArea}>
              <h4 style={cardTitle}>
                {item.title}
              </h4>

              <p style={cardBody}>
                {item.body}
              </p>

              <p style={dateStyle}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : '-'}
              </p>
            </div>

            <div style={actions}>
              <button
                type="button"
                onClick={() => handleEdit(item)}
                style={editBtn}
              >
                {t('admin_posts.edit')}
              </button>

              <button
                type="button"
                onClick={() => deletePost(item.id)}
                style={deleteBtn}
              >
                {t('admin_posts.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          style={overlay}
          role="presentation"
          onClick={closeModal}
        >
          <div
            style={modal}
            role="dialog"
            aria-labelledby="post-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeader}>
              <h3
                id="post-modal-title"
                style={modalTitle}
              >
                {editingId
                  ? t('admin_posts.edit_title')
                  : t('admin_posts.modal_title')}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                style={closeBtn}
                aria-label={t('admin_posts.close')}
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder={t(
                'admin_posts.title_placeholder'
              )}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={input}
            />

            <textarea
              placeholder={t(
                'admin_posts.body_placeholder'
              )}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={textarea}
            />

            <div style={modalActions}>
              <button
                type="button"
                onClick={handleAdd}
                style={saveBtn}
              >
                {t('admin_posts.save')}
              </button>

              <button
                type="button"
                onClick={closeModal}
                style={cancelBtn}
              >
                {t('admin_posts.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NAVY = '#0f172a';
const DARK = '#1e293b';
const TEXT = '#475569';
const MUTED = '#64748b';
const BORDER = '#e2e8f0';
const BLUE = '#2563eb';

const container = {
  maxWidth: '920px',
  margin: '0 auto',
};

const pageHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 20,
  marginBottom: 24,
};

const titleStyle = {
  margin: 0,
  color: NAVY,
  fontSize: 24,
  fontWeight: 700,
};

const hint = {
  margin: '6px 0 0',
  color: TEXT,
  fontSize: 14,
};

const addBtn = {
  background: BLUE,
  color: '#fff',
  border: 'none',
  padding: '11px 17px',
  borderRadius: 9,
  cursor: 'pointer',
  fontWeight: 600,
};

const list = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const card = {
  background: '#fff',
  padding: 16,
  borderRadius: 12,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 16,
  border: `1px solid ${BORDER}`,
  boxShadow: '0 3px 12px rgba(15,23,42,0.06)',
};

const contentArea = {
  flex: 1,
  minWidth: 0,
};

const cardTitle = {
  margin: '0 0 8px',
  color: DARK,
  fontSize: 16,
  fontWeight: 700,
};

const cardBody = {
  color: TEXT,
  margin: 0,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
  fontSize: 14,
};

const dateStyle = {
  fontSize: 12,
  color: MUTED,
  marginTop: 10,
};

const actions = {
  display: 'flex',
  gap: 8,
  flexShrink: 0,
};

const editBtn = {
  background: '#0284c7',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const deleteBtn = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const emptyState = {
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: 20,
  textAlign: 'center',
  color: MUTED,
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.55)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: 20,
};

const modal = {
  background: '#fff',
  padding: 22,
  borderRadius: 14,
  width: 'min(450px, 92vw)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow: '0 20px 50px rgba(15,23,42,0.25)',
};

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const modalTitle = {
  margin: 0,
  color: NAVY,
  fontSize: 20,
};

const closeBtn = {
  border: 'none',
  background: '#f1f5f9',
  color: DARK,
  width: 34,
  height: 34,
  borderRadius: 8,
  fontSize: 22,
  cursor: 'pointer',
};

const input = {
  padding: 11,
  borderRadius: 8,
  border: `1px solid ${BORDER}`,
  color: DARK,
  background: '#fff',
  outline: 'none',
  fontSize: 14,
};

const textarea = {
  padding: 11,
  borderRadius: 8,
  border: `1px solid ${BORDER}`,
  color: DARK,
  background: '#fff',
  minHeight: 120,
  resize: 'vertical',
  outline: 'none',
  fontSize: 14,
  lineHeight: 1.5,
};

const modalActions = {
  display: 'flex',
  gap: 10,
};

const saveBtn = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const cancelBtn = {
  background: '#e2e8f0',
  color: DARK,
  border: 'none',
  padding: '10px 15px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

export default ManagePosts;