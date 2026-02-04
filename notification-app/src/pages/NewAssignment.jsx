import React, { useState } from 'react';
import './NewAssignment.css';
import { subjects } from '../data/assignments';


export default function NewAssignment(){
const [form, setForm] = useState({subject:subjects[0],title:'',description:'',link:''});
const [doubts, setDoubts] = useState([]);


const submitPost = (e) =>{
e.preventDefault();
// For now we just add to local doubts list
setDoubts(prev => [{...form, id:Date.now(), created:new Date().toISOString()}, ...prev]);
setForm({...form,title:'',description:'',link:''});
}


return (
<div className="new-page">
<div className="new-panel">
<h2>Post a Doubt / Add Learning Material</h2>
<form onSubmit={submitPost} className="new-form">
<label>Subject
<select value={form.subject} onChange={(e)=>setForm(f=>({...f,subject:e.target.value}))}>
{subjects.map(s=> <option key={s} value={s}>{s}</option>)}
</select>
</label>


<label>Title
<input value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} required />
</label>


<label>Description
<textarea value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} rows={4} />
</label>


<label>Resource Link (YouTube / Drive)
<input value={form.link} onChange={(e)=>setForm(f=>({...f,link:e.target.value}))} placeholder="https://" />
</label>


<div className="form-row">
<button className="btn primary" type="submit">Post to Mentor</button>
<button type="button" className="btn ghost" onClick={()=>{setForm({subject:subjects[0],title:'',description:'',link:''})}}>Reset</button>
</div>
</form>
</div>


<aside className="doubts-panel">
<h3>Recent Posts</h3>
{doubts.length === 0 ? <p className="muted">No posts yet. Student doubts and resources will show here.</p> : (
<ul className="doubts-list">
{doubts.map(d=> (
<li key={d.id} className="doubt-item">
<div className="dhead"><strong>{d.title}</strong> <span className="sub">{d.subject}</span></div>
<div className="ddesc">{d.description}</div>
{d.link && <div className="dlink"><a href={d.link} target="_blank" rel="noreferrer">Open Resource</a></div>}
<div className="dmeta">Posted: {new Date(d.created).toLocaleString()}</div>
</li>
))}
</ul>
)}
</aside>
</div>
)
}