// src/controllers/subscriptionController.js
import dayjs from 'dayjs';
import { get, run } from '../db.js';
import { sendMessage } from '../utils/sms.js';

export async function newSubForm(req,res){
  const member_id = req.params.memberId || '';
  res.render('subscription_form',{sub:{}, member_id});
}

export async function newSubPost(req,res){
  const {
    member_id,
    start_date,
    duration_value,
    duration_unit,
    amount,
    status
  } = req.body;

  const start = dayjs(start_date);
  const value = parseInt(duration_value, 10);
  const unit = duration_unit;

  let end;
  if (unit === 'minutes') end = start.add(value, 'minute');
  else if (unit === 'months') end = start.add(value, 'month');
  else end = start.add(value, 'day');

  await run(
    `INSERT INTO subscriptions
     (member_id,start_date,end_date,amount,status,duration_value,duration_unit)
     VALUES (?,?,?,?,?,?,?)`,
    [
      member_id,
      start.format('YYYY-MM-DD HH:mm:ss'),
      end.format('YYYY-MM-DD HH:mm:ss'),
      amount || 0,
      status,
      value,
      unit
    ]
  );

  res.redirect('/');
}

export async function markPaid(req,res){
  const {id} = req.params;
  const sub = await get('SELECT * FROM subscriptions WHERE id=?',[id]);
  if(!sub) return res.redirect('/');

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  await run('UPDATE subscriptions SET status=?, paid_on=? WHERE id=?', ['paid', now, id]);

  const start = dayjs(sub.end_date);
  const value = parseInt(sub.duration_value || 30, 10);
  const unit = sub.duration_unit || 'days';

  let end;
  if (unit === 'minutes') end = start.add(value, 'minute');
  else if (unit === 'months') end = start.add(value, 'month');
  else end = start.add(value, 'day');

  await run(
    `INSERT INTO subscriptions
     (member_id,start_date,end_date,amount,status,duration_value,duration_unit)
     VALUES (?,?,?,?,?,?,?)`,
    [
      sub.member_id,
      start.format('YYYY-MM-DD HH:mm:ss'),
      end.format('YYYY-MM-DD HH:mm:ss'),
      sub.amount,
      'due',
      value,
      unit
    ]
  );

  if(req.query.notify === '1'){
    const member = await get('SELECT * FROM members WHERE id=?',[sub.member_id]);
    const msg = `Ciao ${member.first_name}, pagamento registrato. Prossima scadenza: ${end.format('DD/MM/YYYY HH:mm')}`;
    await sendMessage(
      member.phone.startsWith('whatsapp:') ? member.phone : `${member.phone}`,
      msg
    );
  }

  res.redirect('/members/'+sub.member_id);
}
