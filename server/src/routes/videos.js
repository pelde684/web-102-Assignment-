const express = require("express");
const router = express.Router();

const videos = [
  { id: 1, title: "First Video", userId: 1 },
  { id: 2, title: "Second Video", userId: 2 }
];

const comments = [
  { id: 1, videoId: 1, text: "Nice video!" },
  { id: 2, videoId: 1, text: "Amazing!" }
];

// Get all videos
router.get("/", (req, res) => {
  res.json(videos);
});

// Get video by ID
router.get("/:id", (req, res) => {
  const video = videos.find(v => v.id == req.params.id);
  res.json(video);
});

// Get comments of a video
router.get("/:id/comments", (req, res) => {
  const videoComments = comments.filter(c => c.videoId == req.params.id);
  res.json(videoComments);
});

module.exports = router;