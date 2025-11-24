import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fondo from "./Components/Fondo";
import Autentification from "./Components/Authentication";
import Menu from "./Components/Menu";
import Cargar from "./Components/Cargar";
import CrearPartida from "./Components/CrearPartida";
import Partida from "./Components/Partida";
import Rankin from "./Components/Rankin";
import "./Style/body.css"
import "./Style/componentes.css"

export default function App() {
  return (
    <BrowserRouter>
      <Fondo />
      <Routes>
        <Route path="/" element={<Autentification />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cargar" element={<Cargar />} />
        <Route path="/crearpartida" element={<CrearPartida />} />
        <Route path="/partida" element={<Partida/>} />
        <Route path="/rankin" element={<Rankin/>} />
      </Routes>
    </BrowserRouter>
  );
}