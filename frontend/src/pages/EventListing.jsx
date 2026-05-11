import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const EventListing = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
    };

    const fetchEvents = async (query = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/events${query ? `?search=${query}` : ''}`);
            setEvents(res.data.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchEvents(search);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">All Events</h1>
                <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
                    <input
                        type="text"
                        placeholder="Search events... (Title, Location)"
                        className="input-field pr-12 w-full md:w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-indigo-600">
                        <Search size={20} />
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {events.map(event => (
                        <motion.div variants={itemVariants} key={event._id} className="h-full">
                            <Link to={`/events/${event._id}`} className="card group cursor-pointer flex flex-col h-full block">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {event.image && event.image !== 'no-photo.jpg' ? (
                                        <img src={event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        {event.price === 0 ? 'Free' : `₹${event.price}`}
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                                        {event.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                                        {event.title}
                                    </h3>
                                    <div className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        {event.description}
                                    </div>
                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <CalendarIcon size={16} className="mr-2 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin size={16} className="mr-2 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default EventListing;
