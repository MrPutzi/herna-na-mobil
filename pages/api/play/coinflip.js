import { getUserFromReq } from '../auth';
import db from '../../../lib/db';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const user = await getUserFromReq(req); if(!user) return res.status(401).json({error:'not_auth'});
  const {bet,choice} = req.body; const amount = Number(bet)||0; if(amount<=0) return res.status(400).json({error:'bad_bet'});
  if(user.credits < amount) return res.status(400).json({error:'no_credits'});
  const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
  const delta = outcome === choice ? amount : -amount;
  const newCredits = user.credits + delta;
  await db.query('UPDATE users SET credits=$1 WHERE id=$2',[newCredits,user.id]);
  res.json({outcome, delta, credits: newCredits});
}
