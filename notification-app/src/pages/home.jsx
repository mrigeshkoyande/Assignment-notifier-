import React from 'react';
import { Link } from 'react-router-dom';
import { subjects } from '../data/assignments';
import './Home.css';


export default function Home(){
	return (
		<div className="home">
			<section className="hero">
				<div className="hero-left">
					<h1>Assignment Dashboard</h1>
					<p className="lead">Welcome to the NHITM assignment tracker — Manage assignments, ask doubts, and share learning materials.</p>
					<div className="cta-row">
						<Link to="/new" className="btn primary">Post New</Link>
						<Link to="/about" className="btn ghost">About</Link>
					</div>
				</div>
				<div className="hero-right">
					<img src="/logo.png" alt="logo" />
				</div>
			</section>


			<section className="subjects">
				<h2>Subjects</h2>
				<div className="subject-grid">
					{subjects.map(s => (
						<Link to={`/subject/${s}`} key={s} className="subject-card">
							<div className="subject-code">{s}</div>
							<div className="subject-name">{subjectFullName(s)}</div>
							<div className="subject-meta">6 assignments</div>
						</Link>
					))}
				</div>
			</section>
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