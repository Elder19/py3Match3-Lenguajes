import { useNavigate } from "react-router-dom";


export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">MATCH _3</h1>
        <div className="menu-buttons">
          <button onClick={() => navigate("/crearpartida")}>Crear partida</button>
          <button onClick={() => navigate("/cargar")}>Unirse a una partida</button>
          <button onClick={() => navigate("/rankin")}>Ver ranking</button>
        </div>
      </div>
    </div>
  );
}
