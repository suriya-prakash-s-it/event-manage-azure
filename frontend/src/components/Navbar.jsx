import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center text-indigo-600 font-bold text-xl tracking-tight">
                            <Calendar className="mr-2" size={24} />
                            EventManage
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link to="/events" className="text-gray-600 hover:text-indigo-600 font-medium">Browse Events</Link>
                        
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</Link>
                                <button 
                                    onClick={handleLogout}
                                    className="btn-secondary text-sm"
                                >
                                    Log Out
                                </button>
                                <div className="flex items-center pl-4 ml-2 border-l border-gray-200">
                                    <span className="font-semibold text-gray-800 text-sm mr-2">{user.name}</span>
                                    <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">{user.role}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Log In</Link>
                                <Link to="/register" className="btn-primary text-sm shadow-sm transition-transform hover:scale-105">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
