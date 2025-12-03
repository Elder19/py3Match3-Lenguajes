import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ======================================================
   =============== CONTROLADORES GLOBALES ===============
   ====================================================== */

// -------------------- PARTIDAS ------------------------

async function crearPartida(req, res) {
  try {
    const { codigo, tematica, tipo_juego, duracion, max_jugadores } = req.body;

    const { data, error } = await supabase
      .from("partidas")
      .insert([{ codigo, tematica, tipo_juego, duracion, max_jugadores }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function obtenerPartidas(req, res) {
  const { data, error } = await supabase.from("partidas").select("*");

  if (error) return res.status(500).json({ error });
  res.json(data);
}

// -------------------- JUGADORES ------------------------

async function unirsePartida(req, res) {
  try {
    const { nickname, partida_id } = req.body;

    const { data, error } = await supabase
      .from("jugadores")
      .insert([{ nickname, partida_id, estado: true }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function obtenerJugadoresPartida(req, res) {
  const { partida_id } = req.params;

  const { data, error } = await supabase
    .from("vista_jugadores_por_partida")
    .select("*")
    .eq("partida_id", partida_id);

  if (error) return res.status(500).json({ error });
  res.json(data);
}

// -------------------- TABLERO --------------------------

async function obtenerTablero(req, res) {
  const { partida_id } = req.params;

  const { data, error } = await supabase
    .from("vista_tablero_partida")
    .select("*")
    .eq("partida_id", partida_id);

  if (error) return res.status(500).json({ error });
  res.json(data);
}

// -------------------- RANKING --------------------------

async function obtenerRanking(req, res) {
  const { data, error } = await supabase
    .from("vista_ranking_global")
    .select("*");

  if (error) return res.status(500).json({ error });
  res.json(data);
}


/* ======================================================
   ======================== RUTAS ========================
   ====================================================== */

// PARTIDAS
app.post("/api/partidas/crear", crearPartida);
app.get("/api/partidas", obtenerPartidas);

// JUGADORES
app.post("/api/jugadores/unirse", unirsePartida);
app.get("/api/jugadores/:partida_id", obtenerJugadoresPartida);

// TABLERO
app.get("/api/tablero/:partida_id", obtenerTablero);

// RANKING
app.get("/api/ranking", obtenerRanking);


/* ======================================================
   ==================== INICIAR SERVER ==================
   ====================================================== */

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});