import React from 'react';
import { useParams } from 'react-router-dom';
import { assignments } from '../data/assignments';
import './SubjectPage.css';


export default function SubjectPage(){
const { code } = useParams();
const list = assignments.filter(a => a.subject === code).slice(0,6);


return (
<div className="subject-page">
<div className="subject-header">
<h2>{code} - {subjectFullName(code)}</h2>
<p className="muted">Showing 6 assignments for this subject</p>
</div>


<div className="assign-grid">
{list.map(a => (
<article key={a.id} className={`assign-card ${a.status}`}>
<div className="card-top">
<h3>{a.title}</h3>
<div className="status">{a.status}</div>
</div>
<p className="desc">{a.description}</p>
<div className="meta-row">
<div>Due: <strong>{a.dueDate}</strong></div>
<div>
<button className="link-btn" onClick={(e)=>{alert('Open assignment details (mock).')}}>Open</button>
</div>
</div>
</article>
))}
</div>
</div>
)
}


function subjectFullName(code){
const map = {
AOA: 'Analysis of Algorithms',
COA: 'Computer Organization & Architecture',
DSGT: 'Data Structures & Graph Theory',
FSJP: 'Fundamentals of Software & Java Programming',
ED: 'Engineering Drawing',
ESE: 'Engineering Science & Ethics'
}
return map[code] || code;
}