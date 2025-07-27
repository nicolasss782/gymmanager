// src/cron/reminders.js
import cron from 'node-cron';
import dayjs from 'dayjs';
import { all, run } from '../db.js';
import { sendMessage } from '../utils/sms.js';
import { sendEmail } from '../utils/email.js';

// TEST: ogni minuto. In produzione: '0 9 * * *'
const CRON_EXPR = '*/1 * * * *';

cron.schedule(CRON_EXPR, async () => {
  console.log('[CRON] Controllo promemoria...');

  // 1) APPENA INIZIATO (una volta sola)
  const started = await all(`
    SELECT s.*, m.phone, m.email, m.first_name
    FROM subscriptions s
    JOIN members m ON m.id = s.member_id
    WHERE s.status='due'
      AND datetime(s.start_date) <= datetime('now','localtime')
      AND (s.notified_start IS NULL OR s.notified_start = 0)
  `);

  for (const s of started) {
    const msg = `Ciao ${s.first_name}, il tuo abbonamento presso Ira Fitness è iniziato oggi! Buon allenamento 💪`;
    await safeSend(s, msg, 'start');
    await run('UPDATE subscriptions SET notified_start=1 WHERE id=?', [s.id]);
  }

  // 2) META' ABBONAMENTO
  const mid = await all(`
    SELECT s.*, m.phone, m.email, m.first_name
    FROM subscriptions s
    JOIN members m ON m.id = s.member_id
    WHERE s.status='due'
      AND (s.notified_mid IS NULL OR s.notified_mid = 0)
      AND datetime('now','localtime') >= datetime(
        s.start_date,
        CASE s.duration_unit
          WHEN 'minutes' THEN '+' || CAST(s.duration_value/2 AS INTEGER) || ' minutes'
          WHEN 'days'    THEN '+' || CAST(s.duration_value/2 AS INTEGER) || ' days'
          WHEN 'months'  THEN '+' || CAST(s.duration_value/2 AS INTEGER) || ' months'
          ELSE '+' || CAST(s.duration_value/2 AS INTEGER) || ' days'
        END
      )
      AND datetime('now','localtime') < datetime(s.end_date)
  `);

  for (const s of mid) {
    const msg = `Ciao ${s.first_name}, sei a metà del tuo abbonamento presso Ira Fitness! Continua così! 🔥`;
    await safeSend(s, msg, 'mid');
    await run('UPDATE subscriptions SET notified_mid=1 WHERE id=?', [s.id]);
  }

  // 3) FINE (scaduto)
  const due = await all(`
    SELECT s.*, m.phone, m.email, m.first_name
    FROM subscriptions s
    JOIN members m ON m.id = s.member_id
    WHERE s.status='due'
      AND datetime(s.end_date) <= datetime('now','localtime')
      AND (s.notified_due IS NULL OR s.notified_due = 0)
  `);

  for (const s of due) {
    const msg = `Ciao ${s.first_name}, il tuo abbonamento presso Ira Fitness è scaduto. Passa a rinnovarlo!`;
    await safeSend(s, msg, 'due');
    await run('UPDATE subscriptions SET notified_due=1 WHERE id=?', [s.id]);
  }

  console.log('[CRON] Inviati -> start:', started.length, 'mid:', mid.length, 'due:', due.length);
});

async function safeSend(rec, msg, tag){
  try { if (rec.phone) await sendMessage(rec.phone, msg); }
  catch(e){ console.error(`[MSG ${tag}]`, e.message); }
  try { if (rec.email) await sendEmail(rec.email, `Promemoria abbonamento (${tag})`, msg); }
  catch(e){ console.error(`[EMAIL ${tag}]`, e.message); }
}
