import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Context";

export default function Cargar() {
  const { socket, username } = useContext(Context);
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("alerta", (msg: string) => {
      alert(msg);
    });

    socket.on("mensaje", (msg: string) => {
      console.log(msg);
    });

    socket.on("actualizar-partida", (resumen: any) => {
      console.log("Resumen actualizado:", resumen);
      navigate(`/partida?room=${codigo}`);
    });

    return () => {
      socket?.off("alerta");
      socket?.off("mensaje");
      socket?.off("actualizar-partida");
    };
  }, [socket, codigo, navigate]);

  const Unirse = (e: React.FormEvent) => {
    e.preventDefault();

    if (!socket) {
      alert("No hay conexión con el servidor ❌");
      return;
    }

    if (!username) {
      alert("Primero debes ingresar tu nombre en la pantalla principal ❌");
      return;
    }

    socket.emit("unirse-partida", codigo, username);
  };

  return (
    <div className="auth-container">
      <div className="cargar-box">
        <h1 className="auth-title">Código de la sala</h1>
        <form onSubmit={Unirse} className="auth-form">
          <input
            type="text"
            placeholder="Ingresa el código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
