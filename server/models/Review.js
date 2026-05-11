const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        required: [true, 'Please add some text']
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per event
reviewSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
