import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';


export default function Navbar(){
return (
<header className="navbar">
<div className="brand">
<Link to="/" className="brand-link">
<img src="/logo.png" alt="NHITM Logo" className="brand-logo"/>
<div className="brand-text">
<div className="college-name">New Horizon Institute of Technology & Management</div>
<div className="college-tag">Educere Excellere</div>
</div>
</Link>
</div>


<nav className="nav-links">
<NavLink to="/" end className={({isActive})=> isActive? 'active':''}>Home</NavLink>
<NavLink to="/new" className={({isActive})=> isActive? 'active':''}>New Assignment</NavLink>
<NavLink to="/about" className={({isActive})=> isActive? 'active':''}>About</NavLink>
</nav>
</header>
)
}