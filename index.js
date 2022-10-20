// [SERVIDOR WEB]
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// [ADICIONANDO SUPORTE A SOCKETS]
const { Server } = require("socket.io");
const io = new Server(server);

// [ROTAS]
app.use("/public", express.static("public", {}));

// -> HOME
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// [SETUP DA PARTE DE SOCKETS]
let users = {};

io.on("connection", (socket) => {
  // JOGO
  console.log(`[${socket.id}] LOG: USER_CONNECTED`);
  users[socket.id] = { id: socket.id, x: 0, y: 0 };

  socket.on("disconnect", () => {
    console.log(`[${socket.id}] LOG: USER_DISCONNECTED`);
    users[socket.id] = undefined;
  });

  socket.on("ON_USER_MOVE", (newPosition) => {
    const user = users[socket.id];
    user.x = user.x + (newPosition.move.x || 0);
    user.y = user.y + (newPosition.move.y || 0);
    io.emit("ON_USERS_UPDATE", JSON.stringify(users));
  });

  // CHAT
  socket.on('chat message', (msg) => {
    console.log(`[${socket.id}] MSG: ${msg}`);
  });

  socket.on('chat message', (msg) => {
    console.log(`[${socket.id}] MSG: ${msg}`,io.emit('chat message', msg));
    
  });
});

// START DO SERV
server.listen(3000, () => {
  console.log("listening on *:3000");
});
