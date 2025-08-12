import { getUserFromReq } from '../auth';
import db from '../../../lib/db';
function rnd(n){ return Math.floor(Math.random()*n); }
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const user = await getUserFromReq(req); if(!user) return res.status(401).json({error:'not_auth'});
  const {bet} = req.body; const amount = Number(bet)||0; if(amount<=0) return res.status(400).json({error:'bad_bet'});
  if(user.credits < amount) return res.status(400).json({error:'no_credits'});
  const r = [rnd(6), rnd(6), rnd(6)];
  let multiplier = 0;
  if(r[0]===r[1] && r[1]===r[2]) multiplier = 5;
  else if(r[0]===r[1] || r[1]===r[2] || r[0]===r[2]) multiplier = 2;
  const finalDelta = multiplier>0 ? Math.round(amount*(multiplier-1)) : -amount;
  const newCredits = user.credits + finalDelta;
  await db.query('UPDATE users SET credits=$1 WHERE id=$2',[newCredits,user.id]);
  res.json({reels:r, multiplier, delta: finalDelta, credits: newCredits});
}
