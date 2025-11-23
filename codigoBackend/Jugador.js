class Jugador {
  constructor(nickname) {
    this.nickname = nickname;
    this.puntaje = 0;
    this.celdasSeleccionadas = [];
    this.estado=false;
  }

  seleccionarCelda(celda) {
    this.celdasSeleccionadas.push(celda);
    celda.seleccionar();
  }

  limpiarSeleccion() {
    this.celdasSeleccionadas.forEach(c => c.deseleccionar());
    this.celdasSeleccionadas = [];
  }

  sumarPuntos(matchCount) {
    this.puntaje += Math.pow(matchCount, 2);
  }

  cambiarestado(){
    if (this.estado==false){
        this.estado=true;
    }
    else {
        this.estado = false;
    }
  }

 esActivo() {
  return this.estado;
}
}

module.exports = Jugador;
