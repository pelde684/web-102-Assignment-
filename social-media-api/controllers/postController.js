// controllers/postController.js
let posts = [];

exports.getPosts = (req, res) => {
  res.json({ success: true, data: posts });
};

exports.getPost = (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.json({ success: true, data: post || null });
};

exports.createPost = (req, res) => {
  const post = { id: Date.now().toString(), ...req.body };
  posts.push(post);
  res.status(201).json({ success: true, data: post });
};

exports.updatePost = (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Post not found" });
  posts[index] = { ...posts[index], ...req.body };
  res.json({ success: true, data: posts[index] });
};

exports.deletePost = (req, res) => {
  posts = posts.filter(p => p.id !== req.params.id);
  res.json({ success: true, data: [] });
};