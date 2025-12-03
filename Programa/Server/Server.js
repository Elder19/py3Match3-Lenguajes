// server.js
const { Server } = require("socket.io");
const Partida = require("../Backend/Partida");

const io = new Server(4040, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log("Servidor Socket.IO escuchando en el puerto 3000...");

const partidas = new Map();

io.on("connection", (socket) => {
  console.log("Nuevo socket:", socket.id);

  // ---------- CREAR PARTIDA ----------
  socket.on("crear-partida", (datos, nickname) => {
    let room;
    let flag = 0;

    while (flag === 0) {
      room = generarCodigo();
      if (!partidas.has(room)) {
        flag = 1;
      }
    }

    const nueva = new Partida(
      datos.tematica,
      datos.tipoJuego,
      datos.Jugadores,
      room,
      datos.valorPersonalizado
    );

    nueva.agregarJugador(nickname, socket);
    partidas.set(room, nueva);

    socket.join(room);

    socket.emit("partida-creada", { room });
    console.log(`Partida creada: ${room} por ${nickname}`);
  });

  // ---------- UNIRSE PARTIDA ----------
  socket.on("unirse-partida", (room, nickname) => {
    if (!room) {
      return socket.emit("alerta", "Error: Es necesario un código de partida");
    }

    const p = partidas.get(room);
    if (!p) {
      return socket.emit("alerta", "Error: Partida no encontrada");
    }

    const agregado = p.agregarJugador(nickname, socket);
    if (agregado === 0) {
      return socket.emit("alerta", "Error: Ya se alcanzó la cantidad máxima de jugadores");
    }

    socket.join(room);
    socket.emit("mensaje", "Te uniste a la partida");
    io.to(room).emit("actualizar-partida", p.verResumen());

    console.log(`${nickname} se unió a la partida ${room}`);
  });

  // ---------- SELECCIONAR CELDA ----------
  socket.on("seleccionar-celda", (room, x, y) => {
    if (!room) return socket.emit("alerta", "Código de partida requerido");

    const p = partidas.get(room);
    if (!p) return socket.emit("alerta", "Partida no encontrada");

    const idJugador = p.verIdPorSocket(socket.id);
    if (!idJugador) {
      return socket.emit("alerta", "Este jugador no está en la partida");
    }

    p.seleccionarCelda(idJugador, x, y);
    io.to(room).emit("tablero-actualizado", p.tablero.ObtenerCelda(x, y));
  });

  // ---------- VALIDAR ----------
  socket.on("validar", (room) => {
    const p = partidas.get(room);
    if (!p) return;
    io.to(room).emit("tablero-actualizado", p.verTablero());
  });

  // ---------- INICIAR ----------
  socket.on("iniciar-partida", (room) => {
    const p = partidas.get(room);
    if (!p) return socket.emit("alerta", "Partida no encontrada");

    p.iniciar();
    io.to(room).emit("partida-iniciada", p.verResumen());

    console.log(`Partida iniciada: ${room}`);
  });

  // ---------- DESCONECTAR ----------
  socket.on("disconnect", () => {
    console.log("Desconectado:", socket.id);

    for (const [room, p] of partidas.entries()) {
      const id = p.verIdPorSocket(socket.id);

      if (id) {
        p.marcarDesconexionJugador(id);
        io.to(room).emit("actualizar-partida", p.verResumen());

        if (p.estado === "cancelada" || p.estado === "finalizada") {
          partidas.delete(room);
          console.log(`Partida eliminada: ${room}`);
        }
        break;
      }
    }
  });
});

// ---------- GENERAR CÓDIGO ----------
function generarCodigo() {
  let codigo = "";
  let longitud = 6;
  for (let i = 0; i < longitud; i++) {
    codigo += Math.floor(Math.random() * 10);
  }
  return codigo;
}

console.log("Servidor inicializado. Listo para recibir conexiones.");
