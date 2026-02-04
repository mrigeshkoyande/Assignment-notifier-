import React from 'react';
import './About.css';


export default function About(){
return (
<div className="about-page">
<header className="about-header">
<img src="/logo.png" alt="logo" />
<div>
<h2>New Horizon Institute of Technology & Management</h2>
<p className="muted">Educere Excellere</p>
</div>
</header>


<section className="about-content">
<h3>About the Classroom</h3>
<p>This is a mock assignment classroom built for the NHITM students and faculty. It demonstrates how assignments can be managed in a clean, modern dashboard. The system will later integrate with Google Classroom for live data.</p>


<ul className="info-list">
<li><strong>Total students in classroom:</strong> 75</li>
<li><strong>Department:</strong> Computer Science & Engineering</li>
<li><strong>Contact:</strong> office@nhitm.edu.in</li>
</ul>
</section>
</div>
)
}