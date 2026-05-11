const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    seats: {
        type: Number,
        required: [true, 'Please specify the number of seats'],
        min: [1, 'Must book at least 1 seat']
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    bookingStatus: {
        type: String,
        enum: ['Confirmed', 'Cancelled'],
        default: 'Confirmed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
