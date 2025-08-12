import {useEffect, useState} from 'react'
export default function Home(){
  const [user,setUser]=useState(null);
  const [credits,setCredits]=useState('-');
  const [u,setU]=useState(''); const [p,setP]=useState('');
  const [cfBet,setCfBet]=useState(''); const [slotsBet,setSlotsBet]=useState(''); const [rBet,setRBet]=useState('');
  const [cfRes,setCfRes]=useState(''); const [slotsRes,setSlotsRes]=useState(''); const [rRes,setRRes]=useState('');

  useEffect(()=>{fetch('/api/me').then(r=>r.json()).then(j=>{ if(j.logged){ setUser(j.user); setCredits(j.user.credits) } else setUser(null) }) },[])

  async function reg(){ const res=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})}); const j=await res.json(); alert(JSON.stringify(j)); await me(); }
  async function login(){ const res=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})}); const j=await res.json(); alert(JSON.stringify(j)); await me(); }
  async function logout(){ await fetch('/api/logout',{method:'POST'}); await me(); }
  async function me(){ const r=await fetch('/api/me'); const j=await r.json(); if(j.logged){ setUser(j.user); setCredits(j.user.credits) } else { setUser(null); setCredits('-') } }

  async function playCoin(){ const res=await fetch('/api/play/coinflip',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bet: Number(cfBet), choice: 'heads'})}); const j=await res.json(); setCfRes(JSON.stringify(j)); me(); }
  async function playSlots(){ const res=await fetch('/api/play/slots',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bet: Number(slotsBet)})}); const j=await res.json(); setSlotsRes(JSON.stringify(j)); me(); }
  async function playRoulette(){ const res=await fetch('/api/play/roulette',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bet: Number(rBet), type:'color', value:'red'})}); const j=await res.json(); setRRes(JSON.stringify(j)); me(); }

  return <div className="container">
    <h1>Casino Demo (virtual credits) — Next.js + Postgres ready</h1>
    <div className="auth">
      <input placeholder="username" value={u} onChange={e=>setU(e.target.value)}/>
      <input placeholder="password" type="password" value={p} onChange={e=>setP(e.target.value)}/>
      <button onClick={reg}>Register</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <div>{user ? 'Hi '+user.username : 'Not logged'}</div>
    </div>
    <div style={{display: user ? 'block':'none'}} className="games">
      <h2>Credits: {credits}</h2>
      <section><h3>Coinflip</h3><input placeholder="bet" value={cfBet} onChange={e=>setCfBet(e.target.value)}/><button onClick={playCoin}>Play (heads)</button><div>{cfRes}</div></section>
      <section><h3>Slots</h3><input placeholder="bet" value={slotsBet} onChange={e=>setSlotsBet(e.target.value)}/><button onClick={playSlots}>Spin</button><div>{slotsRes}</div></section>
      <section><h3>Roulette</h3><input placeholder="bet" value={rBet} onChange={e=>setRBet(e.target.value)}/><button onClick={playRoulette}>Spin (red)</button><div>{rRes}</div></section>
    </div>
    <footer><small>Demo only — NO real money.</small></footer>
  </div>
}
