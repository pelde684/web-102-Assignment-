const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomDetails);

module.exports = router;