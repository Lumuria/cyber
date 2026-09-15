import { API_URL } from './apiConfig';

export async function getAllUsers() {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();

    return Array.isArray(data.users)
      ? data.users.map((user) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role || 'member',
          isAdmin: Boolean(user.is_admin),
          isVerified: Boolean(user.email_verified_at),
          permissions: user.is_admin ? ['*'] : [],
          createdAt: user.created_at,
          verifiedAt: user.email_verified_at,
        }))
      : [];
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
}