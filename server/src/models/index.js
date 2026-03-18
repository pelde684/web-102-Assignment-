// src/models/index.js
let users = [
  { id: 1, username: "user1" },
  { id: 2, username: "user2" },
];

let videos = [
  { id: 1, userId: 1, title: "First Video", likes: 5 },
  { id: 2, userId: 2, title: "Second Video", likes: 3 },
];

let comments = [
  { id: 1, videoId: 1, userId: 2, text: "Nice video!" },
  { id: 2, videoId: 2, userId: 1, text: "Great job!" },
];

module.exports = {
  users,
  videos,
  comments,
};