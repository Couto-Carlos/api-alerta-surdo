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
//
io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id);
  });

  socket.on('set_alertid', alertId => {
    socket.data.alertId = alertId;
  });

  socket.on('message', ({ text, location, alertId }) => {
    const message = {
      text,
      authorId: socket.id,
      location,
      alertId: socket.data.alertId,
    };
    io.emit('receive_message', message);
  });

  socket.on('alert_response', ({ confirmation , authorId}) => {
    const response = {
      confirmation,
      authorId
    };
    io.emit('receive_response', response);
  });

});

server.listen(PORT, () => console.log('Server running...'));
