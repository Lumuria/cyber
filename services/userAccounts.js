import { API_URL } from './apiConfig';

function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function mapUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role || 'member',
    isAdmin: Boolean(user.is_admin),
    isActive: user.is_active !== false,
    isVerified: Boolean(user.email_verified_at),
    permissions: user.is_admin ? ['*'] : [],
    createdAt: user.created_at,
    verifiedAt: user.email_verified_at,
  };
}

export async function getAllUsers() {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();

    return Array.isArray(data.users)
      ? data.users.map(mapUser)
      : [];
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
}

export async function updateUser(userId, payload) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message || 'Failed to update user'
    );
  }

  return mapUser(data.user);
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message || 'Failed to delete user'
    );
  }

  return true;
}
