const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const bcrypt = require('bcrypt');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
    try {
        // We will no longer delete existing users/events so real signups are preserved
        // await User.deleteMany();
        // await Event.deleteMany();

        let adminUser = await User.findOne({ email: 'admin@test.com' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'Admin'
            });
        }

        let organizerUser = await User.findOne({ email: 'org@test.com' });
        if (!organizerUser) {
            organizerUser = await User.create({
                name: 'Organizer User',
                email: 'org@test.com',
                password: 'password123',
                role: 'Organizer'
            });

            // Seed default events only when we create the default organizer
            await Event.create([
                {
                    title: 'Tech Conference 2026',
                    description: 'The biggest tech conference of the year.',
                    date: new Date('2026-06-15'),
                    time: '09:00 AM',
                    location: 'San Francisco, CA',
                    category: 'Conference',
                    price: 150,
                    capacity: 500,
                    organizer: organizerUser._id
                },
                {
                    title: 'Local Music Festival',
                    description: 'A festival featuring local bands.',
                    date: new Date('2026-07-20'),
                    time: '04:00 PM',
                    location: 'Austin, TX',
                    category: 'Concert',
                    price: 50,
                    capacity: 1000,
                    organizer: organizerUser._id
                }
            ]);
        }

        let attendeeUser = await User.findOne({ email: 'attendee@test.com' });
        if (!attendeeUser) {
            attendeeUser = await User.create({
                name: 'Attendee User',
                email: 'attendee@test.com',
                password: 'password123',
                role: 'Attendee'
            });
        }

        console.log('Seed data verified! Existing users and events were not deleted.');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else {
    console.log('Use -i to import data');
    process.exit();
}
