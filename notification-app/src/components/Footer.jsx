import React from 'react';
import './Footer.css';


export default function Footer(){
return (
<footer className="site-footer">
<div className="footer-inner">
<div>© {new Date().getFullYear()} Mrigesh Koyande — All rights reserved.</div>
<div className="small">Built for New Horizon Institute of Technology & Management</div>
</div>
</footer>
)
}