import { Resend } from "resend";
import dotenv from 'dotenv'

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCorreo({ nombre, correo, asunto, mensaje }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: ['maogrr@yahoo.com'],
      subject: `Nuevo Mensaje: ${asunto}`,
      html: `
        <h2>Nuevo Mensaje De Contacto</h2>
        <p><strong>Nombre Y Apellido: </strong>${nombre}</p>
        <p><strong>Correo: </strong>${correo}</p>
        <p><strong>Mensaje: </strong></p>
        <p>${mensaje}</p>
      `,
    });

    if (error) throw error;

    return { success: true, data };

  } catch (err) {
    console.error('Error envio del correo', err);
    throw new Error("Error enviando el correo");
  }
}