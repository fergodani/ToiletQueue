const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let queue = []; // Cola de personas

// Servir archivos estáticos
app.use(express.static('public'));

// Cuando un cliente se conecta
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Enviar la cola inicial al cliente
  socket.emit('updateQueue', queue);

  // Registrar un nuevo usuario en la cola
  socket.on('joinQueue', (name) => {
    if (!queue.includes(name)) {
      queue.push(name);
      io.emit('updateQueue', queue); // Actualizar la cola a todos los clientes
    }
  });

  // Eliminar un usuario de la cola
  socket.on('leaveQueue', (name) => {
    queue = queue.filter((user) => user !== name);
    io.emit('updateQueue', queue); // Actualizar la cola a todos los clientes
  });

  // Cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
