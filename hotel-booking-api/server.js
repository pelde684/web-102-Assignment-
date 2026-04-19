const express = require("express");
const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Hotel Booking API Running");
});

// Auth routes
app.post("/api/auth/register", (req, res) => {
  res.json({ message: "User registered successfully" });
});

app.post("/api/auth/login", (req, res) => {
  res.json({ message: "Login successful" });
});

// Rooms routes
app.get("/api/rooms", (req, res) => {
  res.json({
    rooms: [
      { id: 1, type: "Single", price: 50 },
      { id: 2, type: "Double", price: 100 }
    ]
  });
});

app.get("/api/rooms/:id", (req, res) => {
  res.json({
    id: req.params.id,
    type: "Single",
    price: 50
  });
});

// Bookings routes
app.post("/api/bookings", (req, res) => {
  res.json({ message: "Booking created successfully" });
});

app.get("/api/bookings/:id", (req, res) => {
  res.json({ bookingId: req.params.id, status: "confirmed" });
});

app.delete("/api/bookings/:id", (req, res) => {
  res.json({ message: "Booking cancelled" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});