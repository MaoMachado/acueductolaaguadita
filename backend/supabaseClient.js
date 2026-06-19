import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import { Resend } from "resend";

// Detectar archivo de entorno correcto
const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env.production";
dotenv.config({ path: envFile });

// Validar claves
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error(
    "❌ SUPABASE_URL o SUPABASE_KEY no están definidos en el .env",
  );
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("❌ RESEND_API_KEY no está definida en el .env");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };
export default supabase;
