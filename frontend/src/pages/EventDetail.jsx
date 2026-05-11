import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { CalendarIcon, MapPin, Clock, Tag, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingAmount, setBookingAmount] = useState(1);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    const handleBook = async () => {
        setError('');
        try {
            await api.post(`/events/${id}/bookings`, { seats: bookingAmount });
            setBookingSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ message: 'Please sign in to view event details.' }} />;
    }

    if (!event) {
        return <div className="text-center py-32 text-xl text-gray-600">Event not found</div>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-64 sm:h-96 relative bg-gray-200"
                >
                    {event.image && event.image !== 'no-photo.jpg' ? (
                        <img src={event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium text-lg">
                            No Poster Image
                        </div>
                    )}
                </motion.div>
                
                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
                        {/* Event Details */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-4 uppercase tracking-wide text-sm">
                                <Tag size={18} />
                                <span>{event.category}</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                {event.title}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                {event.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-3 rounded-full mr-4 text-indigo-600">
                                        <CalendarIcon size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-medium">Date</div>
                                        <div className="font-semibold">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-3 rounded-full mr-4 text-indigo-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-medium">Time</div>
                                        <div className="font-semibold">{event.time}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-3 rounded-full mr-4 text-indigo-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-medium">Location</div>
                                        <div className="font-semibold">{event.location}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-3 rounded-full mr-4 text-indigo-600">
                                        <UserIcon size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-medium">Organizer</div>
                                        <div className="font-semibold">{event.organizer?.name || 'Unknown'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="md:w-80 flex-shrink-0"
                        >
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {event.price === 0 ? 'Free' : `₹${event.price}`}
                                </h3>
                                <div className="text-sm text-gray-500 mb-6">per ticket</div>
                                
                                {bookingSuccess ? (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center mb-4">
                                        <p className="font-bold">Booking Confirmed!</p>
                                        <p className="text-sm mt-1">Check your dashboard for details.</p>
                                    </div>
                                ) : (
                                    <>
                                        {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</div>}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                className="input-field"
                                                value={bookingAmount}
                                                onChange={(e) => setBookingAmount(e.target.value)}
                                            />
                                        </div>
                                        {user?.role === 'Organizer' || user?.role === 'Admin' ? (
                                             <button disabled className="w-full btn-secondary py-3 italic cursor-not-allowed text-center">
                                                Organizers cannot book
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleBook}
                                                className="w-full btn-primary py-3 font-bold text-lg shadow-md transition transform hover:-translate-y-1"
                                            >
                                                Book Now
                                            </button>
                                        )}
                                        <p className="text-xs text-gray-400 mt-4 text-center">Taxes and fees calculated at checkout.</p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventDetail;
