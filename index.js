const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id);
  });

  socket.on('set_username', username => {
    socket.data.username = username;
    console.log(socket.data.username);
  });

  socket.on('set_alertid', alertId => {
    socket.data.alertId = alertId;
  });

  socket.on('message', ({ text, location, alertId }) => {
    const message = {
      text,
      authorId: socket.id,
      author: socket.data.username,
      location,
      alertId: socket.data.alertId,
      status: 'waiting'
    };
    io.emit('receive_message', message);
  });

  socket.on('response_message', ({ messageId }) => {
    io.emit('update_message', { messageId, status: 'Mantenha-se no local, os agentes estão indo' });
  });
});

server.listen(PORT, () => console.log('Server running...'));
