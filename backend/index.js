import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import sanitize from 'sanitize-filename';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

//Import DB
import db from './db.js';

//Soporte ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

//Crear directorios si no existen
const createDirectories = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'uploads/images'), { recursive: true });
    await fs.mkdir(path.join(__dirname, 'uploads/pdfs'), { recursive: true });
  } catch (error) {
    console.log("Directorios ya existen o error: ", error.message);
  }
}

createDirectories();

//Rutas publicas para acceder a los archivos
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/pdfs', express.static(path.join(__dirname, 'uploads/pdfs')));

//Rate limiting para uploads
const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiadas subidas, inténtalo mas tarde' },
  standardHeaders: true,
  legacyHeaders: false,
})

//Storage dinamico por tipo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.mimetype === 'application/pdf' ? 'pdfs' : 'images';
    cb(null, path.join(__dirname, `uploads/${folder}`));
  },

  filename: function (req, file, cb) {
    try {
      //Sanitizar nombre original
      const originalName = sanitize(file.originalname);
      const extension = path.extname(originalName);
      const baseName = path.basename(originalName, extension);

      //Crear nombre único y seguro
      const uniqueName = `${uuidv4()}-${baseName}${extension}`
      cb(null, uniqueName);
    } catch (error) {
      cb(new Error('Error procesando nombre de archivos'), false);
    }
  }
});

//Validación avanzada de archivos
const fileFilter = (req, file, cb) => {
  try {
    const allowedExtension = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtension.includes(fileExtension)) {
      return cb(new Error(`Extensión ${fileExtension} no permitida`), false)
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Tipo MIME no permitido'), false);
    }

    //Validar tamaño del nombre del archivo
    if (file.originalname.length > 100) {
      return cb(new Error('Nombre del archivo demasiado grande (Máximo 100 caracteres)'), false)
    }

    cb(null, true);
  } catch (error) {
    cb(new Error('Error validando archivo'), false);
  }

}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    file: 1,
    fieldSize: 1000,
  }
});

//Método para subir la información de los pdf a la db
app.post('/upload', uploadLimit, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se recibió ningún archivo" });

    const titulo = req.body.titulo || 'Sin Titulo';
    const estado = 'Completo';
    const fecha = new Date().toISOString();

    if (titulo.length < 1 || titulo.length > 200) {
      return res.status(400).json({ error: "El título debe tener entre 1 y 200 caracteres" });
    }

    const fileUrl = req.file.mimetype === 'application/pdf'
      ? `/pdfs/${req.file.filename}`
      : `/images/${req.file.filename}`;

    // Manejo Errores Para La DB
    try {
      const stmt = db.prepare(`
        INSERT INTO documentos (titulo, filename, url, estado, fecha_subida)
        VALUES (?, ?, ?, ?, ?)
      `)

      const result = stmt.run(titulo, req.file.filename, fileUrl, estado, fecha);
      console.log(`✅ Archivo subido exitosamente: ${req.file.filename}`);

      res.status(200).json({
        message: 'Archivo Subido Exitosamente',
        id: result.lastInsertRowid,
        url: fileUrl,
        type: req.file.mimetype,
        filename: req.file.filename,
        titulo,
        estado,
        fecha,
        size: req.file.size
      });
    } catch (dbError) {
      console.error('Error en base de datos:', dbError);

      // Eliminar archivo si falla la inserción en BD
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error eliminando archivo temporal:', unlinkError);
      }

      return res.status(500).json({ error: 'Error guardando en base de datos' });
    }
  } catch (error) {
    console.log("Error uploading file: ", error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

//Método para traer los archivos del uploads
app.get('/files', async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, 'uploads/images');
    const pdfsDir = path.join(__dirname, 'uploads/pdfs');

    const [images, pdfs] = await Promise.all([
      fs.readdir(imagesDir).catch(() => []),
      fs.readdir(pdfsDir).catch(() => [])
    ]);

    const imageFiles = images.map(filename => ({
      filename,
      type: 'image',
      url: `/images/${filename}`
    }));

    const pdfFiles = pdfs.map(filename => ({
      filename,
      type: 'pdf',
      url: `/pdfs/${filename}`
    }));

    res.json({
      files: [...imageFiles, ...pdfFiles],
      total: imageFiles.length + pdfFiles.length,
      images: imageFiles.length,
      pdfs: pdfFiles.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error listando archivos' })
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

    // Buscar el documento primero
    const documento = db.prepare('SELECT * FROM documentos WHERE id = ?').get(id);

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Eliminar archivo físico
    const filePath = path.join(__dirname, 'uploads', documento.url);
    try {
      await fs.unlink(filePath);
      console.log(`🗑️ Archivo eliminado: ${documento.filename}`);
    } catch (fileError) {
      console.warn('Archivo físico no encontrado, continuando con eliminación de BD');
    }

    // Eliminar de base de datos
    const result = db.prepare('DELETE FROM documentos WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Documento no encontrado en BD' });
    }

    res.json({
      message: 'Documento eliminado exitosamente',
      deletedFile: documento.filename
    });

  } catch (error) {
    console.error('Error eliminando documento:', error);
    res.status(500).json({ error: 'Error eliminando documento' });
  }
});

//Método Post para subir la información de la imagen al db
app.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });

    const nombre = req.body.nombre || 'Sin Nombre';
    const fecha = new Date().toISOString();
    const fileUrl = `/images/${req.file.filename}`;

    const stmt = db.prepare(`
      INSERT INTO imagenes (nombre, filename, url, fecha_subida)
      VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(nombre, req.file.filename, fileUrl, fecha)

    res.status(200).json({
      message: 'Imagen Subida Correctamente',
      id: result.lastInsertRowid,
      nombre,
      filename: req.file.filename,
      url: fileUrl,
      fecha
    })
  } catch (error) {
    console.error('Error al subir la imagen: ', error.message);
    res.status(500).json({ error: 'Error al subir la imagen' })
  }
})

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
    const stmtSelect = db.prepare('SELECT * FROM imagenes WHERE id = ?');
    const imagen = stmtSelect.get(id);

    if (!imagen) {
      return res.status(400).json({ error: 'Imagen no encontrada' });
    };

    const filePath = path.join(__dirname, 'uploads', 'images', imagen.filename);

    try {
      await fs.unlink(filePath);
      console.log(`🧹 Imagen eliminada: ${imagen.filename}`)
    } catch (error) {
      console.warn('No se pudo borrar el archivo físico (quizás ya no existía)', error.message)
    }

    const stmtDelete = db.prepare('DELETE FROM imagenes WHERE id = ?');
    const result = stmtDelete.run(id);

    if (result.changes === 0) {
      return res.status(500).json({ error: "Error eliminando imagen de la base de datos" });
    }

    res.json({ message: 'Imagen eliminada correctamente' });

  } catch (error) {
    console.error('Error eliminando imagen:', error.message)
    res.status(500).json({ error: 'Error al eliminar imagen' })
  }
})

//Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('🚨 Error middleware:', error.message);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande (máximo 10MB)'
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Campo de archivo inesperado'
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Demasiados archivos (máximo 1)'
      });
    }
  }

  res.status(500).json({
    error: error.message || 'Error interno del servidor'
  });
});

// Ruta de salud del servidor
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
  console.log(`📤 POST /upload - Subir archivos`);
  console.log(`📋 GET /documentos - Listar documentos de BD`);
  console.log(`📁 GET /files - Listar archivos del sistema`);
  console.log(`🗑️ DELETE /documentos/:id - Eliminar documento`);
  console.log(`💚 GET /health - Estado del servidor`);
});