const { users } = require("../utils/mockData");

exports.getUsers = (req, res) => {

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });

};

exports.getUser = (req, res) => {

  const user = users.find(u => u.id == req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });

};

exports.createUser = (req, res) => {

  const newUser = {
    id: users.length + 1,
    ...req.body
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser
  });

};

exports.updateUser = (req, res) => {

  res.status(200).json({
    success: true,
    message: "User updated"
  });

};

exports.deleteUser = (req, res) => {

  res.status(200).json({
    success: true,
    message: "User deleted"
  });

};