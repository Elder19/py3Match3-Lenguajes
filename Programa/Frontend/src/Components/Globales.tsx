import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

export default function Globales({ children }) {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, username, setUsername }}>
      {children}
    </SocketContext.Provider>
  );
}
