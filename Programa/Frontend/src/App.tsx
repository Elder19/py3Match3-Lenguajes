import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fondo from "./Components/Fondo";
import Autentification from "./Components/Authentication";
import Menu from "./Components/Menu";
import Cargar from "./Components/Cargar";
import CrearPartida from "./Components/CrearPartida";
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

      </Routes>
    </BrowserRouter>
  );
}