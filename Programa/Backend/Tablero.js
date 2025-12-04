const Celda = require('./Celda');

class Tablero {
  constructor(
    filas = 9,
    columnas = 7,
    colores = ['azul', 'naranja', 'rojo', 'verde', 'amarillo', 'morado']
  ) {
    this.filas = filas;
    this.columnas = columnas;
    this.colores = colores;
    this.matriz = [];
    
    this.generarTablero();
    this.rehacerHastaTenerCombinaciones();
  }
    
  tieneCombinaciones() {
    const visitadas = new Set();
  
    for (let x = 0; x < this.filas; x++) {
      for (let y = 0; y < this.columnas; y++) {
        const key = `${x},${y}`;
        if (visitadas.has(key)) continue;
  
        const grupo = this.detectarAdyacentes(x, y, visitadas);
        if (grupo.length >= 3) {
          return true; 
        }
      }
    }
  
    return false;
  }
  
  rehacerHastaTenerCombinaciones(maxIntentos = 100) {
    let intentos = 0;
  
  
    while (!this.tieneCombinaciones() && intentos < maxIntentos) {
      this.generarTablero();  
      intentos++;
    }
  
    if (!this.tieneCombinaciones()) {
      console.warn("No se pudo garantizar una combinación después de muchos intentos");
    } else {
      console.log(`Tablero regenerado con combinaciones en ${intentos} intento(s).`);
    }
  }
  generarTablero() {
    this.matriz = Array.from({ length: this.filas }, (_, x) =>
      Array.from({ length: this.columnas }, (_, y) =>
        new Celda(x, y, this.colorRandom())
      )
    );
  }

  obtenerCeldasDeJugador(jugadorId) {
      const resultado = [];

      for (const fila of this.matriz) {
        for (const celda of fila) {
        if (celda.seleccionadaPor === jugadorId) {
            resultado.push(celda);
          }
        }
      }

      return resultado;
    } 

  colorRandom() {
    return this.colores[Math.floor(Math.random() * this.colores.length)];
  }

  obtenerCelda(x, y) {
    if (x < 0 || x >= this.filas || y < 0 || y >= this.columnas) return null;
    return this.matriz[x][y];
  }

  //  (Seleccionar / Deseleccionar)
  toggleCelda(x, y, jugadorId) {
    const celda = this.obtenerCelda(x, y);
    if (!celda) return { ok: false, msg: "Celda inexistente" };

    if (celda.estado === "bloqueada") {
        return { ok: false, msg: "Celda bloqueada" };
    }


    if (celda.estado === "libre") {
        celda.estado = "seleccionada";
        celda.seleccionadaPor = jugadorId;

        return { ok: true, accion: "seleccionada", celda };
    }

  
    if (celda.estado === "seleccionada") {

      
        if (celda.seleccionadaPor !== jugadorId) {
            return { ok: false, msg: "Celda seleccionada por otro jugador" };
        }

        celda.estado = "libre";
        celda.seleccionadaPor = null;

        return { ok: true, accion: "deseleccionada", celda };
    }

    return { ok: false, msg: "Estado desconocido" };
  }

  // Saber si el jugador dejó alguna celda seleccionada
  existeSeleccionDeJugador(jugadorId) {
    for (const fila of this.matriz) {
      for (const celda of fila) {
        if (celda.seleccionadaPor === jugadorId) return true;
      }
    }
    return false;
  }

  liberarCeldasDeJugador(jugadorId) {
    for (const fila of this.matriz) {
      for (const celda of fila) {
        if (celda.seleccionadaPor === jugadorId) {
          celda.estado = "libre";
          celda.seleccionadaPor = null;
        }
      }
    }
  }

  // Detección de adyacentes (8 direcciones)
  detectarAdyacentes(x, y, visitadas = new Set()) {
    const celda = this.obtenerCelda(x, y);
    if (!celda) return [];

    const key = `${x},${y}`;
    if (visitadas.has(key)) return [];
    visitadas.add(key);

    const grupo = [celda];

    const dirs = [
      [1, 0], [-1, 0],
      [0, 1], [0, -1],
      [1, 1], [-1, -1],
      [1, -1], [-1, 1]
    ];

    for (const [dx, dy] of dirs) {
      const vecino = this.obtenerCelda(x + dx, y + dy);
      if (vecino && vecino.color === celda.color) {
        grupo.push(...this.detectarAdyacentes(x + dx, y + dy, visitadas));
      }
    }

    return grupo;
  }

  eliminarGrupo(grupo) {
    grupo.forEach(c => c.cambiarColor(null));
  }

  rellenarVacias() {
    for (const fila of this.matriz) {
      for (const celda of fila) {
        if (!celda.color) {
          celda.cambiarColor(this.colorRandom());
        }
      }
    }
  }

  snapshot() {
    return this.matriz.map(fila =>
      fila.map(c => c.generarSnapshot())
    );
  }
listarMatriz() {
  const lista = [];
  for (let x = 0; x < this.filas; x++) {
    for (let y = 0; y < this.columnas; y++) {
      const celda = this.matriz[x][y];
      const letra = celda.color ? celda.color[0].toLowerCase() : "_";
      lista.push(letra);
    }
  }
  return lista;
}



}

module.exports = Tablero;
