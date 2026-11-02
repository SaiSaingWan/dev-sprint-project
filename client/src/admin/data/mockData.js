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
  { id: 'ST001', name: 'Min Htet', email: 'min.htet@devsprint.com', status: 'Active', score: 850, attempts: 5, joined: 'Sep 12, 2026' },
  { id: 'ST002', name: 'May Thet Htar', email: 'may.thet.htar@devsprint.com', status: 'Active', score: 620, attempts: 4, joined: 'Sep 18, 2026' },
  { id: 'ST003', name: 'Ko Ko Aung', email: 'ko.ko.aung@devsprint.com', status: 'Inactive', score: 430, attempts: 2, joined: 'Oct 02, 2026' },
  { id: 'ST004', name: 'Thiri Mon', email: 'thiri.mon@devsprint.com', status: 'Active', score: 790, attempts: 6, joined: 'Oct 05, 2026' },
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
  { text: 'New student registered', detail: 'ST124 · Thiri Mon', time: '2m ago', tone: 'blue' },
  { text: 'Scenario “Database Failure” updated', detail: 'Draft saved by Admin', time: '5m ago', tone: 'amber' },
  { text: 'New attempt from ST124', detail: 'Payment Gateway Meltdown · 85%', time: '8m ago', tone: 'green' },
];

export const demoAiReports = [
  {
    id: 'report-1',
    student: 'ST001',
    name: 'Min Htet',
    role: 'Project Manager',
    scenario: 'Sprint 12 Scope Creep Crisis',
    score: 85,
    generatedAt: 'Nov 2, 2026',
    summary: 'Answers show good knowledge of Scrum roles and sprint prioritization. The student can identify scope risk and protect the sprint goal.',
    answerEvidence: 'Correctly selected a backlog discussion and stakeholder alignment before accepting new work.',
    strengths: ['Good understanding of Scrum roles and sprint goals', 'Clear stakeholder communication'],
    weaknesses: ['Needs deeper knowledge of estimation and capacity planning'],
    recommendation: 'Assign a Scrum planning scenario focused on story points and team capacity.',
  },
  {
    id: 'report-2',
    student: 'ST002',
    name: 'May Thet Htar',
    role: 'QA Engineer',
    scenario: 'Payment Gateway Meltdown',
    score: 78,
    generatedAt: 'Nov 2, 2026',
    summary: 'Answers show good knowledge of test boundaries and defect reproduction. The student investigates carefully before recommending a fix.',
    answerEvidence: 'Correctly prioritized reproducing the payment failure and checking affected system boundaries before closing the incident.',
    strengths: ['Strong edge-case thinking', 'Good evidence-based investigation'],
    weaknesses: ['Needs more knowledge of database locks and query performance'],
    recommendation: 'Assign a database troubleshooting scenario with production-like locking issues.',
  },
  {
    id: 'report-3',
    student: 'ST003',
    name: 'Ko Ko Aung',
    role: 'Software Tester',
    scenario: 'Database Failure',
    score: 64,
    generatedAt: 'Nov 1, 2026',
    summary: 'Answers show basic knowledge of regression testing, but the student needs support choosing test coverage during a database incident.',
    answerEvidence: 'Selected a smoke test approach but missed data-integrity checks for records affected by the migration.',
    strengths: ['Understands basic smoke-test priorities', 'Recognizes the need to verify a fix'],
    weaknesses: ['Needs stronger knowledge of data integrity and regression strategy'],
    recommendation: 'Review database validation techniques before the next advanced testing scenario.',
  },
];

export const demoMonitoring = [
  { student: 'ST005 · Thiri Mon', scenario: 'Payment Gateway Meltdown', state: 'In Progress', started: '10:24 AM', events: ['Tab switched (10:26 AM)', 'Screen off (10:27 AM)'] },
  { student: 'ST001 · Min Htet', scenario: 'API Timeout', state: 'Completed', started: '9:48 AM', events: ['Submitted (10:02 AM)'] },
];
