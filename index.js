const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// 1. Configuración del puerto
app.set("port", process.env.PORT || 3001);

const server = http.createServer(app);
const io = socketIo(server);

const buildPath = path.join(__dirname, 'avatar-build');

// 2. Servir los archivos estáticos de React
app.use(express.static(buildPath));

// 3. Configuración de Socket.IO
io.on('connection', socket => {
  console.log('🔌 Cliente conectado:', socket.id);

  socket.on('mensaje', data => {
    console.log('←', data);
    socket.emit('respuesta', `Echo: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

app.get(/api\/pg/, (req, res) => {
 res.json({
   message: "Hello from the backend!"
 });
});

// 4. Fallback para rutas de React Router (BrowserRouter)
app.get(/(.*)/, (req, res) => {
 res.sendFile(path.join(buildPath, 'index.html'));
});

// 5. Arrancar servidor usando el puerto configurado
server.listen(app.get("port"), () => {
  console.log("Servidor creado en el puerto: " + app.get("port"));
});
