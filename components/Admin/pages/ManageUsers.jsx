import { useEffect, useState } from 'react';
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from '../../../services/userAccounts';
import {
  ADMIN_SESSION_EMAIL,
  isAdminUser,
} from '../../../config/admin';
import { useAuth } from '../../Context/AuthContext';
import { useTranslation } from 'react-i18next';

const NAVY = '#0f172a';
const DARK = '#1e293b';
const TEXT = '#475569';
const BORDER = '#e2e8f0';

const container = {
  maxWidth: '1080px',
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
  minWidth: 860,
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
  borderBottom: `1px solid #f1f5f9`,
  color: TEXT,
  fontSize: 14,
  verticalAlign: 'middle',
};

const emailStyle = {
  color: DARK,
  fontWeight: 600,
};

const badge = {
  padding: '5px 9px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  display: 'inline-block',
};

const verifiedYes = {
  color: '#15803d',
  fontWeight: 600,
};

const verifiedNo = {
  color: '#dc2626',
  fontWeight: 600,
};

const actionBtn = {
  border: 'none',
  borderRadius: 8,
  padding: '7px 10px',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  marginInlineEnd: 6,
  marginBottom: 4,
};

export default function ManageUsers() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(t('adminPanel.users_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [t]);

  const runAction = async (userId, action) => {
    try {
      setBusyId(userId);
      setError('');
      await action();
      await loadUsers();
    } catch (err) {
      setError(err.message || t('adminPanel.users_action_error'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={container}>
      <div style={pageHeader}>
        <h2 style={titleStyle}>
          {t('adminPanel.manage_users_title')}
        </h2>

        <p style={hint}>
          {t('adminPanel.users_manage_hint')}
        </p>
      </div>

      {loading && (
        <div style={{ padding: 20 }}>
          {t('adminPanel.loading_users')}
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

      {!loading && (
        <div style={tableWrap}>
          <div style={tableScroll}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>{t('adminPanel.name')}</th>
                  <th style={th}>{t('adminPanel.email')}</th>
                  <th style={th}>{t('adminPanel.role')}</th>
                  <th style={th}>{t('adminPanel.status')}</th>
                  <th style={th}>{t('adminPanel.verified')}</th>
                  <th style={th}>{t('adminPanel.created')}</th>
                  <th style={th}>{t('adminPanel.actions')}</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        ...td,
                        textAlign: 'center',
                        padding: 30,
                      }}
                    >
                      {t('adminPanel.no_users')}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const admin =
                      isAdminUser(u) ||
                      u.isAdmin ||
                      u.email === ADMIN_SESSION_EMAIL;
                    const isSelf =
                      currentUser?.id === u.id ||
                      currentUser?.email === u.email;
                    const busy = busyId === u.id;

                    return (
                      <tr key={u.id || u.email}>
                        <td style={td}>{u.name || '-'}</td>

                        <td style={td}>
                          <span style={emailStyle}>
                            {u.email}
                          </span>
                        </td>

                        <td style={td}>
                          <span
                            style={{
                              ...badge,
                              background: admin
                                ? '#dbeafe'
                                : '#f1f5f9',
                              color: admin
                                ? '#1d4ed8'
                                : TEXT,
                            }}
                          >
                            {admin
                              ? t('adminPanel.admin')
                              : t('adminPanel.member')}
                          </span>
                        </td>

                        <td style={td}>
                          <span
                            style={{
                              ...badge,
                              background: u.isActive
                                ? '#dcfce7'
                                : '#fee2e2',
                              color: u.isActive
                                ? '#166534'
                                : '#b91c1c',
                            }}
                          >
                            {u.isActive
                              ? t('adminPanel.active')
                              : t('adminPanel.inactive')}
                          </span>
                        </td>

                        <td style={td}>
                          <span
                            style={
                              u.isVerified
                                ? verifiedYes
                                : verifiedNo
                            }
                          >
                            {u.isVerified
                              ? t('adminPanel.yes')
                              : t('adminPanel.no')}
                          </span>
                        </td>

                        <td style={td}>
                          {u.createdAt
                            ? new Date(
                                u.createdAt
                              ).toLocaleString()
                            : '-'}
                        </td>

                        <td style={td}>
                          <button
                            type="button"
                            disabled={busy || (isSelf && u.isActive)}
                            style={{
                              ...actionBtn,
                              background: u.isActive
                                ? '#ffedd5'
                                : '#dcfce7',
                              color: u.isActive
                                ? '#c2410c'
                                : '#166534',
                              opacity:
                                busy || (isSelf && u.isActive)
                                  ? 0.5
                                  : 1,
                            }}
                            onClick={() =>
                              runAction(u.id, () =>
                                updateUser(u.id, {
                                  is_active: !u.isActive,
                                })
                              )
                            }
                          >
                            {u.isActive
                              ? t('adminPanel.deactivate')
                              : t('adminPanel.activate')}
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            style={{
                              ...actionBtn,
                              background: '#e0e7ff',
                              color: '#3730a3',
                              opacity: busy ? 0.5 : 1,
                            }}
                            onClick={() =>
                              runAction(u.id, () =>
                                updateUser(u.id, {
                                  email_verified: !u.isVerified,
                                })
                              )
                            }
                          >
                            {u.isVerified
                              ? t('adminPanel.unverify')
                              : t('adminPanel.verify')}
                          </button>

                          <button
                            type="button"
                            disabled={busy || isSelf}
                            style={{
                              ...actionBtn,
                              background: '#fee2e2',
                              color: '#b91c1c',
                              opacity:
                                busy || isSelf ? 0.5 : 1,
                            }}
                            onClick={() => {
                              if (
                                !window.confirm(
                                  t('adminPanel.delete_user_confirm')
                                )
                              ) {
                                return;
                              }
                              runAction(u.id, () =>
                                deleteUser(u.id)
                              );
                            }}
                          >
                            {t('adminPanel.delete')}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
