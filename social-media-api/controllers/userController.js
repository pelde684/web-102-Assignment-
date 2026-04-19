// controllers/userController.js
let users = [];

exports.getUsers = (req, res) => {
  res.json({ success: true, data: users });
};

exports.createUser = (req, res) => {
  const user = { id: Date.now().toString(), ...req.body };
  users.push(user);
  res.status(201).json({ success: true, data: user });
};