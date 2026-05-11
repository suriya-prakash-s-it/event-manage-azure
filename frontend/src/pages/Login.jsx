import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [infoMessage, setInfoMessage] = useState(location.state?.message || '');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await login(formData.email, formData.password);
            if (success) navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        }
    };

    return (
        <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 transform transition-all">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Log in to your account</p>
                </div>
                {infoMessage && !error && <div className="bg-blue-50 text-blue-600 p-3 rounded mb-4 text-center text-sm font-medium">{infoMessage}</div>}
                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-center text-sm font-medium">{error}</div>}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-3">
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
