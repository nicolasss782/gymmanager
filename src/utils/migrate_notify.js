// src/utils/migrate_notify.js
import { run } from '../db.js';

async function main() {
  try { await run('ALTER TABLE subscriptions ADD COLUMN notified_due INTEGER DEFAULT 0;'); }
  catch(e){ console.log('notified_due già esiste (ok)'); }

  try { await run('ALTER TABLE subscriptions ADD COLUMN notified_coming INTEGER DEFAULT 0;'); }
  catch(e){ console.log('notified_coming già esiste (ok)'); }

  console.log('Migrazione promemoria completata.');
}
main();
