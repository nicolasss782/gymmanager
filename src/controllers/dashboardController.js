// src/controllers/dashboardController.js
import { all } from '../db.js';

export async function dashboard(req,res){
  // Usiamo SQLite per confrontare le date/ore
  const due = await all(
    `SELECT s.*, m.first_name||" "||m.last_name AS member_name, m.id AS member_id
     FROM subscriptions s
     JOIN members m ON m.id = s.member_id
     WHERE s.status = 'due'
       AND datetime(s.end_date) <= datetime('now','localtime')
     ORDER BY s.end_date ASC`
  );

  const coming = await all(
    `SELECT s.*, m.first_name||" "||m.last_name AS member_name, m.id AS member_id
     FROM subscriptions s
     JOIN members m ON m.id = s.member_id
     WHERE s.status = 'due'
       AND datetime(s.end_date) > datetime('now','localtime')
       AND datetime(s.end_date) <= datetime('now','localtime', '+7 days')
     ORDER BY s.end_date ASC`
  );

  res.render('dashboard',{ due, coming });
}
