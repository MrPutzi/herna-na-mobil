import { getUserFromReq } from '../auth';
import db from '../../../lib/db';
const reds = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const user = await getUserFromReq(req); if(!user) return res.status(401).json({error:'not_auth'});
  const {bet,type,value} = req.body; const amount = Number(bet)||0; if(amount<=0) return res.status(400).json({error:'bad_bet'});
  if(user.credits < amount) return res.status(400).json({error:'no_credits'});
  const spin = Math.floor(Math.random()*37);
  let finalDelta = -amount;
  if(type === 'number') {
    const num = Number(value);
    if(num === spin) finalDelta = amount * 35;
  } else if(type === 'color') {
    if(spin === 0) finalDelta = -amount;
    else {
      const color = reds.has(spin) ? 'red' : 'black';
      if(color === value) finalDelta = amount;
    }
  } else return res.status(400).json({error:'bad_type'});
  const newCredits = user.credits + finalDelta;
  await db.query('UPDATE users SET credits=$1 WHERE id=$2',[newCredits,user.id]);
  res.json({spin, delta: finalDelta, credits: newCredits});
}
