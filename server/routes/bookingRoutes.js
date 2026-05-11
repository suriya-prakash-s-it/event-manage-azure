const express = require('express');
const { getBookings, createBooking, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getBookings)
    .post(protect, createBooking);

router.route('/:id/cancel')
    .put(protect, cancelBooking);

module.exports = router;
