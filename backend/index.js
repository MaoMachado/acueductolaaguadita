import supabase from './supabaseClient.js'
import db from './db.js';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import sanitize from 'sanitize-filename';


//Soporte ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

//Rate limiting para uploads
const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiadas subidas, inténtalo mas tarde' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Validaciones comunes
const validarArchivo = (archivo) => {
  const extension = path.extname(archivo.name).toLowerCase();
  const allowedExtension = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  if (!allowedExtension.includes(extension)) throw new Error(`Extensión ${extension} no permitida`);
  if (!allowedMimes.includes(archivo.mimetype)) throw new Error('Tipo MIME no permitido');
  if (archivo.name.length > 100) throw new Error('Nombre de archivo demasiado largo');
};

//Método para subir IMG o PDF
app.post('/upload', uploadLimit, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const archivo = req.files.file;
    const titulo = req.body.titulo || 'Sin Titulo';
    const estado = 'Completo';
    const fecha = new Date().toISOString();

    validarArchivo(archivo);

    const extension = path.extname(archivo.name).toLowerCase();
    const nombreBase = path.basename(archivo.name, extension);

    // ✅ Elimina caracteres no ASCII (como la ó codificada raro)
    const nombreSanitizado = nombreBase
      .normalize('NFD') // descompone acentos
      .replace(/[\u0300-\u036f]/g, '') // elimina acentos
      .replace(/[^a-zA-Z0-9_-]/g, '_') // todo lo que no sea letra, número, guión o _ lo convierte en _

    const nombreUnico = `${Date.now()}_${nombreSanitizado}${extension}`;
    const tipo = archivo.mimetype === 'application/pdf' ? 'pdfs' : 'images';
    const ruta = `${tipo}/${nombreUnico}`;

    console.log('🔐 Bucket:', process.env.SUPABASE_BUCKET);
    console.log('📦 Subiendo archivo:', archivo.name, '->', ruta);

    // Subir a Supabase
    const { error: uploadError } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(ruta, archivo.data, {
        contentType: archivo.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(ruta);

    const fileUrl = publicUrlData.publicUrl;

    // Guardar en base de datos
    const insert =
      archivo.mimetype === 'application/pdf'
        ? db.prepare(`INSERT INTO documentos (titulo, filename, url, estado, fecha_subida) VALUES (?, ?, ?, ?, ?)`)
        : db.prepare(`INSERT INTO imagenes (nombre, filename, url, fecha_subida) VALUES (?, ?, ?, ?)`);

    const result = archivo.mimetype === 'application/pdf'
      ? insert.run(titulo, nombreUnico, fileUrl, estado, fecha)
      : insert.run(titulo, nombreUnico, fileUrl, fecha);

    res.status(200).json({
      message: 'Archivo subido exitosamente',
      id: result.lastInsertRowid,
      tipo: archivo.mimetype,
      titulo,
      filename: nombreUnico,
      url: fileUrl,
      fecha,
      size: archivo.size
    });



  } catch (error) {
    console.error('Error al subir a Supabase:', error.message);
    res.status(500).json({ error: error.message || 'Error subiendo archivo' });
  }
});

//Método para traer la información de los pdf en db
app.get('/documentos', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, titulo, filename, url, estado, fecha_subida
      FROM documentos
      ORDER BY fecha_subida DESC
    `).all();

    console.log(`📋 Enviando ${rows.length} documentos`);
    res.json(rows)
  } catch (e) {
    console.error('Error obteniendo documentos:', e);
    res.status(500).json({ error: 'Error obteniendo documentos de la base de datos' });
  }
});

//Ruta de eliminar documentos
app.delete('/documentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = db.prepare('SELECT * FROM documentos WHERE id = ?').get(id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });

    const ruta = `pdfs/${doc.filename}`;
    console.log('🗑️ Eliminando de Supabase:', ruta);

    const { error: removeError } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([ruta]);

    if (removeError) {
      console.error('❌ Error eliminando de Supabase:', removeError.message);
      return res.status(500).json({ error: 'No se pudo eliminar en Supabase' });
    }

    db.prepare('DELETE FROM documentos WHERE id = ?').run(id);

    res.json({ message: 'Documento eliminado', filename: doc.filename });
  } catch (error) {
    console.error('💥 Error general:', error.message);
    res.status(500).json({ error: 'Error eliminando documento' });
  }
});

//Método Get para recuperar la información de la imágenes en la db
app.get('/imagenes', async (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, nombre, filename, url, fecha_subida
      FROM imagenes
      ORDER BY fecha_subida DESC
    `);

    const rows = stmt.all();
    console.log(`📷 Enviadas ${rows.length} imágenes`)
    res.json(rows);

  } catch (error) {
    console.error('Error al listar las imagenes:', error.message);
    res.status(500).json({ error: 'Error al listar las imagenes' })
  }
})

//Método Delete para eliminar la imagen
app.delete('/imagenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const img = db.prepare('SELECT * FROM imagenes WHERE id = ?').get(id);
    if (!img) return res.status(404).json({ error: 'Imagen no encontrada' });

    const ruta = `images/${img.filename}`;
    await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([ruta]);
    db.prepare('DELETE FROM imagenes WHERE id = ?').run(id);

    res.json({ message: 'Imagen eliminada', filename: img.filename });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando imagen' });
  }
})

//Método para subir la información a la tabla usuarios
app.post('/login', express.json(), (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();
  if (!username || !password) return res.status(400).json({ error: 'Faltan campos' });

  const user = db.prepare(`SELECT * FROM usuarios WHERE username = ? AND password = ?`).get(username, password);
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  res.json({ message: 'Inicio de sesión exitoso' });
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});