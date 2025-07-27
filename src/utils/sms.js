// src/utils/sms.js
import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';

function normalizeWhatsApp(num) {
  let n = (num || '').trim();

  // già in formato whatsapp:+...
  if (n.startsWith('whatsapp:')) return n;

  // se manca il +, aggiungo +39 (cambia prefisso se non sei in Italia)
  if (!n.startsWith('+')) n = '+39' + n.replace(/\s+/g, '');

  return 'whatsapp:' + n;
}

export async function sendMessage(to, body) {
  if (process.env.SMS_PROVIDER !== 'twilio') {
    console.log('[SMS] Provider non attivo. A:', to, 'Msg:', body);
    return;
  }

  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const fromWA = process.env.WHATSAPP_FROM;
  const fromSMS = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token) {
    console.log('[SMS] Twilio non configurato. Msg:', to, body);
    return;
  }

  try {
    const client = twilio(sid, token);

    // Se vuoi forzare sempre WhatsApp:
    const dest = normalizeWhatsApp(to);

    await client.messages.create({
      from: fromWA,   // mittente WhatsApp sandbox
      to: dest,
      body
    });

    console.log('[SMS] Inviato a', dest);
  } catch (e) {
    console.error('[SMS] ERRORE invio:', e.message);
  }
}
