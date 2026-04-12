import React, { createContext, useState, useContext } from 'react';

// إنشاء  (Context)
const AuthContext = createContext();

// إنشاء الـ Provider الذي يغلف التطبيق
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // تسجيل الدخول
    const login = (userData) => {
        const normalized = {
            email: userData.email,
            isAdmin: Boolean(userData.isAdmin),
        };
        setUser(normalized);
        localStorage.setItem('user', JSON.stringify(normalized));
    };

    // تسجيل الخروج
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // تحميل المستخدم المخزَّن عند إعادة فتح الموقع
    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({
                email: parsed.email,
                isAdmin: Boolean(parsed.isAdmin),
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// دالة مريحة لاستخدام الـ context في أي مكون
export const useAuth = () => useContext(AuthContext);
