import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear conexión a la base de datos
const db = new Database(path.join(__dirname, 'data.sqlite'));

db.prepare(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

const adminExiste = db.prepare(`SELECT * FROM usuarios WHERE username = ?`).get('admin');
if (!adminExiste) {
  db.prepare(`INSERT INTO usuarios (username, password) VALUES (?, ?)`).run('admin', 'admin')
}



export default db;