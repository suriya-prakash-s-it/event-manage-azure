import { useEffect, useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { CalendarIcon, MapPin, Hash, Trash2, Edit2 } from 'lucide-react';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                if (user.role === 'Attendee') {
                    const res = await api.get('/bookings');
                    setBookings(res.data.data);
                } else if (user.role === 'Organizer') {
                    const resEvents = await api.get('/events');
                    // In a real app we'd filter on the backend for this user. The backend getEvents currently gets all, but let's filter visually here since auth lets them do CRUD. Wait, we can get bookings by this user's events via /bookings.
                    const resBookings = await api.get('/bookings');
                    setBookings(resBookings.data.data);
                    
                    // Filter events down to just theirs for the UI.
                    const currentUserId = user._id || user.id;
                    const filtered = resEvents.data.data.filter(evt => evt.organizer && evt.organizer._id === currentUserId);
                    setMyEvents(filtered);
                } else if (user.role === 'Admin') {
                     const resEvents = await api.get('/events');
                     setMyEvents(resEvents.data.data);
                     const resBookings = await api.get('/bookings');
                     setBookings(resBookings.data.data);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchDashboardData();
    }, [user]);

    const handleCancelBooking = async (id) => {
        try {
            await api.put(`/bookings/${id}/cancel`);
            // Refresh
            setBookings(bookings.map(b => b._id === id ? { ...b, bookingStatus: 'Cancelled' } : b));
        } catch (err) {
            console.error('Cancel failed', err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ message: 'Please sign in to access your dashboard.' }} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {user.name}</h1>
                <p className="text-gray-500 mt-2">
                    <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded text-sm font-semibold mr-2">{user.email}</span>
                    Manage your account and view your activities here as an <span className="font-semibold text-indigo-600">{user.role}</span>.
                </p>
            </div>

            {user.role === 'Attendee' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">My Bookings</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {bookings.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">You have no upcoming bookings.</div>
                        ) : (
                            bookings.map(booking => (
                                <div key={booking._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.event?.title || 'Event Deleted'}</h3>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <span className="flex items-center"><CalendarIcon size={14} className="mr-1" /> {booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}</span>
                                            <span className="flex items-center"><MapPin size={14} className="mr-1" /> {booking.event?.location || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-900">{booking.seats} Tickets</div>
                                            <div className={`text-xs font-bold uppercase mt-1 ${booking.bookingStatus === 'Confirmed' ? 'text-green-600' : 'text-red-500'}`}>
                                                {booking.bookingStatus}
                                            </div>
                                        </div>
                                        {booking.bookingStatus !== 'Cancelled' && (
                                            <button onClick={() => handleCancelBooking(booking._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition-colors">
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {(user.role === 'Organizer' || user.role === 'Admin') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Events Panel */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{user.role === 'Admin' ? 'All Events' : 'My Hosted Events'}</h2>
                            <Link to="/events/new" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors">+ New Event</Link>
                        </div>
                        <div className="divide-y divide-gray-100 h-96 overflow-y-auto">
                            {myEvents.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No events found.</div>
                            ) : (
                                myEvents.map(event => (
                                    <div key={event._id} className="p-6 flex justify-between items-center group hover:bg-gray-50 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                                            <div className="text-sm text-gray-500 mt-1 flex space-x-4">
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                                <span className="font-medium text-indigo-600">₹{event.price} / Ticket</span>
                                            </div>
                                        </div>
                                        <Link 
                                            to={`/events/${event._id}/edit`} 
                                            className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                                            title="Edit Event"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Bookings Panel */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
                        </div>
                        <div className="divide-y divide-gray-100 h-96 overflow-y-auto">
                            {bookings.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No bookings found.</div>
                            ) : (
                                bookings.map(booking => (
                                    <div key={booking._id} className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-gray-900">{booking.user?.name || 'Unknown User'}</div>
                                                <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-indigo-600">{booking.seats} Tickets</div>
                                                <div className="text-xs text-gray-400 mt-1">₹{booking.totalAmount}</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600 flex items-center">
                                            <Hash size={14} className="mr-1 text-gray-400"/>
                                            <span className="truncate">{booking.event?.title || 'Unknown Event'}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
