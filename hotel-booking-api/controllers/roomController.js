exports.getRooms = (req, res) => {
  res.json({
    rooms: [
      { id: 1, type: "Single", price: 50 },
      { id: 2, type: "Double", price: 100 }
    ]
  });
};

exports.getRoomDetails = (req, res) => {
  res.json({
    id: req.params.id,
    type: "Single",
    price: 50
  });
};