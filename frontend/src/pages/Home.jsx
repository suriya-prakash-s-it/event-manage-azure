import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events?limit=3');
                setEvents(res.data.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-indigo-900 overflow-hidden text-white min-h-[600px] flex items-center">
                {/* Animated Background Blobs */}
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4s' }}></div>

                <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-900 mix-blend-multiply" />
                </div>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32 w-full"
                >
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6"
                    >
                        Discover & Create <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Unforgettable</span> Events
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-10"
                    >
                        Join thousands of attendees at premier tech conferences, local music festivals, and immersive workshops. Your next great experience starts here.
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link to="/events" className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-indigo-50 transition transform hover:-translate-y-1 hover:scale-105 text-center">
                            Explore Events
                        </Link>
                        <Link to="/register" className="px-8 py-4 bg-indigo-700/80 backdrop-blur-md text-white font-bold rounded-full shadow-lg hover:bg-indigo-600 border border-indigo-400/30 transition transform hover:-translate-y-1 hover:scale-105 text-center">
                            Host an Event
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Featured Events */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Events</h2>
                        <p className="text-gray-500 mt-2">Check out what's coming up next.</p>
                    </div>
                    <Link to="/events" className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                        View All <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
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
        </div>
    );
};

export default Home;
