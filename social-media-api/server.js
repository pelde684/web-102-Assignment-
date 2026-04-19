// server.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Social Media API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));