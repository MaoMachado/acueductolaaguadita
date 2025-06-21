// backend/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Detectar archivo de entorno correcto
const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env.production';
dotenv.config({ path: envFile });

// Validar claves
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('❌ SUPABASE_URL o SUPABASE_KEY no están definidos en el .env');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default supabase;