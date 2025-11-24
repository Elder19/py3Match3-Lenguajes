import { useState } from "react";

export default function Ranking() {
  const [lista] = useState([
    { nombreGanador: "Ana", puntaje: 2040, tematica: "Dulces", tiempo: "05:13", idPartida: "PART-004" },
    { nombreGanador: "Mariana", puntaje: 1780, tematica: "Dulces", tiempo: "04:10", idPartida: "PART-002" },
    { nombreGanador: "Julia", puntaje: 1675, tematica: "Dulces", tiempo: "04:02", idPartida: "PART-006" },
    { nombreGanador: "Brayder", puntaje: 1500, tematica: "Dulces", tiempo: "03:25", idPartida: "PART-001" },
    { nombreGanador: "Luis", puntaje: 1235, tematica: "Dulces", tiempo: "03:55", idPartida: "PART-005" },
    { nombreGanador: "Carlos", puntaje: 990, tematica: "Dulces", tiempo: "02:40", idPartida: "PART-003" },
    { nombreGanador: "Pedro", puntaje: 820, tematica: "Dulces", tiempo: "02:15", idPartida: "PART-007" }
  ]);

  const ordenada = [...lista].sort((a, b) => b.puntaje - a.puntaje);

  return (
    <div className="auth-container ranking-root">
     <div className="ranking-header">
      <div className="ranking-title-container">
        <h1 className="ranking-title">🏆 Ranking de Partidas</h1>
      </div>

      <p className="ranking-subtitle">
        Explora el historial de las mejores partidas y descubre quién domina cada temática.
      </p>
    </div>

      <div className="ranking-scroll-container">
        <div className="ranking-grid">
          {ordenada.map((item, index) => (
            <div className="ranking-card" key={item.idPartida}>
              <div className="ranking-top">
                <span className="ranking-pos">#{index + 1}</span>
                <span className="ranking-badge">{item.tematica}</span>
              </div>
              <h2 className="ranking-name">{item.nombreGanador}</h2>
              <div className="ranking-points">
                {item.puntaje.toLocaleString()}
                <span> puntos</span>
              </div>
              <div className="ranking-bottom">
                <span>⏱ {item.tiempo}</span>
                <span>🔖 {item.idPartida}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
