// src/utils/migrate_duration.js
import { run } from '../db.js';

async function main() {
  try {
    await run('ALTER TABLE subscriptions ADD COLUMN duration_value INTEGER DEFAULT 30;');
  } catch(e){ console.log('duration_value già esiste (ok)'); }
  try {
    await run("ALTER TABLE subscriptions ADD COLUMN duration_unit TEXT DEFAULT 'days';");
  } catch(e){ console.log('duration_unit già esiste (ok)'); }
  console.log('Migrazione durata completata.');
}
main();
