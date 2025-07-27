import { run } from '../db.js';

async function main() {
  try { await run('ALTER TABLE subscriptions ADD COLUMN notified_start INTEGER DEFAULT 0;'); }
  catch(e){ console.log('notified_start già esiste (ok)'); }
  console.log('Migrazione start completata.');
}
main();
