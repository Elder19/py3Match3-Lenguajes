const Tablero = require('./tablero');
const Jugador = require('./jugador');

class Partida {
  constructor(tematica, tipoJuego, duracion = null, cantidadJugadores = 2) {
    this.tematica = tematica;
    this.tipoJuego = tipoJuego; // 'vs' o 'vsTiempo'
    this.duracion = duracion;
    this.cantidadJugadores = cantidadJugadores;
    this.jugadores = [];
    this.tablero = new Tablero();    this.estado = 'esperando'; // 'esperando', 'jugando', 'finalizada'
    this.id = this.generarId();
  }

  generarId() {
    return Math.random().toString(36).substring(2, 10);
  }

  agregarJugador(nickname) {


  if (this.jugadores.length >= this.cantidadJugadores) {
    console.log("Error: La partida ya alcanzó el máximo de jugadores.");
    return false;
  }

  // 2. VALIDAR SI EL JUGADOR YA EXISTE EN ESTA PARTIDA
  const jugadorExistente = this.jugadores.find(j => j.nickname === nickname);

  if (jugadorExistente) {
    if (jugadorExistente.estado === true) {
      console.log(` Error: El jugador '${nickname}' ya está activo en una partida.`);
      return false;
    } else {
      console.log(`   
        Advertencia: El jugador '${nickname}' Jugador ingresado en partida y activo.`);
      jugadorExistente.estado = true;
      return true;
    }
  }
  const jugador = new Jugador(nickname);
  jugador.estado = true; 
  this.jugadores.push(jugador);

  console.log(`✔️ Jugador '${nickname}' agregado exitosamente.`);
  return true;
}


  iniciar() {
    if (this.jugadores.length === this.cantidadJugadores) {
      this.estado = 'jugando';
      console.log(`Partida ${this.id} iniciada con temática: ${this.tematica}`);
    } else {
      console.log('No hay suficientes jugadores para iniciar.');
    }
  }

  terminar() {
    this.estado = 'finalizada';
    for (let i = 0; i < this.jugadores.length; i++) {
  this.jugadores[i].cambiarestado();
}

    this.mostrarResultados();
  }

  mostrarResultados() {
    console.log('Resultados de la partida:');
    this.jugadores
      .sort((a, b) => b.puntaje - a.puntaje)
      .forEach((j, i) => {
        console.log(`${i + 1}. ${j.nickname}: ${j.puntaje} puntos`);
      });
  }
}

module.exports = Partida;
