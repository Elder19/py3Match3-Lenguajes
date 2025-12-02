class Jugador {
  constructor(id, nickname, socketId) {
    this.id = id;
    this.socketId = socketId; // ID del cliente en Socket.IO
    this.nickname = nickname;
    this.puntaje = 0;
    this.ultimaAccion = null;
  }

  sumarPuntos(n) {
    this.puntaje += n * n;
  }

  actualizarTiempo() {
    this.ultimaAccion = Date.now();
  }
}

module.exports = Jugador;
