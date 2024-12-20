const socket = io();

// Recuperar nombre del usuario desde localStorage o pedirlo
let name = localStorage.getItem('name');
if (!name) {
  name = prompt('Introduce tu nombre:');
  localStorage.setItem('name', name);
}

// Unirse a la cola automáticamente al cargar la página
socket.emit('joinQueue', name);

// Actualizar la cola en la interfaz
socket.on('updateQueue', (queue) => {
  const queueDiv = document.getElementById('queue');
  queueDiv.innerHTML = '<h3>Cola actual:</h3>';
  queue.forEach((user, index) => {
    const userDiv = document.createElement('div');
    userDiv.textContent = `${index + 1}. ${user}`;
    queueDiv.appendChild(userDiv);
  });
});

// Botón para unirse a la cola
document.getElementById('join').addEventListener('click', () => {
  socket.emit('joinQueue', name);
});

// Botón para salir de la cola
document.getElementById('leave').addEventListener('click', () => {
  socket.emit('leaveQueue', name);
});
