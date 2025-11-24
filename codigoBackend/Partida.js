const Tablero = require('./Tablero');
const Jugador = require('./Jugador');
const config = require('./configPartida');

class Partida {
  constructor(tematica, tipo , valorPersonalizado = null) {
    this.codigo = this.generarCodigo();
    this.tematica = tematica;
    this.tipo = tipo; // "vs" o "vstiempo"
    this.jugadores = [];
    this.tablero = new Tablero();
    this.timersJugador = {};
    this.timerVida = null;
    this.timerGlobal = null;
    this.estado = "esperando";

    this.matchActuales = 0;
    this.limiteMatch = 0;
    this.limiteTiempo = 0;

    // Configurar el modo de juego (cantidad de match o tiempo)
    this.configurarModo(tipo, valorPersonalizado);

    this.iniciarTimerDeVida();
  }

  generarCodigo() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      letras.charAt(Math.floor(Math.random() * letras.length))
    ).join("");
  }

  iniciarTimerDeVida() {
    this.timerVida = setTimeout(() => {
      if (this.estado !== "jugando") {
        console.log(` Partida ${this.codigo} eliminada por inactividad.`);
        this.estado = "cancelada";
      }
    }, 3 * 60 * 1000);
  }

  configurarModo(tipo, valorPersonalizado) {
    if (tipo === "vs") {
      this.limiteMatch = valorPersonalizado || config.defaultMatchLimit;
      console.log(` Modo VS: límite de ${this.limiteMatch} match`);
    } else if (tipo === "vstiempo") {
      this.limiteTiempo = valorPersonalizado || config.defaultTiempoMin;
      console.log(`Modo VS Tiempo: duración ${this.limiteTiempo} minutos`);
    }
  }

  agregarJugador(nickname) {
    const id = Math.random().toString(36).slice(2);
    const j = new Jugador(id, nickname);
    this.jugadores.push(j);
    this.timersJugador[id] = null;
    return j;
  }

  iniciar() {
    this.estado = "jugando";
    if (this.timerVida) clearTimeout(this.timerVida);

    if (this.tipo === "vstiempo") {
      this.iniciarCuentaRegresiva();
    }
  }

  iniciarCuentaRegresiva() {
    const duracion = this.limiteTiempo * 60 * 1000;
    console.log(`Partida ${this.codigo} durará ${this.limiteTiempo} min`);

    this.timerGlobal = setTimeout(() => {
      console.log("Tiempo agotado.");
      this.finalizarPartida("tiempo");
    }, duracion);
  }

  seleccionarCelda(jugadorId, x, y) {
    if (this.estado !== "jugando") return;

    const jugador = this.jugadores.find(j => j.id === jugadorId);
    if (!jugador) return;

    const result = this.tablero.toggleCelda(x, y, jugadorId);
    if (!result.ok) {
      console.log(` ${result.msg}`);
      return;
    }

    const celda = result.celda;

    if (result.accion === "seleccionada") {
      console.log(`✔ ${jugador.nickname} seleccionó (${x}, ${y})`);
      if (this.timersJugador[jugadorId]) clearTimeout(this.timersJugador[jugadorId]);

      this.timersJugador[jugadorId] = setTimeout(() => {
        this.activarSeleccion(jugador);
      }, 2000);
    }

    if (result.accion === "deseleccionada") {
      const tiene = this.tablero.obtenerCeldasDeJugador(jugadorId).length > 0;
      if (!tiene && this.timersJugador[jugadorId]) {
        clearTimeout(this.timersJugador[jugadorId]);
        this.timersJugador[jugadorId] = null;
      }
    }
  }

  activarSeleccion(jugador) {
    const celdas = this.tablero.obtenerCeldasDeJugador(jugador.id);
    if (celdas.length === 0) return;

    const base = celdas[0];
    const grupo = this.tablero.detectarAdyacentes(base.x, base.y);

    if (grupo.length >= 3) {
      jugador.sumarPuntos(grupo.length);
      this.tablero.eliminarGrupo(grupo);
      this.tablero.rellenarVacias();
      this.matchActuales++;

      console.log(`MATCH ${this.matchActuales} (${jugador.nickname})`);
      this.verificarFinDePartida();
    } else {
      console.log(`No hubo match para ${jugador.nickname}`);
    }

    this.tablero.liberarCeldasDeJugador(jugador.id);
  }

  verificarFinDePartida() {
    if (this.tipo === "vs" && this.matchActuales >= this.limiteMatch) {
      this.finalizarPartida("match");
    }
  }

  determinarGanador() {
    if (this.jugadores.length === 0) return null;
    const max = Math.max(...this.jugadores.map(j => j.puntaje));
    const ganadores = this.jugadores.filter(j => j.puntaje === max);
    return ganadores;
  }

  finalizarPartida(razon) {
    if (this.estado === "finalizada") return;

    this.estado = "finalizada";
    if (this.timerGlobal) clearTimeout(this.timerGlobal);

    const ganadores = this.determinarGanador();

    console.log(`Partida ${this.codigo} finalizada (${razon})`);
    console.log("Ganador(es):", ganadores.map(g => g.nickname).join(", "));
  }
}

module.exports = Partida;
