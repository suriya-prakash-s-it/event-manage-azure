const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Get all bookings (Admin/Organizer sees relevants, User sees own)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
    try {
        let query;

        if (req.user.role === 'Admin') {
            query = Booking.find().populate('event', 'title date location').populate('user', 'name email');
        } else if (req.user.role === 'Organizer') {
            // Find events by organizer, then find bookings for those events
             const events = await Event.find({ organizer: req.user.id });
             const eventIds = events.map(evt => evt._id);
             query = Booking.find({ event: { $in: eventIds } }).populate('event', 'title date').populate('user', 'name email');
        } else {
            // Attendee sees only their own
            query = Booking.find({ user: req.user.id }).populate('event', 'title date location image');
        }

        const bookings = await query;
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create a booking
// @route   POST /api/events/:eventId/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        req.body.event = req.params.eventId;
        req.body.user = req.user.id;

        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Add logic to check capacity vs current bookings if needed
        const totalBookings = await Booking.aggregate([
            { $match: { event: event._id, bookingStatus: 'Confirmed' } },
            { $group: { _id: null, totalSeats: { $sum: '$seats' } } }
        ]);

        const currentBookedSeats = totalBookings.length > 0 ? totalBookings[0].totalSeats : 0;
        
        if (currentBookedSeats + req.body.seats > event.capacity) {
            return res.status(400).json({ success: false, error: 'Not enough seats available' });
        }

        // Calculate total amount
        req.body.totalAmount = event.price * req.body.seats;

        const booking = await Booking.create(req.body);

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Verify user owns booking or is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to cancel this booking' });
        }

        booking.bookingStatus = 'Cancelled';
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
