const { comments } = require("../models");

exports.getAllComments = (req, res) => {
  res.json(comments);
};

exports.getCommentById = (req, res) => {
  const comment = comments.find(c => c.id == req.params.id);

  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  res.json(comment);
};

exports.createComment = (req, res) => {
  const newComment = {
    id: comments.length + 1,
    videoId: req.body.videoId,
    userId: req.body.userId,
    text: req.body.text
  };

  comments.push(newComment);

  res.status(201).json(newComment);
};

exports.updateComment = (req, res) => {
  const comment = comments.find(c => c.id == req.params.id);

  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  comment.text = req.body.text || comment.text;

  res.json(comment);
};

exports.deleteComment = (req, res) => {
  const index = comments.findIndex(c => c.id == req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "Comment not found" });

  comments.splice(index, 1);

  res.json({ message: "Comment deleted" });
};