// Development-only Admin data. This is not persisted and is not an API response.
export const demoStats = [
  { label: 'Total students', value: '124', meta: '+8 this month', icon: 'users', tone: 'blue' },
  { label: 'Total scenarios', value: '10', meta: '2 drafts', icon: 'scenarios', tone: 'navy' },
  { label: 'Total attempts', value: '2,480', meta: '+12% this week', icon: 'attempts', tone: 'green' },
  { label: 'Average score', value: '88%', meta: 'Across published scenarios', icon: 'score', tone: 'amber' },
];

export const demoScenarios = [
  { id: 'scenario-1', title: 'Payment Gateway Meltdown', difficulty: 'Medium', questions: 30, status: 'Published', attempts: 342, completion: 82, updated: 'Today, 9:20 AM' },
  { id: 'scenario-2', title: 'Database Failure', difficulty: 'Hard', questions: 30, status: 'Draft', attempts: 0, completion: 0, updated: 'Yesterday' },
  { id: 'scenario-3', title: 'API Timeout', difficulty: 'Easy', questions: 30, status: 'Published', attempts: 287, completion: 91, updated: 'Oct 30, 2026' },
  { id: 'scenario-4', title: 'Observability During an Outage', difficulty: 'Medium', questions: 30, status: 'Published', attempts: 164, completion: 64, updated: 'Oct 28, 2026' },
];

export const demoStudents = [
  { id: 'ST001', name: 'Alex Developer', email: 'alex@devsprint.com', status: 'Active', score: 850, attempts: 5, joined: 'Sep 12, 2026' },
  { id: 'ST002', name: 'Jamie Tester', email: 'jamie@devsprint.com', status: 'Active', score: 620, attempts: 4, joined: 'Sep 18, 2026' },
  { id: 'ST003', name: 'Taylor Manager', email: 'taylor@devsprint.com', status: 'Inactive', score: 430, attempts: 2, joined: 'Oct 02, 2026' },
  { id: 'ST004', name: 'Nanda Win', email: 'nanda@devsprint.com', status: 'Active', score: 790, attempts: 6, joined: 'Oct 05, 2026' },
];

export const demoAttempts = [
  { scenario: 'Payment Gateway Meltdown', score: 85, date: '2 days ago', status: 'Completed', role: 'QA Engineer' },
  { scenario: 'Database Failure', score: 70, date: '1 week ago', status: 'Completed', role: 'Software Tester' },
  { scenario: 'API Timeout', score: 92, date: '2 weeks ago', status: 'Completed', role: 'Project Manager' },
];

export const demoAssignments = [
  { scenario: 'Payment Gateway Meltdown', audience: 'All Students (124)', deadline: 'Nov 17, 2026', status: 'Active', progress: '68 / 124' },
  { scenario: 'Database Failure', audience: 'QA Cohort', deadline: 'Nov 22, 2026', status: 'Scheduled', progress: '0 / 32' },
];

export const demoActivities = [
  { text: 'New student registered', detail: 'ST124 · Alex Developer', time: '2m ago', tone: 'blue' },
  { text: 'Scenario “Database Failure” updated', detail: 'Draft saved by Admin', time: '5m ago', tone: 'amber' },
  { text: 'New attempt from ST124', detail: 'Payment Gateway Meltdown · 85%', time: '8m ago', tone: 'green' },
];

export const demoFeedback = [
  { id: 'feedback-1', student: 'ST002', date: 'Nov 2, 2026', text: 'The scenario was really challenging but fun!', report: 'Positive difficulty feedback.' },
  { id: 'feedback-2', student: 'ST004', date: 'Oct 31, 2026', text: 'Maybe add more hints during the database phase.', report: 'Requested additional guidance.' },
];

export const demoMonitoring = [
  { student: 'ST005 · Nanda Win', scenario: 'Payment Gateway Meltdown', state: 'In Progress', started: '10:24 AM', events: ['Tab switched (10:26 AM)', 'Screen off (10:27 AM)'] },
  { student: 'ST001 · Alex Developer', scenario: 'API Timeout', state: 'Completed', started: '9:48 AM', events: ['Submitted (10:02 AM)'] },
];
