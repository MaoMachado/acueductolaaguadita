import bcrypt from 'bcrypt'
import supabase from '../supabaseClient';

const SALT_ROUNDS = 10;

async function hashPassword() {

  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('id, username, password')

  if (error) {
    console.error("Error obteniendo usuarios:", error.message);
    process.exit(1)
  }

  if (!usuarios || usuarios.length === 0) {
    console.log("No Hay usuarios en la base de datos");
    process.exit(1)
  }

  console.log("Usuarios encontrados: ", usuarios);

  let migrados = 0;
  let errores = 0;

  for (const usuario of usuarios) {
    if (usuario.password.startsWith("$2b$") || usuario.password.startsWith("$2a$")) {
      console.log("Usuario ya hasheado: ", usuario.username)
      migrados++
      continue;
    }

    try {
      console.log(`🔄 ${usuario.username} - Hasheando...`);
      const hash = await bcrypt.hash(usuario.password, SALT_ROUNDS);

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ password: hash })
        .eq('id', usuario.id)

      if (updateError) throw updateError

      console.log(`✅ ${usuario.username} - Migrado`)
      migrados++
    } catch (err) {
      console.error(`❌ ${usuario.username} - Error:`, err.message)
      errores++
    }
  }

  process.exit(0)
}

hashPassword()
