import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Context } from "./Context";

export default function Globales({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<any | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const newSocket = io("https://verna-nevoid-cyclopaedically.ngrok-free.dev", {
      transports: ["websocket"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket conectado:", newSocket.id);
    });
    newSocket.on("connect_error", (err: any) => {
      console.error("Error: Socket", err?.message ?? err);
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <Context.Provider value={{ socket, username, setUsername }}>
      {children}
    </Context.Provider>
  );
}
