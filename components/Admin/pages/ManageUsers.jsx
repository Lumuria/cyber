import { useEffect, useState } from 'react';
import { getAllUsers } from '../../../services/userAccounts';
import {
  ADMIN_SESSION_EMAIL,
  isAdminUser,
} from '../../../config/admin';
import { useTranslation } from 'react-i18next';

const NAVY = '#0f172a';
const DARK = '#1e293b';
const TEXT = '#475569';
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
  minWidth: 700,
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

export default function ManageUsers() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    loadUsers();
  }, [t]);

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

      {!loading && !error && (
        <div style={tableWrap}>
          <div style={tableScroll}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>
                    {t('adminPanel.name')}
                  </th>

                  <th style={th}>
                    {t('adminPanel.email')}
                  </th>

                  <th style={th}>
                    {t('adminPanel.role')}
                  </th>

                  <th style={th}>
                    {t('adminPanel.verified')}
                  </th>

                  <th style={th}>
                    {t('adminPanel.permissions')}
                  </th>

                  <th style={th}>
                    {t('adminPanel.created')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
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
                      u.email === ADMIN_SESSION_EMAIL;

                    return (
                      <tr key={u.id || u.email}>
                        <td style={td}>
                          {u.name || '-'}
                        </td>

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
                          {Array.isArray(u.permissions) &&
                          u.permissions.length
                            ? u.permissions.join(', ')
                            : '-'}
                        </td>

                        <td style={td}>
                          {u.createdAt
                            ? new Date(
                                u.createdAt
                              ).toLocaleString()
                            : '-'}
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