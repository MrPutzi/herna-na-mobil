import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import db from '../../lib/db';
export async function getUserFromReq(req){
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;
  if(!token) return null;
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const r = await db.query('SELECT id,username,credits FROM users WHERE id=$1',[data.id]);
    if(r.rowCount===0) return null;
    return r.rows[0];
  }catch(e){ return null; }
}
