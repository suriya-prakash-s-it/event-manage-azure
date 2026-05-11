const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Parsing query
        query = Event.find(JSON.parse(queryStr)).populate({
            path: 'organizer',
            select: 'name email'
        });

        // Search logic
        if (req.query.search) {
            query = query.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { location: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Event.countDocuments(JSON.parse(queryStr));

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const events = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: events.length,
            pagination,
            data: events
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate({
                path: 'organizer',
                select: 'name email'
            })
            .populate('bookings');

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer, Admin)
exports.createEvent = async (req, res) => {
    try {
        // Add user to req.body
        req.body.organizer = req.user.id;

        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer, Admin)
exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Make sure user is event organizer or Admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to update this event' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer, Admin)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Make sure user is event organizer or Admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'User not authorized to delete this event' });
        }

        await event.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
