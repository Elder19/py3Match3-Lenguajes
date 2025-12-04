import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RankingItem {
  idPartida: string;
  nombreGanador: string;
  puntaje: number;
  tematica: string;
  tiempo: string;
}

export default function Ranking() {
  const [lista, setLista] = useState<RankingItem[]>([]);

  useEffect(() => {
    async function cargarRanking() {
      try {
        console.log("API_URL en Ranking:", API_URL);

        const res = await fetch(`${API_URL}/api/ranking`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!res.ok) {
          const texto = await res.text();
          console.error("Respuesta NO OK:", res.status, texto);
          return;
        }

        const data = await res.json();
        console.log("DATA ranking:", data);

        const adaptada: RankingItem[] = data.map((row: any) => ({
          idPartida: row.codigo_partida,
          nombreGanador: row.ganador,
          puntaje: row.puntaje,
          tematica: row.tematica,
          tiempo: `${row.tiempo_invertido} min`,
        }));

        setLista(adaptada);
      } catch (err) {
        console.error("Error en cargarRanking:", err);
      }
    }

    cargarRanking();
  }, []);

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

          {ordenada.length === 0 && (
            <p style={{ padding: "1rem" }}>Todavía no hay partidas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
