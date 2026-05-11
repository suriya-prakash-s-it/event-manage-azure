const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const updatePosters = async () => {
    try {
        console.log('Updating posters...');
        
        // Update Tech Conference
        await Event.updateMany(
            { title: /Tech Conference/i },
            { $set: { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' } }
        );

        // Update Music Festival
        await Event.updateMany(
            { title: /Local Music Festival/i },
            { $set: { image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' } }
        );

        // Update any other events that have no-photo.jpg
        await Event.updateMany(
            { image: 'no-photo.jpg' },
            { $set: { image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' } }
        );

        console.log('Posters updated successfully!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updatePosters();
