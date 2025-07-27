// src/utils/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
}

export async function sendEmail(to, subject, text) {
  if (process.env.EMAIL_PROVIDER !== 'smtp') {
    console.log('[EMAIL] Provider non attivo. A:', to, subject);
    return;
  }
  try {
    const t = getTransporter();
    await t.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text
    });
    console.log('[EMAIL] Inviata a', to);
  } catch (e) {
    console.error('[EMAIL] ERRORE:', e.message);
  }
}
