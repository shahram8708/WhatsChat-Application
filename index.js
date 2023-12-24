const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

let users = {};

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, name) => {
    socket.join(roomId);
    users[socket.id] = { roomId, name };
    socket.to(roomId).emit('user-joined', name);
    socket.emit('welcome', `Welcome, ${name}!`);
  });

  socket.on('send', (data) => {
    const { message, roomId } = data;
    const user = users[socket.id];
    if (user && user.roomId === roomId) {
      socket.broadcast.to(roomId).emit('receive', { message: message, name: user.name });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.roomId).emit('left', user.name);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
