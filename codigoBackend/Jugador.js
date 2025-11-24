class Jugador {
  constructor(id, nickname) {
    this.id = id;
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
