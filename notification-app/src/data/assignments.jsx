export const subjects = [
'AOA','COA','DSGT','FSJP','ED','ESE'
];


// generate 6 assignments per subject (mock data)
const makeAssignments = (subject) => {
const baseDate = new Date();
return Array.from({length:6}, (_,i) => {
const due = new Date(baseDate);
due.setDate(baseDate.getDate() + (i+3));
const status = i % 3 === 0 ? 'pending' : (i % 3 === 1 ? 'late' : 'done');
return {
id: `${subject}-${i+1}`,
subject,
title: `${subject} Assignment ${i+1}`,
description: `This is the description for ${subject} assignment ${i+1}.`,
dueDate: due.toISOString().split('T')[0],
status
}
})
}


export const assignments = subjects.flatMap(s => makeAssignments(s));