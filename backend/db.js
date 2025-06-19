import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear conexión a la base de datos
const db = new Database(path.join(__dirname, 'data.sqlite'));

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS documentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    estado TEXT NOT NULL,
    fecha_subida TEXT NOT NULL
  )
`);

export default db;