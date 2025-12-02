// server.js
const { Server } = require("socket.io");
const Partida = require("./Backend/Partida");

const io = new Server(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const partidas = new Map();

io.on("connection", (socket) => {
  console.log("nuevo socket:", socket.id);

  socket.on("crear-partida", (datos, room, nickname) => {
    if (!room) {
      return socket.emit("alerta", "Error: Es necesario un codigo de partida");
    }

    if (partidas.has(room)) {
      return socket.emit("alerta", "Error: Codigo de partida ya esta en uso");
    }
    const nueva = new Partida(datos.tematica, datos.tipo, datos.valorPersonalizado, datos.cantidadMaximaJugadores, room);
    const jugador = nueva.agregarJugador(nickname, socket); // pasamos el socket
    partidas.set(room, nueva);
    socket.join(room);

    socket.emit("partida-creada", {
      room,
      codigo: nueva.codigo,
      partida: nueva.verResumen()
    });
  });

  socket.on("unirse-partida", (room, nickname) => {
    if (!room) {
      return socket.emit("alerta", "Error: Es necesario un codigo de partida");
    }
    const p = partidas.get(room);
    if (!p) {
      return socket.emit("alerta", "Error: Partida no encontrada");
    }
    const agregado = p.agregarJugador(nickname, socket);
    if (agregado === 0) {
      return socket.emit("alerta", "Error: Ya se alcanzo la cantidad maxima de jugadores");
    }
    socket.join(room);
    socket.emit("mensaje", "Te uniste a la partida");
    io.to(room).emit("actualizar-partida", p.verResumen());
  });

  socket.on("seleccionar-celda", (room, x, y) => {
    if (!room) {
      return socket.emit("alerta", "Error: Es necesario un codigo de partida");
    }
    const p = partidas.get(room);
    if (!p) {
      return socket.emit("alerta", "Error: Partida no encontrada");
    }

    const idJugador = p.verIdPorSocket(socket.id);
    if (!idJugador) {
      return socket.emit("alerta", "Error: Este jugador no esta en la partida");
    }
    p.seleccionarCelda(idJugador, x, y);
    io.to(room).emit("tablero-actualizado", p.verTablero());
  });

  socket.on("iniciar-partida", (room) => {
    const p = partidas.get(room);
    if (!p) return socket.emit("alerta", "Partida no encontrada");
    p.iniciar();
    io.to(room).emit("partida-iniciada", p.verResumen());
  });

  socket.on("disconnect", () => {
    console.log("desconectado:", socket.id);
    for (const [room, p] of partidas.entries()) {
      const id = p.verIdPorSocket(socket.id);
      if (id) {
        p.marcarDesconexionJugador(id);
        io.to(room).emit("actualizar-partida", p.verResumen());
        if (p.estado === "cancelada" || p.estado === "finalizada") {
          partidas.delete(room);
        }
        break;
      }
    }
  });
});
