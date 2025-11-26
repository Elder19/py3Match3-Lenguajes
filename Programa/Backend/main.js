const Partida = require('./Partida');
const Jugador = require('./Jugador');
const config = require('./configPartida');

// Función para simular la partida
async function main() {
  // Crear una nueva partida
  const partida = new Partida("Dulce", "vs", 2); // "vs" con límite de 2 matches
  console.log(`Partida creada con código: ${partida.codigo}`);
  // Agregar jugadores a la partida 
  const jugador1 = partida.agregarJugador("Jugador1");
  const jugador2 = partida.agregarJugador("Jugador2");
  console.log(`Jugadores añadidos: ${jugador1.nickname}, ${jugador2.nickname}`);

  // Iniciar la partida
  partida.iniciar();

  // Simular selección de celdas por los jugadores
  partida.seleccionarCelda(jugador1.id, 0, 0);  // Jugador1 selecciona la celda (0, 0)
  partida.seleccionarCelda(jugador2.id, 1, 0);  // Jugador2 selecciona la celda (1, 0)
  
  // Simular que han pasado 2 segundos, por lo que se activa la selección y se suman los puntos
  setTimeout(() => {
    partida.activarSeleccion(jugador1); // Jugador1 intenta hacer match
    partida.activarSeleccion(jugador2); // Jugador2 intenta hacer match
  }, 2000);  // Tiempo de espera antes de que la selección se active

  // Simular un segundo match (después de 5 segundos)
  setTimeout(() => {
    partida.seleccionarCelda(jugador1.id, 2, 0);  // Jugador1 selecciona otra celda (2, 0)
    partida.seleccionarCelda(jugador2.id, 3, 0);  // Jugador2 selecciona otra celda (3, 0)
    
    setTimeout(() => {
      partida.activarSeleccion(jugador1); // Jugador1 intenta hacer el segundo match
      partida.activarSeleccion(jugador2); // Jugador2 intenta hacer el segundo match
    }, 2000);  // Después de 2 segundos, activamos la selección del segundo match
  }, 5000); // Después de 5 segundos, comenzamos el segundo match

  // Esperar a que el número de matches alcance el límite y finalizar la partida
  setTimeout(() => {
    partida.finalizarPartida("match");
  }, 8000);  // Finaliza después de 8 segundos
}

// Ejecutar la simulación
main().catch(err => console.error("Error durante la partida:", err));
