import fs from 'fs';
import { dbPath } from '../db.js';
console.log('DB path:', dbPath);
console.log('Esiste?', fs.existsSync(dbPath));
process.exit(0);
