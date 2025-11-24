class Celda {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.estado = 'libre'; // libre | seleccionada | bloqueada
    this.seleccionadaPor = null; // jugadorId
  }

  cambiarColor(nuevoColor) {
    this.color = nuevoColor;
  }

  seleccionar(jugadorId) {
    this.estado = 'seleccionada';
    this.seleccionadaPor = jugadorId;
  }

  liberar() {
    this.estado = 'libre';
    this.seleccionadaPor = null;
  }

  generarSnapshot() {
    return {
      x: this.x,
      y: this.y,
      color: this.color,
      estado: this.estado,
      seleccionadaPor: this.seleccionadaPor
    };
  }
}

module.exports = Celda;
