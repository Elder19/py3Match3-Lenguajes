import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Autentification() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const Agregar = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/menu");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">MATCH _3</h1>
        <form onSubmit={Agregar} className="auth-form">
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <button type="submit">Iniciar</button>
        </form>
      </div>
    </div>
  );
}
