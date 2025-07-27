import bcrypt from 'bcrypt';
import { get, run } from '../db.js';

const username = 'admin';
const password = 'admin123'; // cambialo poi

async function main(){
  const existing = await get('SELECT * FROM users WHERE username=?',[username]);
  if(existing){
    console.log('Admin già esistente');
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await run('INSERT INTO users (username, password_hash) VALUES (?,?)',[username, hash]);
  console.log('Creato admin/admin123');
}
main();
