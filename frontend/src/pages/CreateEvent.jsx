import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CreateEvent = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Conference',
        price: 0,
        capacity: 100,
        image: ''
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Redirect attendees away from this page
    if (user && user.role === 'Attendee') {
        navigate('/dashboard');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('image', file);
        setUploading(true);

        try {
            const res = await api.post('/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData({ ...formData, image: res.data });
            setUploading(false);
        } catch (err) {
            console.error(err);
            setError('Image upload failed');
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/events', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Event</h1>
                    <p className="text-gray-500 mt-2">Fill out the details below to publish your event.</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
                        <input
                            name="title"
                            type="text"
                            required
                            className="input-field"
                            placeholder="e.g. Developer Conference 2026"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            className="input-field"
                            placeholder="Describe what attendees can expect..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Poster</label>
                        <input
                            type="file"
                            onChange={uploadFileHandler}
                            className="input-field"
                            accept="image/*"
                        />
                        {uploading && <div className="mt-2 text-sm text-indigo-600 flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent mr-2"></div> Uploading...</div>}
                        {formData.image && (
                            <div className="mt-4">
                                <img 
                                    src={formData.image.startsWith('http') ? formData.image : `http://localhost:5000${formData.image}`} 
                                    alt="Poster preview" 
                                    className="h-32 object-cover rounded-lg border border-gray-200 shadow-sm" 
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                            <input
                                name="date"
                                type="date"
                                required
                                className="input-field"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time <span className="text-red-500">*</span></label>
                            <input
                                name="time"
                                type="time"
                                required
                                className="input-field"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                        <input
                            name="location"
                            type="text"
                            required
                            className="input-field"
                            placeholder="e.g. Moscone Center, SF (or Online)"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                            <select
                                name="category"
                                required
                                className="input-field"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="Conference">Conference</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Meetup">Meetup</option>
                                <option value="Party">Party</option>
                                <option value="Concert">Concert</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (₹) <span className="text-red-500">*</span></label>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                required
                                className="input-field"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity <span className="text-red-500">*</span></label>
                            <input
                                name="capacity"
                                type="number"
                                min="1"
                                required
                                className="input-field"
                                value={formData.capacity}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-4 border-t border-gray-100 mt-8">
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-primary min-w-[150px] flex justify-center"
                            disabled={loading}
                        >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Publish Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
