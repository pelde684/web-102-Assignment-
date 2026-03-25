const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { comments } = require('../utils/mockData');

// @desc    Get all comments
// @route   GET /api/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = comments.length;

    const results = comments.slice(startIndex, endIndex);

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

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = asyncHandler(async (req, res, next) => {
    const comment = comments.find(c => c.id === req.params.id);

    if (!comment) {
        return next(
            new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: comment });
});

// @desc    Create comment
// @route   POST /api/comments
// @access  Public
exports.createComment = asyncHandler(async (req, res, next) => {
    const newComment = {
        id: (comments.length + 1).toString(),
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        content: req.body.content,
        created_at: new Date().toISOString().slice(0, 10)
    };

    comments.push(newComment);

    res.status(201).json({ success: true, data: newComment });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Public
exports.updateComment = asyncHandler(async (req, res, next) => {
    const comment = comments.find(c => c.id === req.params.id);

    if (!comment) {
        return next(
            new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
        );
    }

    const index = comments.findIndex(c => c.id === req.params.id);

    comments[index] = { ...comment, ...req.body };

    res.status(200).json({ success: true, data: comments[index] });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Public
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const index = comments.findIndex(c => c.id === req.params.id);

    if (index === -1) {
        return next(
            new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
        );
    }

    comments.splice(index, 1);

    res.status(200).json({ success: true, data: {} });
});