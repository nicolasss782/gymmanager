import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { run } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = fs.readFileSync(path.join(__dirname, '../../sql/schema.sql'), 'utf8');

async function main(){
  await run('PRAGMA foreign_keys = ON;');
  await run('BEGIN;');
  try{
    const stmts = schema.split(/;\s*\n/).map(s=>s.trim()).filter(Boolean);
    for(const s of stmts){
      await run(s+';');
    }
    await run('COMMIT;');
    console.log('Migrations applied.');
  }catch(e){
    await run('ROLLBACK;');
    console.error(e);
  }
}
main();
