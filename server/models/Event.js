const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    time: {
        type: String,
        required: [true, 'Please add a time']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Conference', 'Seminar', 'Workshop', 'Meetup', 'Party', 'Concert', 'Other']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price. 0 for free'],
        default: 0
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    capacity: {
        type: Number,
        required: [true, 'Please add total capacity for the event']
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Upcoming'
    },
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete bookings when an event is deleted
eventSchema.pre('remove', async function(next) {
    await this.model('Booking').deleteMany({ event: this._id });
    await this.model('Review').deleteMany({ event: this._id });
    next();
});

// Reverse populate with bookings
eventSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'event',
    justOne: false
});

module.exports = mongoose.model('Event', eventSchema);
