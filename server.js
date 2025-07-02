const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// File upload setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

io.on('connection', socket => {
  console.log('User connected');

  socket.on('chatMessage', msg => {
    io.emit('chatMessage', msg); // Broadcast to all users
  });

  socket.on('imageMessage', data => {
    io.emit('imageMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3300;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

