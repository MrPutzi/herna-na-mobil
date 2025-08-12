import cookie from 'cookie';
export default function handler(req,res){
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {httpOnly:true, path:'/', sameSite:'lax', maxAge:0}));
  res.json({ok:true});
}
