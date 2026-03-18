const users = [
  {
    id: 1,
    username: "traveler",
    full_name: "Karma",
    bio: "Travel photographer",
    created_at: "2023-01-15"
  },
  {
    id: 2,
    username: "explorer",
    full_name: "Sonam",
    bio: "Nature lover",
    created_at: "2023-02-10"
  }
];

const posts = [
  {
    id: 1,
    userId: 1,
    caption: "Beautiful Mountains",
    image: "mountain.jpg"
  }
];

module.exports = { users, posts };