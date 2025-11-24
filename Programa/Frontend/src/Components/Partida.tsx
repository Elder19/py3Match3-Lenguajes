import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Rojo from "../assets/rojo.png";
import Amarillo from "../assets/amarillo.png";
import Blue from "../assets/blue.png";
import Verde from "../assets/verde.png";
import Naranja from "../assets/naranja.png";
import Morado from "../assets/morado.png";

export default function Partida() {

  const imageMap: Record<string, string> = {
    a: Amarillo,
    b: Blue,
    r: Rojo,
    v: Verde,
    n: Naranja,
    m: Morado,
  };

  const [tablero, setTablero] = useState([
    ["a","m","n","n","a","v","v"],
    ["r","r","n","b","b","v","v"],
    ["a","b","m","n","r","v","a"],
    ["m","n","a","b","v","r","m"],
    ["v","a","r","m","n","b","v"],
    ["n","v","b","a","m","r","n"],
    ["r","m","v","n","a","b","r"],
    ["b","n","a","v","r","m","b"],
    ["m","a","n","r","b","v","a"]
  ]);

  return (
    <div className="auth-container">

      <div className="tablero-wrapper">

        <div className="tablero-grid">
          {tablero.map((fila, i) =>
            fila.map((celda, j) => (
              <div key={`${i}-${j}`} className="celda">
                <img src={imageMap[celda]} className="candy-img" />
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
