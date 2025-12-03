import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Context";

export default function Authentication() {
  const { username, setUsername } = useContext(Context);
  const navigate = useNavigate();

  const Agregar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username.trim() === "") return; // validación simple
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Iniciar</button>
        </form>
      </div>
    </div>
  );
}
