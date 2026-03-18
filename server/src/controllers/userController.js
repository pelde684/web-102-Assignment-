const { users, videos } = require("../models");

exports.getAllUsers = (req, res) => {
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

exports.createUser = (req, res) => {
  const newUser = {
    id: users.length + 1,
    username: req.body.username
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.username = req.body.username || user.username;

  res.json(user);
};

exports.deleteUser = (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "User not found" });

  users.splice(index, 1);

  res.json({ message: "User deleted" });
};

exports.getUserVideos = (req, res) => {
  const userVideos = videos.filter(
    v => v.userId == req.params.id
  );

  res.json(userVideos);
};