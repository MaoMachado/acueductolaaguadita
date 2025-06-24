import supabase from './supabaseClient.js';
import { enviarCorreo } from './emailService.js';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
// import sanitize from 'sanitize-filename';


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

    // Guardar en supabase
    // Guardar en Supabase (tabla documentos o imagenes)
    let insertResult;
    if (archivo.mimetype === 'application/pdf') {
      const { data, error } = await supabase
        .from('documentos')
        .insert([
          {
            titulo,
            filename: nombreUnico,
            url: fileUrl,
            estado,
            fecha_subida: fecha
          }
        ]);

      if (error) throw error;
      insertResult = data;
    } else {
      const { data, error } = await supabase
        .from('imagenes')
        .insert([
          {
            nombre: titulo,
            filename: nombreUnico,
            url: fileUrl,
            fecha_subida: fecha
          }
        ]);

      if (error) throw error;
      insertResult = data;
    }

    res.status(200).json({
      message: 'Archivo subido exitosamente',
      id: insertResult?.id,
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
app.get('/documentos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .select('id, titulo, filename, url, estado, fecha_subida')
      .order('fecha_subida', { ascending: false });

    if (error) throw error;

    console.log(`📋 Enviando ${data.length} documentos`);
    res.json(data);
  } catch (e) {
    console.error('Error obteniendo documentos desde Supabase:', e.message);
    res.status(500).json({ error: 'Error obteniendo documentos desde Supabase' });
  }
});

//Ruta de eliminar documentos
app.delete('/documentos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar documento en Supabase
    const { data: docs, error: fetchError } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !docs) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const ruta = `pdfs/${docs.filename}`;
    console.log('🗑️ Eliminando de Supabase:', ruta);

    // Eliminar archivo del bucket
    const { error: removeError } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([ruta]);

    if (removeError) {
      console.error('❌ Error eliminando de Supabase:', removeError.message);
      return res.status(500).json({ error: 'No se pudo eliminar en Supabase' });
    }

    // Eliminar registro de la base de datos
    const { error: deleteError } = await supabase
      .from('documentos')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Documento eliminado', filename: docs.filename });
  } catch (error) {
    console.error('💥 Error general:', error.message);
    res.status(500).json({ error: 'Error eliminando documento' });
  }
});

//Método Get para recuperar la información de la imágenes en la db
app.get('/imagenes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('imagenes')
      .select('id, nombre, filename, url, fecha_subida')
      .order('fecha_subida', { ascending: false });

    if (error) throw error;

    console.log(`📷 Enviadas ${data.length} imágenes`);
    res.json(data);
  } catch (error) {
    console.error('Error al listar las imágenes:', error.message);
    res.status(500).json({ error: 'Error al listar las imágenes' });
  }
})

//Método Delete para eliminar la imagen
app.delete('/imagenes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener la imagen desde Supabase DB
    const { data: img, error: getError } = await supabase
      .from('imagenes')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    if (!img) return res.status(404).json({ error: 'Imagen no encontrada' });

    // 2. Eliminar del bucket de Supabase
    const ruta = `images/${img.filename}`;
    const { error: removeError } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([ruta]);

    if (removeError) throw removeError;

    // 3. Eliminar registro en la tabla
    const { error: deleteError } = await supabase
      .from('imagenes')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Imagen eliminada', filename: img.filename });
  } catch (error) {
    console.error('💥 Error eliminando imagen:', error.message);
    res.status(500).json({ error: 'Error eliminando imagen' });
  }
})

//Método para subir la información a la tabla usuarios
app.post('/login', express.json(), async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({ message: 'Inicio de sesión exitoso' });

  } catch (err) {
    console.error('💥 Error login:', err.message);
    res.status(500).json({ error: 'Error durante el login' });
  }
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