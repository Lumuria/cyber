import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { API_URL } from '../../services/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Load saved user immediately so the UI doesn't wait for the API
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('auth_user');

            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Failed to load saved user:', error);
            return null;
        }
    });

    // Only used while the initial authentication check is running
    const [loading, setLoading] = useState(false);

    const login = (userData) => {
        const normalized = {
            id: userData.id,
            name: userData.name,
            username: userData.username || '',
            email: userData.email,
            avatar: userData.avatar || null,
            isAdmin: Boolean(userData.isAdmin),
            role: userData.role || 'member',
            permissions: Array.isArray(userData.permissions)
                ? userData.permissions
                : [],
        };

        setUser(normalized);

        if (userData.token) {
            localStorage.setItem(
                'auth_token',
                userData.token
            );
        }

        localStorage.setItem(
            'auth_user',
            JSON.stringify(normalized)
        );
    };

    const logout = async () => {
        const token = localStorage.getItem('auth_token');

        try {
            if (token) {
                await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('auth_token');

            // No logged-in user
            if (!token) {
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/me`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Session expired');
                }

                const data = await response.json();

                const normalized = {
                    id: data.user.id,
                    name: data.user.name,
                    username: data.user.username || '',
                    email: data.user.email,
                    avatar: data.user.avatar || null,
                    isAdmin: Boolean(data.user.is_admin),
                    role: data.user.role || 'member',
                    permissions: Array.isArray(
                        data.user.permissions
                    )
                        ? data.user.permissions
                        : [],
                };

                setUser(normalized);

                localStorage.setItem(
                    'auth_user',
                    JSON.stringify(normalized)
                );
            } catch (error) {
                console.error(
                    'Authentication check failed:',
                    error
                );

                setUser(null);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);