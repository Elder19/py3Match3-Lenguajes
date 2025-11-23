// Clase Celda - representa una casilla en el tablero
class Celda {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.estado = 'libre'; // libre | seleccionadaPropia | seleccionadaOtro | bloqueada
  }

  cambiarColor(nuevoColor) {
    this.color = nuevoColor;
  }

  establecerEstado(nuevoEstado) {
    this.estado = nuevoEstado;
  }

  esAdyacenteA(otraCelda) {
    const dx = Math.abs(this.x - otraCelda.x);
    const dy = Math.abs(this.y - otraCelda.y);
    // adyacente si está en alguna de las 8 direcciones vecinas
    return (dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0));
  }
 /*en teoria lo usa el websockjet */
  generarSnapshotCelda() {
    return {
      x: this.x,
      y: this.y,
      color: this.color,
      estado: this.estado
    };
  }
}

module.exports = Celda;
