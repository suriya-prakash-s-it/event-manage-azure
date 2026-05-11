import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Attendee' });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await register(formData.name, formData.email, formData.password, formData.role);
            if (success) navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register');
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 transform transition-all">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create an account</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Join EventManage today</p>
                </div>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-center text-sm">{error}</div>}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="input-field"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
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
                            minLength="6"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a...</label>
                        <select
                            name="role"
                            className="input-field"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Attendee">Looking to attend events</option>
                            <option value="Organizer">Looking to host events</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full btn-primary py-3 mt-4">
                        Sign Up
                    </button>
                    
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    
                    <button 
                        type="button" 
                        onClick={() => alert('Google OAuth integration requires client credentials in a production environment.')}
                        className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
