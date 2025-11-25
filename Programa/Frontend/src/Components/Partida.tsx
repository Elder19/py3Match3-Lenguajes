import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaClock, FaTrophy, FaUsers } from "react-icons/fa";

import Rojo from "../assets/rojo.png";
import Amarillo from "../assets/amarillo.png";
import Blue from "../assets/blue.png";
import Verde from "../assets/verde.png";
import Naranja from "../assets/naranja.png";
import Morado from "../assets/morado.png";

export default function Partida() {
  const { state } = useLocation();
  const { tipoJuego, tiempo, tematica, jugadores } = state || {};

  const [puntos, setPuntos] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState<number | null>(null);

  console.log("Datos de la partida:", state);

  const imageMap: Record<string, string> = {
    a: Amarillo,
    b: Blue,
    r: Rojo,
    v: Verde,
    n: Naranja,
    m: Morado,
  };

  const [tablero, setTablero] = useState([
    ["a","m","n","n","a","v","v"],
    ["r","r","n","b","b","v","v"],
    ["a","b","m","n","r","v","a"],
    ["m","n","a","b","v","r","m"],
    ["v","a","r","m","n","b","v"],
    ["n","v","b","a","m","r","n"],
    ["r","m","v","n","a","b","r"],
    ["b","n","a","v","r","m","b"],
    ["m","a","n","r","b","v","a"]
  ]);


  useEffect(() => {
    if (tipoJuego === "vsTiempo" && typeof tiempo === "number") {
      setSegundosRestantes(tiempo * 60);
    } else {
      setSegundosRestantes(null);
    }
  }, [tipoJuego, tiempo]);

  useEffect(() => {
    if (tipoJuego !== "vsTiempo") return;
    if (segundosRestantes === null) return;
    if (segundosRestantes <= 0) return; 

    const id = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [tipoJuego, segundosRestantes]);

  const formatearTiempo = (segundos: number | null) => {
    if (segundos === null) return "--:--";
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    const mm = mins.toString().padStart(2, "0");
    const ss = secs.toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="auth-container partida-container">
      <div className="tablero-wrapper">
        <div className="tablero-grid">
          {tablero.map((fila, i) =>
            fila.map((celda, j) => (
              <div key={`${i}-${j}`} className="celda">
                <img src={imageMap[celda]} className="candy-img" alt="candy" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="game-details-container">
        <div className="game-header">
          <h2>Juego en Curso</h2>
        </div>
        <div className="game-info">
          <div className="game-info-item">
            <div className="game-icon-wrapper game-icon-wrapper--time">
              <FaClock className="game-icon" />
            </div>
            <div className="game-text">
              <span className="game-label">Tiempo</span>
              <span className="game-value">
                {tipoJuego === "vsTiempo"
                  ? formatearTiempo(segundosRestantes)
                  : "∞"}
              </span>
            </div>
          </div>
          <div className="game-info-item">
            <div className="game-icon-wrapper game-icon-wrapper--score">
              <FaTrophy className="game-icon" />
            </div>
            <div className="game-text">
              <span className="game-label">Puntuación</span>
              <span className="game-value">{puntos}</span>
            </div>
          </div>
          <div className="game-info-item">
            <div className="game-icon-wrapper game-icon-wrapper--players">
              <FaUsers className="game-icon" />
            </div>
            <div className="game-text">
              <span className="game-label">Jugadores</span>
              <span className="game-value">{jugadores}</span>
            </div>
          </div>
        </div>

        <div className="game-meta">
          <p className="game-meta-row">
            <span className="game-meta-label">Tipo:</span>
            <span className="game-meta-value">{tipoJuego}</span>
          </p>
          <p className="game-meta-row">
            <span className="game-meta-label">Temática:</span>
            <span className="game-meta-value">{tematica}</span>
          </p>
        </div>

        <button className="crear-btn"> Validar </button>
      </div>
    </div>
  );
}
