const Celda = require('./celda');

class Tablero {
  constructor(filas = 9, columnas = 7, colores = ['azul', 'naranja', 'rojo', 'verde', 'amarillo', 'morado']) {
    this.filas = filas;
    this.columnas = columnas;
    this.colores = colores;
    this.matriz = [];
    this.generarTableroInicial();
  }

  // Crea la estructura de la matriz vacía y la llena
  generarTableroInicial() {
    this.matriz = Array.from({ length: this.filas }, (_, x) =>
      Array.from({ length: this.columnas }, (_, y) =>
        new Celda(x, y, this.colores[Math.floor(Math.random() * this.colores.length)])
      )
    );
  }

  // Vuelve a llenar todas las celdas con colores aleatorios
  llenarConColoresAleatorios() {
    for (let fila of this.matriz) {
      for (let celda of fila) {
        const nuevoColor = this.colores[Math.floor(Math.random() * this.colores.length)];
        celda.cambiarColor(nuevoColor);
      }
    }
  }

  // Obtiene una celda según coordenadas
  obtenerCelda(x, y) {
    if (x >= 0 && x < this.filas && y >= 0 && y < this.columnas) {
      return this.matriz[x][y];
    }
    return null;
  }

  // Cambia el color de una celda
  cambiarColorCelda(x, y, color) {
    const celda = this.obtenerCelda(x, y);
    if (celda) celda.cambiarColor(color);
  }

  // Marca una celda con un estado específico
  marcarCeldaComoLibre(x, y) {
    const celda = this.obtenerCelda(x, y);
    if (celda) celda.establecerEstado('libre');
  }

  marcarCeldaComoSeleccionada(x, y) {
    const celda = this.obtenerCelda(x, y);
    if (celda) celda.establecerEstado('seleccionadaPropia');
  }

  marcarCeldaComoBloqueada(x, y) {
    const celda = this.obtenerCelda(x, y);
    if (celda) celda.establecerEstado('bloqueada');
  }

  // Detecta celdas adyacentes del mismo color (para formar un "match")
  detectarAdyacentes(x, y, visitadas = new Set()) {
    const celda = this.obtenerCelda(x, y);
    if (!celda) return [];

    const clave = `${x},${y}`;
    if (visitadas.has(clave)) return [];
    visitadas.add(clave);

    const adyacentes = [celda];

    const direcciones = [
      [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    for (let [dx, dy] of direcciones) {
      const vecino = this.obtenerCelda(x + dx, y + dy);
      if (vecino && vecino.color === celda.color) {
        adyacentes.push(...this.detectarAdyacentes(x + dx, y + dy, visitadas));
      }
    }

    return adyacentes;
  }

  // Llena las celdas "vacías" (color = null) con nuevos colores
  rellenarCeldasVacias() {
    for (let fila of this.matriz) {
      for (let celda of fila) {
        if (!celda.color) {
          const nuevoColor = this.colores[Math.floor(Math.random() * this.colores.length)];
          celda.cambiarColor(nuevoColor);
        }
      }
    }
  }

  // Después de eliminar una combinación, actualiza el tablero
  actualizarMatriz(postCombinacion) {
    for (let { x, y } of postCombinacion) {
      const celda = this.obtenerCelda(x, y);
      if (celda) {
        celda.cambiarColor(null); // queda vacía
      }
    }
    this.rellenarCeldasVacias();
  }

  // Muestra el tablero en consola (opcional, para depuración)
  mostrarTablero() {
    console.log(this.matriz.map(
      fila => fila.map(c => c.color ? c.color[0].toUpperCase() : '_').join(' ')
    ).join('\n'));
  }
}

module.exports = Tablero;
