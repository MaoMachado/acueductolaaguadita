import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import sanitize from 'sanitize-filename';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

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
    //Sanitizar nombre original
    const originalName = sanitize(file.originalname);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);

    //Crear nombre único y seguro
    const uniqueName = `${uuidv4()}-${baseName}${extension}`
    cb(null, uniqueName);
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
    cb(null, true);
  } catch (error) {
    cb(new Error('Error validando archivo'), false);
  }

}

const upload = multer({
  storage,
  fileFilter
});

//Ruta para subir los archivos
app.post('/upload', uploadLimit, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileUrl = req.file.mimetype === 'application/pdf'
      ? `/pdfs/${req.file.filename}`
      : `/images/${req.file.filename}`;

    res.status(200).json({
      message: 'File uploaded',
      url: fileUrl,
      type: req.file.mimetype,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.log("Error uploading file: ", error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

//Ruta adicional para listar archivos
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
      total: imageFiles.length + pdfFiles.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error listando archivos' })
  }
})


//Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.log('Error middleware: ', error.message);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande'
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Campo de archivo inesperado'
      });
    }
  }
  res.status(500).json({ error: error.message })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  console.log(`📤 POST /upload - Subir archivos`);
  console.log(`📋 GET /files - Listar archivos`);
});