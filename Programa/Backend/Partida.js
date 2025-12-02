// Backend/Partida.js
const Tablero = require("./Tablero");
const Jugador = require("./Jugador");
const config = require("./configPartida");
const { supabase } = require("../config/supabaseClient");

class Partida {
  constructor(tematica, tipo, valorPersonalizado = null, cantidadMaximaJugadores = 2, room) {
    this.codigo = this.generarCodigo();
    this.room = room;
    this.tematica = tematica;
    this.tipo = tipo; // "vs" | "vstiempo"
    this.jugadores = []; // array de Jugador
    this.tablero = new Tablero();
    this.timersJugador = {};
    this.timerVida = null;
    this.timerGlobal = null;
    this.estado = "esperando";
    this.cantidadMaximaJugadores = cantidadMaximaJugadores;
    this.matchActuales = 0;
    this.limiteMatch = 0;
    this.limiteTiempo = 0;

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
    if (this.timerVida) clearTimeout(this.timerVida);
    this.timerVida = setTimeout(() => {
      if (this.estado !== "jugando") {
        console.log(`Partida ${this.codigo} eliminada por inactividad.`);
        this.estado = "cancelada";
      }
    }, 3 * 60 * 1000);
  }

  configurarModo(tipo, valorPersonalizado) {
    if (tipo === "vs") {
      this.limiteMatch = valorPersonalizado || config.defaultMatchLimit;
      console.log(`Modo VS: límite de ${this.limiteMatch} match`);
    } else if (tipo === "vstiempo") {
      this.limiteTiempo = valorPersonalizado || config.defaultTiempoMin;
      console.log(`Modo VS Tiempo: duración ${this.limiteTiempo} minutos`);
    }
  }

  // nickname: string, socket: Socket object
  agregarJugador(nickname, socket) {
    if (this.jugadores.length >= this.cantidadMaximaJugadores) {
      return 0;
    }

    const id = Math.random().toString(36).slice(2);
    // Guardamos socketId (string) en jugador
    const j = new Jugador(id, nickname, socket.id);
    this.jugadores.push(j);
    this.timersJugador[id] = null;

    // Reiniciar timer de vida porque hubo actividad
    this.iniciarTimerDeVida();

    return j;
  }

  iniciar() {
    this.estado = "jugando";
    if (this.timerVida) {
      clearTimeout(this.timerVida);
      this.timerVida = null;
    }

    if (this.tipo === "vstiempo") {
      this.iniciarCuentaRegresiva();
    }
  }

  iniciarCuentaRegresiva() {
    const duracion = this.limiteTiempo * 60 * 1000;
    console.log(`Partida ${this.codigo} durará ${this.limiteTiempo} min`);

    if (this.timerGlobal) clearTimeout(this.timerGlobal);
    this.timerGlobal = setTimeout(() => {
      console.log("Tiempo agotado.");
      this.finalizarPartida("tiempo");
    }, duracion);
  }

  seleccionarCelda(jugadorId, x, y) {
    if (this.estado !== "jugando") return;

    const jugador = this.jugadores.find((j) => j.id === jugadorId);
    if (!jugador) return;

    const result = this.tablero.toggleCelda(x, y, jugadorId);
    if (!result.ok) {
      console.log(`${result.msg}`);
      return;
    }

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
    const max = Math.max(...this.jugadores.map((j) => j.puntaje));
    const ganadores = this.jugadores.filter((j) => j.puntaje === max);
    return ganadores;
  }

  async finalizarPartida(razon) {
    if (this.estado === "finalizada") return;

    this.estado = "finalizada";
    if (this.timerGlobal) {
      clearTimeout(this.timerGlobal);
      this.timerGlobal = null;
    }

    const ganadores = this.determinarGanador();

    console.log(`Partida ${this.codigo} finalizada (${razon})`);
    console.log("Ganador(es):", ganadores ? ganadores.map((g) => g.nickname).join(", ") : "N/A");

    // Guardar datos
    await this.insertarDatosBD();
  }

  async insertarDatosBD() {
    try {
      const { data: partidaData, error: partidaError } = await supabase
        .from("partidas")
        .insert([{
          codigo: this.codigo,
          tematica: this.tematica,
          tipo_juego: this.tipo,
          max_jugadores: this.jugadores.length,
          estado: this.estado,
          fecha_creacion: new Date()
        }])
        .select();

      if (partidaError) throw new Error(partidaError.message || "Error al insertar partida");
      if (!partidaData || partidaData.length === 0) throw new Error("No se obtuvo id de la partida");

      const partidaId = partidaData[0].id;

      for (const jugador of this.jugadores) {
        const { error: jugadorError } = await supabase
          .from("jugadores")
          .insert([{
            nickname: jugador.nickname,
            puntaje: jugador.puntaje,
            estado: "finalizado",
            partida_id: partidaId
          }]);
        if (jugadorError) console.error("Error al insertar jugador:", jugadorError);
      }

      const rankingData = this.jugadores.map((jugador) => ({
        partida_id: partidaId,
        nickname: jugador.nickname,
        puntaje: jugador.puntaje,
        tematica: this.tematica,
        tiempo_invertido: this.limiteTiempo,
        fecha: new Date(),
      }));

      const { error: rankingError } = await supabase
        .from("ranking_global")
        .insert(rankingData);

      if (rankingError) throw new Error(rankingError.message || "Error al insertar en ranking global");

      console.log("Datos de la partida insertados exitosamente.");
    } catch (error) {
      console.error("Error al insertar datos en la base de datos:", error.message || error);
    }
  }
  verIdPorSocket(socketId) {
    for (const j of this.jugadores) {
      if (j.socketId === socketId) return j.id;
    }
    return null;
  }

  verTablero() {
    if (typeof this.tablero.toJSON === "function") return this.tablero.toJSON();
    return this.tablero;
  }

  verResumen() {
    return {
      codigo: this.codigo,
      room: this.room,
      tematica: this.tematica,
      tipo: this.tipo,
      estado: this.estado,
      jugadores: this.jugadores.map(j => ({ id: j.id, nickname: j.nickname, puntaje: j.puntaje, socketId: j.socketId })),
      tablero: this.verTablero(),
      matchActuales: this.matchActuales,
      limiteMatch: this.limiteMatch,
      limiteTiempo: this.limiteTiempo
    };
  }

  marcarDesconexionJugador(jugadorId) {
    const j = this.jugadores.find(x => x.id === jugadorId);
    if (!j) return;
    j.estado = "desconectado";
  }
}

module.exports = Partida;
