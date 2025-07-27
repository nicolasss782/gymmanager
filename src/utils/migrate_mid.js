// src/utils/migrate_mid.js
import { run } from '../db.js';

async function main() {
  try { await run('ALTER TABLE subscriptions ADD COLUMN notified_mid INTEGER DEFAULT 0;'); }
  catch(e){ console.log('notified_mid già esiste (ok)'); }
  console.log('Migrazione metà completata.');
}
main();
