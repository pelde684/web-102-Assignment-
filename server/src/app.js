// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Import route files
const userRoutes = require("./routes/users");
const videoRoutes = require("./routes/videos");
const commentRoutes = require("./routes/comments");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("TikTok API is running");
});

module.exports = app;