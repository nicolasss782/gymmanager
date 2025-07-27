// src/controllers/memberController.js
import { all, get, run } from '../db.js';

export async function listMembers(req, res) {
  const members = await all('SELECT * FROM members ORDER BY last_name, first_name');
  res.render('members', { members });
}

export async function memberDetail(req, res) {
  const member = await get('SELECT * FROM members WHERE id=?', [req.params.id]);
  const subs = await all('SELECT * FROM subscriptions WHERE member_id=? ORDER BY start_date DESC', [req.params.id]);
  res.render('member_detail', { member, subs });
}

export async function newMemberForm(req, res) {
  res.render('member_form', { member: {}, error: null });
}

export async function newMemberPost(req, res) {
  try {
    const { first_name, last_name, phone, email, active } = req.body;
    await run(
      'INSERT INTO members (first_name,last_name,phone,active,email) VALUES (?,?,?,?,?)',
      [first_name, last_name, phone, active ? 1 : 0, email || null]
    );
    return res.redirect('/members');
  } catch (err) {
    console.error(err);
    return res.render('member_form', { member: req.body, error: 'Errore nel salvataggio' });
  }
}

export async function editMemberForm(req, res) {
  const member = await get('SELECT * FROM members WHERE id=?', [req.params.id]);
  res.render('member_form', { member, error: null });
}

export async function editMemberPost(req, res) {
  try {
    const { first_name, last_name, phone, email, active } = req.body;
    await run(
      'UPDATE members SET first_name=?, last_name=?, phone=?, active=?, email=? WHERE id=?',
      [first_name, last_name, phone, active ? 1 : 0, email || null, req.params.id]
    );
    return res.redirect('/members');
  } catch (err) {
    console.error(err);
    req.body.id = req.params.id;
    return res.render('member_form', { member: req.body, error: 'Errore nel salvataggio' });
  }
}

export async function deleteMember(req, res) {
  try {
    await run('DELETE FROM subscriptions WHERE member_id=?', [req.params.id]);
    await run('DELETE FROM members WHERE id=?', [req.params.id]);
    return res.redirect('/members');
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore eliminazione');
  }
}
