import bcrypt from 'bcryptjs';
import db from '../../lib/db';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const {username,password} = req.body;
  if(!username||!password) return res.status(400).json({error:'missing'});
  const r = await db.query('SELECT id,username,password,credits FROM users WHERE username=$1',[username]);
  if(r.rowCount===0) return res.status(400).json({error:'invalid'});
  const user = r.rows[0];
  if(!bcrypt.compareSync(password, user.password)) return res.status(400).json({error:'invalid'});
  const token = jwt.sign({id:user.id,username:user.username}, process.env.JWT_SECRET || 'devsecret', {expiresIn:'7d'});
  res.setHeader('Set-Cookie', cookie.serialize('token', token, {httpOnly:true, path:'/', sameSite:'lax', maxAge:7*24*60*60}));
  res.json({ok:true, user:{id:user.id,username:user.username,credits:user.credits}});
}
