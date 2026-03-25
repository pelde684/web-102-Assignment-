const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { likes } = require('../utils/mockData');

// @desc    Get all likes
// @route   GET /api/likes
// @access  Public
exports.getLikes = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = likes.length;

    const results = likes.slice(startIndex, endIndex);

    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({
        success: true,
        count: results.length,
        page,
        total_pages: Math.ceil(total / limit),
        pagination,
        data: results
    });
});

// @desc    Get single like
// @route   GET /api/likes/:id
// @access  Public
exports.getLike = asyncHandler(async (req, res, next) => {
    const like = likes.find(l => l.id === req.params.id);

    if (!like) {
        return next(
            new ErrorResponse(`Like not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: like });
});

// @desc    Create like
// @route   POST /api/likes
// @access  Public
exports.createLike = asyncHandler(async (req, res, next) => {
    const newLike = {
        id: (likes.length + 1).toString(),
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        created_at: new Date().toISOString().slice(0, 10)
    };

    likes.push(newLike);

    res.status(201).json({ success: true, data: newLike });
});

// @desc    Update like
// @route   PUT /api/likes/:id
// @access  Public
exports.updateLike = asyncHandler(async (req, res, next) => {
    const like = likes.find(l => l.id === req.params.id);

    if (!like) {
        return next(
            new ErrorResponse(`Like not found with id of ${req.params.id}`, 404)
        );
    }

    const index = likes.findIndex(l => l.id === req.params.id);

    likes[index] = { ...like, ...req.body };

    res.status(200).json({ success: true, data: likes[index] });
});

// @desc    Delete like
// @route   DELETE /api/likes/:id
// @access  Public
exports.deleteLike = asyncHandler(async (req, res, next) => {
    const index = likes.findIndex(l => l.id === req.params.id);

    if (index === -1) {
        return next(
            new ErrorResponse(`Like not found with id of ${req.params.id}`, 404)
        );
    }

    likes.splice(index, 1);

    res.status(200).json({ success: true, data: {} });
});