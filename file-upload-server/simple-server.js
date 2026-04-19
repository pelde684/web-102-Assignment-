const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is alive!' });
});

app.post('/api/upload', (req, res) => {
  console.log('Upload endpoint hit!');
  res.json({ 
    success: true, 
    message: 'Upload received (test)' 
  });
});

app.listen(PORT, () => {
  console.log(`BACKEND RUNNING on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});