exports.register = (req, res) => {
  res.json({ message: "User registered successfully" });
};

exports.login = (req, res) => {
  res.json({ message: "Login successful" });
};