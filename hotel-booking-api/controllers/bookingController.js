exports.createBooking = (req, res) => {
  res.json({ message: "Booking created successfully" });
};

exports.getBooking = (req, res) => {
  res.json({
    bookingId: req.params.id,
    status: "confirmed"
  });
};

exports.cancelBooking = (req, res) => {
  res.json({ message: "Booking cancelled" });
};