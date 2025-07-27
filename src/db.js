import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const dbPath = path.join(__dirname, '..', '..', 'gymmanager.sqlite');
export const dbPath = path.resolve('./data/gymmanager.sqlite');


sqlite3.verbose();
export const db = new sqlite3.Database(dbPath);

export function run(query, params=[]) {
  return new Promise((resolve, reject)=>{
    db.run(query, params, function(err){
      if(err) reject(err);
      else resolve(this);
    });
  });
}

export function all(query, params=[]) {
  return new Promise((resolve, reject)=>{
    db.all(query, params, (err, rows)=>{
      if(err) reject(err);
      else resolve(rows);
    });
  });
}

export function get(query, params=[]) {
  return new Promise((resolve, reject)=>{
    db.get(query, params, (err, row)=>{
      if(err) reject(err);
      else resolve(row);
    });
  });
}
