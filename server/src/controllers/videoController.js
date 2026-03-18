const { videos, comments } = require("../models");

exports.getAllVideos = (req, res) => {
  res.json(videos);
};

exports.getVideoById = (req, res) => {
  const video = videos.find(v => v.id == req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  res.json(video);
};

exports.createVideo = (req, res) => {
  const newVideo = {
    id: videos.length + 1,
    userId: req.body.userId,
    title: req.body.title,
    likes: 0
  };

  videos.push(newVideo);
  res.status(201).json(newVideo);
};

exports.updateVideo = (req, res) => {
  const video = videos.find(v => v.id == req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  video.title = req.body.title || video.title;

  res.json(video);
};

exports.deleteVideo = (req, res) => {
  const index = videos.findIndex(v => v.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "Video not found" });

  videos.splice(index, 1);
  res.json({ message: "Video deleted" });
};

exports.getVideoComments = (req, res) => {
  const videoComments = comments.filter(
    c => c.videoId == req.params.id
  );

  res.json(videoComments);
};