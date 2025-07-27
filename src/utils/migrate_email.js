// src/utils/migrate_email.js
import { run } from '../db.js';

async function main() {
  try { await run('ALTER TABLE members ADD COLUMN email TEXT;'); }
  catch(e){ console.log('email già esiste (ok)'); }
  console.log('Migrazione email completata.');
}
main();
