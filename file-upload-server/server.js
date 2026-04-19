const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// CORS middleware - Allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Root endpoint - This is important!
app.get('/', (req, res) => {
  res.json({ 
    message: 'File Upload Server is running!',
    status: 'OK',
    port: PORT
  });
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('📥 Upload request received');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const userName = req.body.userName || 'Anonymous';
    console.log(`✅ File uploaded: ${req.file.originalname} by ${userName}`);
    
    res.json({
      success: true,
      message: `File uploaded successfully for ${userName}`,
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
        url: `http://localhost:${PORT}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=========================================`);
  console.log(`✅ File Upload Server Running`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📍 http://127.0.0.1:${PORT}`);
  console.log(`📁 Uploads: ${uploadDir}`);
  console.log(`=========================================\n`);
});