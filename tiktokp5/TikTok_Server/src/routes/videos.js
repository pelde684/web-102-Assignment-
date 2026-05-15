const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/following', protect, videoController.getFollowingVideos);
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.get('/:id/comments', videoController.getVideoComments);

// ✅ FIXED: added /upload route that frontend posts to
router.post('/upload', protect, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.createVideo);

// Keep the root POST too (optional)
router.post('/', protect, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.createVideo);

router.put('/:id', protect, videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);

// Like/unlike - uncomment this
router.post('/:id/like', protect, videoController.toggleVideoLike);

module.exports = router;