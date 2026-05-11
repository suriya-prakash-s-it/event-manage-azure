import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth/me');
                setUser({ ...res.data.data, token });
            } catch (error) {
                console.error(error);
                localStorage.removeItem('token');
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser({ ...res.data.user, token: res.data.token });
        return true;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/auth/register', { name, email, password, role });
        localStorage.setItem('token', res.data.token);
        setUser({ ...res.data.user, token: res.data.token });
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
