const express = require("express");
const router = express.Router();

// Example in-memory user data
const users = [
  { id: 1, username: "user1", name: "User One" },
  { id: 2, username: "user2", name: "User Two" }
];

// GET all users
router.get("/", (req, res) => {
  res.json(users);
});

// GET user by ID
router.get("/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;