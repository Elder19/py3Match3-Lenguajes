import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Context";

export default function CrearPartida() {
  const { socket, username } = useContext(Context);
  const [tipoJuego, setTipoJuego] = useState("vs");
  const [tiempo, setTiempo] = useState(1);
  const [tematica, setTematica] = useState("dulces");
  const [jugadores, setJugadores] = useState(2);

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("partida-creada", ({ nueva }) => {
      console.log("Partida creada en sala:", nueva);
      navigate(`/partida?room=${nueva}`);
    });

    return () => {
      socket?.off("partida-creada");
    };
  }, [socket, navigate]);

  const Crear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket) {
      alert("Error: no hay conexión al servidor ❌");
      return;
    }

    const partida = {
      tipoJuego,
      tiempo: tipoJuego === "vsTiempo" ? tiempo : null,
      tematica,
      jugadores,
    };

    console.log("Enviando partida al servidor...");
    socket.emit("crear-partida", partida, username);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Crear Partida</h1>
        <form className="crear-form" onSubmit={Crear}>
          <label className="crear-label">Tipo de juego</label>
          <select
            className="crear-select"
            value={tipoJuego}
            onChange={(e) => setTipoJuego(e.target.value)}
          >
            <option value="vs">cantidad finita de match</option>
            <option value="vsTiempo">tiempo (contar minutos)</option>
          </select>

          {tipoJuego === "vsTiempo" && (
            <>
              <label className="crear-label">Minutos de la partida</label>
              <input
                type="number"
                min="1"
                className="crear-input"
                value={tiempo}
                onChange={(e) => setTiempo(Number(e.target.value))}
              />
            </>
          )}

          <label className="crear-label">Temática</label>
          <select
            className="crear-select"
            value={tematica}
            onChange={(e) => setTematica(e.target.value)}
          >
            <option value="dulces">Dulces (estándar)</option>
          </select>

          <label className="crear-label">Cantidad de jugadores</label>
          <input
            type="number"
            min="2"
            className="crear-input"
            value={jugadores}
            onChange={(e) => setJugadores(Number(e.target.value))}
          />

          <button className="crear-btn" type="submit">
            Crear Partida
          </button>
        </form>
      </div>
    </div>
  );
}
