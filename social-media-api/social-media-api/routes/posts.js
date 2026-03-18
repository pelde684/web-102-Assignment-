const express = require("express");
const router = express.Router();

const {
  getPosts,
  getPost,
  createPost,
  deletePost
} = require("../controllers/postController");

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);

module.exports = router;