import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cargar() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const Agregar = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/menu");
  };

  return (
    <div className="auth-container">
      <div className="cargar-box">
        <h1 className="auth-title">Codigo de la sala</h1>
        <form onSubmit={Agregar} className="auth-form">
          <input
            type="text"
            placeholder="Ingresa el codigo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <button type="submit">entrar</button>
        </form>
      </div>

    </div>
  );
}
