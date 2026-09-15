import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../services/apiConfig';

const NAVY = '#0f172a';
const DARK = '#1e293b';
const TEXT = '#475569';
const MUTED = '#64748b';
const BORDER = '#e2e8f0';

const container = {
  maxWidth: '920px',
  margin: '0 auto',
};

const pageHeader = {
  marginBottom: 22,
};

const titleStyle = {
  margin: 0,
  color: NAVY,
  fontSize: 24,
  fontWeight: 700,
};

const hint = {
  margin: '7px 0 0',
  color: TEXT,
  fontSize: 14,
  lineHeight: 1.6,
};

const tableWrap = {
  background: '#fff',
  borderRadius: 12,
  border: `1px solid ${BORDER}`,
  boxShadow: '0 3px 12px rgba(15,23,42,0.06)',
  overflow: 'hidden',
};

const tableScroll = {
  width: '100%',
  overflowX: 'auto',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 750,
};

const th = {
  textAlign: 'start',
  background: '#f8fafc',
  color: NAVY,
  fontWeight: 700,
  fontSize: 13,
  padding: '13px 14px',
  borderBottom: `1px solid ${BORDER}`,
};

const td = {
  padding: '13px 14px',
  borderBottom: '1px solid #f1f5f9',
  color: TEXT,
  fontSize: 14,
  verticalAlign: 'middle',
};

const emailStyle = {
  color: DARK,
  fontWeight: 600,
};

const secondaryText = {
  fontSize: 12,
  color: MUTED,
  marginTop: 4,
};

const commentStyle = {
  color: TEXT,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
};

const postStyle = {
  color: DARK,
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

export default function ManageComments() {
  const { t } = useTranslation();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadComments = async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setError(t('admin_comments.login_required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_URL}/comments`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            t('admin_comments.load_error')
        );
      }

      setComments(
        Array.isArray(data.comments)
          ? data.comments
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load comments:',
        err
      );

      setError(
        err.message ||
          t('admin_comments.load_error')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm(
      t('admin_comments.delete_confirm')
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('auth_token');

    if (!token) {
      setError(
        t('admin_comments.login_required')
      );
      return;
    }

    try {
      setDeletingId(commentId);
      setError('');

      const response = await fetch(
        `${API_URL}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            t('admin_comments.delete_error')
        );
      }

      setComments((current) =>
        current.filter(
          (comment) =>
            String(comment.id) !==
            String(commentId)
        )
      );
    } catch (err) {
      console.error(
        'Delete comment error:',
        err
      );

      setError(
        err.message ||
          t('admin_comments.delete_error')
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={container}>
      <div style={pageHeader}>
        <h2 style={titleStyle}>
          {t('admin_comments.title')}
        </h2>

        <p style={hint}>
          {t('admin_comments.hint')}
        </p>
      </div>

      {loading && (
        <div style={{ padding: 20 }}>
          {t('admin_comments.loading')}
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            padding: 15,
            color: '#dc2626',
            background: '#fef2f2',
            borderRadius: 8,
            marginBottom: 15,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={tableWrap}>
          <div style={tableScroll}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>
                    {t('admin_comments.user')}
                  </th>

                  <th style={th}>
                    {t('admin_comments.comment')}
                  </th>

                  <th style={th}>
                    {t('admin_comments.post')}
                  </th>

                  <th style={th}>
                    {t('admin_comments.created')}
                  </th>

                  <th style={th}>
                    {t('admin_comments.action')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {comments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        ...td,
                        textAlign: 'center',
                        padding: 30,
                      }}
                    >
                      {t('admin_comments.empty')}
                    </td>
                  </tr>
                ) : (
                  comments.map((comment) => (
                    <tr key={comment.id}>
                      <td style={td}>
                        <div style={emailStyle}>
                          {comment.user?.name ||
                            comment.user?.username ||
                            '-'}
                        </div>

                        <div style={secondaryText}>
                          {comment.user?.email ||
                            '-'}
                        </div>
                      </td>

                      <td style={td}>
                        <div style={commentStyle}>
                          {comment.text || '-'}
                        </div>
                      </td>

                      <td style={td}>
                        <span style={postStyle}>
                          {comment.post?.title ||
                            `${t(
                              'admin_comments.post_number'
                            )} #${comment.post_id}`}
                        </span>
                      </td>

                      <td style={td}>
                        {comment.created_at
                          ? new Date(
                              comment.created_at
                            ).toLocaleString()
                          : '-'}
                      </td>

                      <td style={td}>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              comment.id
                            )
                          }
                          disabled={
                            deletingId ===
                            comment.id
                          }
                          style={{
                            ...deleteBtn,
                            opacity:
                              deletingId ===
                              comment.id
                                ? 0.6
                                : 1,
                            cursor:
                              deletingId ===
                              comment.id
                                ? 'not-allowed'
                                : 'pointer',
                          }}
                        >
                          {deletingId ===
                          comment.id
                            ? t(
                                'admin_comments.deleting'
                              )
                            : t(
                                'admin_comments.delete'
                              )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}