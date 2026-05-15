const express = require('express');
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Video-specific comment routes (these must come before /:id routes)
router.get('/video/:videoId', commentController.getCommentsByVideo);
router.post('/video/:videoId', protect, commentController.addCommentToVideo);

// Generic comment routes
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.put('/:id', protect, commentController.updateComment);
router.delete('/:id', protect, commentController.deleteComment);
router.post('/:id/like', protect, commentController.toggleCommentLike);

module.exports = router;