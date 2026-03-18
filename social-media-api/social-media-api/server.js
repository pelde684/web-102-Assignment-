const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const users = require("./routes/users");
const posts = require("./routes/posts");

const formatResponse = require("./middleware/responseFormat");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(formatResponse);

app.use("/users", users);
app.use("/posts", posts);

app.get("/", (req, res) => {
  res.send("Social Media API Running");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});