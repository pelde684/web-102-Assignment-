const { posts } = require("../utils/mockData");

exports.getPosts = (req, res) => {

  res.status(200).json({
    success: true,
    data: posts
  });

};

exports.getPost = (req, res) => {

  const post = posts.find(p => p.id == req.params.id);

  res.status(200).json({
    success: true,
    data: post
  });

};

exports.createPost = (req, res) => {

  const newPost = {
    id: posts.length + 1,
    ...req.body
  };

  posts.push(newPost);

  res.status(201).json({
    success: true,
    data: newPost
  });

};

exports.deletePost = (req, res) => {

  res.status(200).json({
    success: true,
    message: "Post deleted"
  });

};