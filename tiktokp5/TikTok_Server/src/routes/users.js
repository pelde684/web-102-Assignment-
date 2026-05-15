// src/routes/users.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Auth routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// User routes
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/videos', userController.getUserVideos);
router.post('/:id/follow', userController.followUser);
router.delete('/:id/follow', userController.unfollowUser);
router.get('/:id/followers', userController.getUserFollowers);
router.get('/:id/following', userController.getUserFollowing);

module.exports = router;