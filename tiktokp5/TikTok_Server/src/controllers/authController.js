// When generating the JWT token, make sure to include the user ID
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,  // Make sure this is included
      email: user.email,
      username: user.username
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};