const express = require('express');
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, authorize('Organizer', 'Admin'), createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('Organizer', 'Admin'), updateEvent)
    .delete(protect, authorize('Organizer', 'Admin'), deleteEvent);

module.exports = router;
