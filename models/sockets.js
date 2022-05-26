const {
  userConnectd,
  userDisconnect,
  getUsers,
  saveMessage,
} = require("../controllers/socket");
const { verifyJWT } = require("../helpers/jwt");
class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      const [valid, uid] = verifyJWT(socket.handshake.query["x-token"]);

      // Validar jwt
      // Si el token no es valido, desconectar.
      if (!valid) {
        console.log("unidentified socket");
        return socket.disconnect();
      }

      // Saber que usuario esta activo mediante UID
      const user = await userConnectd(uid);

      console.log("user", user.name, "connected");

      // Unir al usuario a una sala de socket.io
      socket.join(uid);

      // Emitir todos los usuarios conectados.
      this.io.emit("users-list", await getUsers());

      // Escuchar cuando el cliente manda un mensaje
      // mesaje personal
      socket.on("personal-message", async (payload) => {
        const message = await saveMessage(payload);
        // Unirte a una sala especifica.
        this.io.to(payload.to).emit("personal-message", message);
        this.io.to(payload.from).emit("personal-message", message);
      });

      // Disconnect
      // Marcar en la base de datos que el usuario de desconecto.
      socket.on("disconnect", async () => {
        const user = await userDisconnect(uid);
        this.io.emit("users-list", await getUsers());
        console.log("user", user.name, "disconnected");
      });
    });
  }
}

module.exports = Sockets;
