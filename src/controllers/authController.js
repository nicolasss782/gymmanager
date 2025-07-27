import bcrypt from 'bcrypt';
import { get } from '../db.js';

export async function loginForm(req, res){
  res.render('login',{ error:null });
}

export async function loginPost(req, res){
  const {username, password} = req.body;
  const user = await get('SELECT * FROM users WHERE username=?',[username]);
  if(!user){ return res.render('login',{error:'Credenziali errate'}); }
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok){ return res.render('login',{error:'Credenziali errate'}); }
  req.session.user = {id:user.id, username:user.username};
  res.redirect('/');
}

export function logout(req,res){
  req.session.destroy(()=>{
    res.redirect('/login');
  });
}
