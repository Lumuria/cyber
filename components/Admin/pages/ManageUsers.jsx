import { getAllUsers } from '../../../services/userAccounts';
import { ADMIN_SESSION_EMAIL, isAdminUser } from '../../../config/admin';

const container = { maxWidth: '920px', margin: '0 auto' };
const tableWrap = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  overflow: 'hidden',
};
const table = { width: '100%', borderCollapse: 'collapse' };
const th = {
  textAlign: 'start',
  background: '#f8fafc',
  color: '#334155',
  fontWeight: 700,
  fontSize: 13,
  padding: '12px 14px',
  borderBottom: '1px solid #e2e8f0',
};
const td = {
  padding: '12px 14px',
  borderBottom: '1px solid #f1f5f9',
  color: '#334155',
  fontSize: 14,
};
const badge = {
  padding: '4px 8px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  display: 'inline-block',
};

export default function ManageUsers() {
  const users = getAllUsers();

  return (
    <div style={container}>
      <h2 style={{ marginBottom: 8 }}>Manage Users</h2>
      <p style={{ marginTop: 0, marginBottom: 16, color: '#64748b', fontSize: 14 }}>
        Admin account has full permissions. Verified users only can log in.
      </p>

      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>Verified</th>
              <th style={th}>Permissions</th>
              <th style={th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const admin = isAdminUser(u) || u.email === ADMIN_SESSION_EMAIL;
              return (
                <tr key={u.email}>
                  <td style={td}>{u.email}</td>
                  <td style={td}>
                    <span
                      style={{
                        ...badge,
                        background: admin ? '#dbeafe' : '#f1f5f9',
                        color: admin ? '#1d4ed8' : '#475569',
                      }}
                    >
                      {admin ? 'Admin' : 'Member'}
                    </span>
                  </td>
                  <td style={td}>{u.isVerified ? 'Yes' : 'No'}</td>
                  <td style={td}>
                    {Array.isArray(u.permissions) && u.permissions.length
                      ? u.permissions.join(', ')
                      : '-'}
                  </td>
                  <td style={td}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
