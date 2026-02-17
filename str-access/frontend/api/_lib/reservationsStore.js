import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Esto SIEMPRE apunta a: frontend/api/data/reservations.json
const DATA_FILE = path.join(__dirname, "..", "data", "reservations.json");

export function readReservations() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    // En serverless, mejor NO crashear: devuelve [] y loggea
    console.error("readReservations failed:", err);
    return [];
  }
}

export function findByCode(code) {
  const list = readReservations();
  const c = String(code || "").toUpperCase();
  return list.find((r) => String(r.code || "").toUpperCase() === c) || null;
}

export function findById(id) {
  const list = readReservations();
  const i = String(id || "");
  return list.find((r) => String(r.id || "") === i) || null;
}
