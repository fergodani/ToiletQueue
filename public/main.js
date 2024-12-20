const socket = io();
if (!("Notification" in window)) {
  alert("Tu navegador no soporta notificaciones");
}
if (Notification.permission !== "granted") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Permisos de notificación concedidos");
    } else {
      console.log("No se concedieron permisos de notificación");
    }
  });
}

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

  if (queue[0] === name) {
    showNotification("¡Es tu turno!", "Prepárate, ya puedes ir al baño.");
  }
});

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: "./media/logo.png", // Puedes cambiar la URL del icono
    });

    // Opcional: Redirige al usuario al sitio si hace clic en la notificación
    notification.onclick = () => {
      window.focus();
    };
  }
}

// Botón para unirse a la cola
document.getElementById('join').addEventListener('click', () => {
  socket.emit('joinQueue', name);
});

// Botón para salir de la cola
document.getElementById('leave').addEventListener('click', () => {
  socket.emit('leaveQueue', name);
});

document.getElementById('change').addEventListener('click', () => {

  newName = prompt('Introduce tu nombre:');
  if (name !== newName && newName != null) {
    socket.emit('leaveQueue', name);
    name = newName;
    localStorage.setItem('name', newName);
  }
  
});

