import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// basic server + static
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// users: Map<socketId, { name, color }>
const users = new Map();

// helper for color
function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue} 70% 45%)`;
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('new-user', (userName) => {
    const color = randomColor();
    users.set(socket.id, { name: userName, color });

    // broadcast updated user list (array of {name,color})
    io.emit('user-list', Array.from(users.values()));

    // system message: joined
    io.emit('user-connected', userName);
  });

  socket.on('send-chat-message', (message) => {
    const u = users.get(socket.id);
    const payload = {
      name: u ? u.name : 'Unknown',
      message,
      color: u ? u.color : '#666',
      timestamp: Date.now()
    };
    io.emit('chat-message', payload);
  });

  socket.on('typing', () => {
    const u = users.get(socket.id);
    if (u) io.emit('user-typing', u.name);
  });

  socket.on('stop-typing', () => {
    const u = users.get(socket.id);
    if (u) io.emit('user-stop-typing', u.name);
  });

  socket.on('disconnect', () => {
    const u = users.get(socket.id);
    if (u) {
      users.delete(socket.id);
      io.emit('user-list', Array.from(users.values()));
      io.emit('user-disconnected', u.name);
      console.log(`${u.name} disconnected`);
    } else {
      console.log('A user disconnected (no record):', socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
