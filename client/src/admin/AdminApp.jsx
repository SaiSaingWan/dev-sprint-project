import { useMemo, useState } from 'react';
import {
  BarChart3, Bell, BookOpen, Check, ChevronLeft, ChevronRight, ClipboardList,
  FileText, FileUp, Gamepad2, LayoutDashboard, Menu, MoreVertical, Plus,
  Search, Settings, Shield, Sparkles, Target, UserRound, Users, X,
} from 'lucide-react';
import {
  demoActivities, demoAiReports, demoAssignments, demoAttempts, demoMonitoring,
  demoScenarios, demoStats, demoStudents,
} from './data/mockData';

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scenarios', label: 'Scenarios', icon: BookOpen },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'monitoring', label: 'Monitoring', icon: Target },
  { id: 'results', label: 'Results & Analytics', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback & Reports', icon: FileText },
];

const iconMap = { users: Users, scenarios: BookOpen, attempts: Target, score: BarChart3 };

function Brand() {
  return <div className="ad-brand"><span className="ad-brand-mark"><Gamepad2 size={18} /></span><span><strong>Dev<span>Sprint</span></strong><small>Admin Portal</small></span></div>;
}

function Sidebar({ page, setPage }) {
  return <aside className="ad-sidebar"><Brand /><p className="ad-nav-label">Manage · Monitor · Analyze</p><nav>{nav.map(({ id, label, icon: Icon }) => <button className={page === id ? 'ad-nav-link active' : 'ad-nav-link'} key={id} onClick={() => setPage(id)}><Icon size={17} /><span>{label}</span>{id === 'scenarios' && <b>2</b>}</button>)}</nav><div className="ad-sidebar-foot"><button className={page === 'settings' ? 'ad-nav-link active' : 'ad-nav-link'} onClick={() => setPage('settings')}><Settings size={17} /><span>Settings</span></button><div className="ad-account"><span>AD</span><div><strong>Admin account</strong><small>Administrator</small></div></div></div></aside>;
}

function Header({ onMenu }) {
  return <header className="ad-header"><button className="ad-icon ad-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={21} /></button><div className="ad-mobile-brand"><Brand /></div><div className="ad-search"><Search size={16} /><input placeholder="Search students, scenarios..." aria-label="Search" /></div><div className="ad-header-actions"><button className="ad-icon" aria-label="Notifications"><Bell size={18} /><i /></button><span className="ad-avatar">AD</span></div></header>;
}

function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  return <button type={type} className={`ad-button ${variant}`} onClick={onClick}>{children}</button>;
}

function PageTitle({ eyebrow, title, description, children }) {
  return <div className="ad-page-title"><div><p className="ad-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="ad-muted">{description}</p>}</div>{children}</div>;
}

function StatCards() {
  return <div className="ad-stats">{demoStats.map((stat) => { const Icon = iconMap[stat.icon]; return <div className="ad-stat" key={stat.label}><span className={`ad-stat-icon ${stat.tone}`}><Icon size={18} /></span><div><small>{stat.label}</small><strong>{stat.value}</strong><em>{stat.meta}</em></div></div>; })}</div>;
}

function Dashboard({ go }) {
  return <><PageTitle eyebrow="Monday, November 2, 2026" title="Welcome back, Admin!" description="Here is what is happening across your DevSprint workspace."><Button onClick={() => go('create-scenario')}><Plus size={16} /> Create Scenario</Button></PageTitle><StatCards /><div className="ad-dashboard-grid"><section className="ad-card"><div className="ad-card-head"><div><h2>Recent Activities</h2><p>Latest workspace updates</p></div><button className="ad-link">View all <ChevronRight size={14} /></button></div><div className="ad-activity-list">{demoActivities.map((item) => <div className="ad-activity" key={item.text}><span className={`ad-dot ${item.tone}`} /><div><strong>{item.text}</strong><small>{item.detail}</small></div><time>{item.time}</time></div>)}</div></section><section className="ad-card"><div className="ad-card-head"><div><h2>Quick Actions</h2><p>Common admin tasks</p></div></div><div className="ad-quick-grid"><button onClick={() => go('create-scenario')}><Plus size={18} /><span>Create Scenario<small>Build an assessment</small></span></button><button><FileUp size={18} /><span>Upload PDF<small>Local file selection</small></span></button><button onClick={() => go('create-scenario')}><Sparkles size={18} /><span>Generate with AI<small>Placeholder preview</small></span></button></div></section></div><section className="ad-card"><div className="ad-card-head"><div><h2>Recent Scenarios</h2><p>Scenario status and participation</p></div><button className="ad-link" onClick={() => go('scenarios')}>Manage scenarios <ChevronRight size={14} /></button></div><ScenarioTable scenarios={demoScenarios.slice(0, 3)} /></section><p className="ad-demo-note"><Shield size={14} /> Demo data for frontend development. It is not connected to Admin APIs.</p></>;
}

function ScenarioTable({ scenarios }) {
  return <div className="ad-table-wrap"><table><thead><tr><th>Scenario</th><th>Difficulty</th><th>Questions</th><th>Attempts</th><th>Status</th></tr></thead><tbody>{scenarios.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><small>{item.updated}</small></td><td><span className={`ad-badge ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span></td><td>{item.questions}</td><td>{item.attempts}</td><td><span className={`ad-status ${item.status.toLowerCase()}`}>{item.status}</span></td></tr>)}</tbody></table></div>;
}

function Scenarios({ go }) {
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('All');
  const visible = demoScenarios.filter((item) => (filter === 'All' || item.status === filter) && item.title.toLowerCase().includes(query.toLowerCase()));
  return <><PageTitle eyebrow="Manage" title="Scenario Management" description="Create, review, and publish assessments."><Button onClick={() => go('create-scenario')}><Plus size={16} /> Create Scenario</Button></PageTitle><section className="ad-card"><div className="ad-toolbar"><div className="ad-field-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scenarios..." /></div><div className="ad-tabs">{['All', 'Draft', 'Published'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="ad-scenario-list">{visible.map((item) => <article className="ad-scenario-card" key={item.id}><div className="ad-scenario-main"><span className={`ad-badge ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span><h2>{item.title}</h2><p>{item.questions} questions · {item.attempts} attempts · Updated {item.updated}</p></div><span className={`ad-status ${item.status.toLowerCase()}`}>{item.status}</span><button className="ad-icon" aria-label={`More actions for ${item.title}`}><MoreVertical size={18} /></button><div className="ad-scenario-actions"><button onClick={() => go('create-scenario')}>Edit</button><button>Preview</button></div></article>)}</div></section></>;
}

function CreateScenario({ go }) {
  const [form, setForm] = useState({ title: '', description: '', difficulty: '' }); const [file, setFile] = useState(''); const [generated, setGenerated] = useState(false); const [message, setMessage] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = (event, status) => { event.preventDefault(); if (!form.title.trim() || !form.description.trim() || !form.difficulty) { setMessage('Add a title, description, and difficulty before saving.'); return; } setMessage(`Scenario saved as a temporary ${status.toLowerCase()} in local React state.`); };
  return <><PageTitle eyebrow="Scenarios" title="Create Scenario" description="Build a complete 30-question assessment across three roles."><button className="ad-link" onClick={() => go('scenarios')}><ChevronLeft size={15} /> Back to scenarios</button></PageTitle><form className="ad-form-layout" onSubmit={(e) => save(e, 'Draft')}><section className="ad-card ad-form-card"><label>Scenario title *<input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Database Failure" /></label><label>Description *<textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Enter scenario description..." rows="4" /></label><label>Difficulty *<select value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)}><option value="">Select difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label><div><label>Upload PDF</label><label className="ad-upload"><FileUp size={22} /><strong>{file || 'Drag and drop PDF here'}</strong><small>{file ? 'Selected locally; not uploaded to a server.' : 'or click to choose a local file'}</small><input type="file" accept=".pdf,application/pdf" onChange={(e) => setFile(e.target.files?.[0]?.name || '')} /></label></div><div className="ad-form-actions"><Button variant="secondary" onClick={(e) => save(e, 'Draft')}>Save Draft</Button><Button type="submit">Publish</Button></div>{message && <p className="ad-form-message">{message}</p>}</section><aside className="ad-card ad-role-card"><div className="ad-card-head"><div><h2>Role structure</h2><p>Required for every complete scenario</p></div></div>{['QA Engineer', 'Software Tester', 'Project Manager'].map((role) => <div className="ad-role" key={role}><span><Check size={15} /></span><strong>{role}</strong><em>10 questions</em></div>)}<div className="ad-generated"><div className="ad-card-head"><h2>Generated content preview</h2><button className="ad-link" onClick={() => setGenerated(true)}><Sparkles size={14} /> Generate</button></div>{generated ? <p>Sample AI placeholder: identify the incident, communicate impact, choose a safe mitigation, and verify recovery.</p> : <p>AI generation is a frontend placeholder. No AI API is called.</p>}</div></aside></form></>;
}

function Students({ go }) {
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('All');
  const visible = demoStudents.filter((student) => (filter === 'All' || student.status === filter) && `${student.name} ${student.email} ${student.id}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageTitle eyebrow="Manage" title="Student Management" description="Search students and review their performance."><span className="ad-count">{demoStudents.length} demo students</span></PageTitle><section className="ad-card"><div className="ad-toolbar"><div className="ad-field-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, or ID..." /></div><div className="ad-tabs">{['All', 'Active', 'Inactive'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="ad-student-list">{visible.map((student) => <button className="ad-student-row" key={student.id} onClick={() => go('student-details', student)}><span className="ad-student-avatar"><UserRound size={20} /></span><span><strong>{student.id} · {student.name}</strong><small>{student.email}</small><em className={student.status.toLowerCase()}>{student.status}</em></span><b>Score: {student.score}</b><ChevronRight size={17} /></button>)}</div></section></>;
}

function StudentDetails({ student, go }) {
  const current = student || demoStudents[0];
  return <><PageTitle eyebrow="Students" title="Student Details" description={`${current.id} · ${current.email}`}><button className="ad-link" onClick={() => go('students')}><ChevronLeft size={15} /> Back to students</button></PageTitle><section className="ad-profile ad-card"><span className="ad-profile-avatar"><UserRound size={30} /></span><div><h2>{current.name}</h2><p>{current.id} · {current.email}</p><span className={`ad-status ${current.status.toLowerCase()}`}>{current.status}</span></div></section><div className="ad-detail-grid"><section className="ad-card"><div className="ad-card-head"><h2>Performance Summary</h2></div><div className="ad-mini-stats"><div><small>Attempts</small><strong>{current.attempts}</strong></div><div><small>Highest score</small><strong>{current.score}</strong></div></div></section><section className="ad-card"><div className="ad-card-head"><h2>Recent Attempts</h2></div>{demoAttempts.map((attempt) => <div className="ad-attempt" key={attempt.scenario}><span><strong>{attempt.scenario}</strong><small>{attempt.role} · {attempt.date}</small></span><b>{attempt.score}%</b></div>)}</section></div></>;
}

function Assignments() {
  const [assigned, setAssigned] = useState(false); return <><PageTitle eyebrow="Manage" title="Assignment Management" description="Schedule scenarios for students or cohorts." /><section className="ad-form-layout"><form className="ad-card ad-form-card" onSubmit={(e) => { e.preventDefault(); setAssigned(true); }}><label>Select scenario<select><option>Payment Gateway Meltdown</option><option>Database Failure</option></select></label><label>Select students<select><option>All Students (124)</option><option>QA Cohort (32)</option><option>Software Tester Cohort (28)</option></select></label><div className="ad-two-fields"><label>Start date<input type="date" defaultValue="2026-11-10" /></label><label>Deadline<input type="date" defaultValue="2026-11-17" /></label></div><Button type="submit">Assign scenario</Button>{assigned && <p className="ad-form-message">Assignment created temporarily in local React state. No backend persistence was performed.</p>}</form><section className="ad-card"><div className="ad-card-head"><div><h2>Previous Assignments</h2><p>Demo assignment history</p></div></div>{demoAssignments.map((item) => <div className="ad-assignment" key={item.scenario}><div><strong>{item.scenario}</strong><small>{item.audience} · Due {item.deadline}</small></div><span className={`ad-status ${item.status.toLowerCase()}`}>{item.status}</span><em>{item.progress}</em></div>)}</section></section></>;
}

function Monitoring() {
  return <><PageTitle eyebrow="Monitor" title="Monitoring" description="Review attempt activity and completion status."><span className="ad-demo-pill"><Shield size={14} /> Demo events</span></PageTitle><StatCards /><section className="ad-card"><div className="ad-card-head"><div><h2>Activity Timeline</h2><p>Events are evidence of activity, not definitive proof of cheating.</p></div></div>{demoMonitoring.map((item) => <article className="ad-monitor" key={item.student}><div className="ad-monitor-head"><div><strong>{item.student}</strong><small>{item.scenario} · Started {item.started}</small></div><span className={`ad-status ${item.state === 'Completed' ? 'published' : 'draft'}`}>{item.state}</span></div><ul>{item.events.map((event) => <li key={event}>{event}</li>)}</ul></article>)}</section></>;
}

function Results() {
  return <><PageTitle eyebrow="Analyze" title="Results & Analytics" description="Demo performance trends across roles."><Button variant="secondary" onClick={() => window.alert('Report export is not implemented yet.')}>Download Report</Button></PageTitle><div className="ad-result-grid"><section className="ad-card"><div className="ad-mini-stats"><div><small>Average score</small><strong>88%</strong></div><div><small>Completion</small><strong>92%</strong></div></div><h2 className="ad-section-label">Score distribution</h2><div className="ad-bars">{[32, 54, 74, 62, 88, 70].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div></section><section className="ad-card"><div className="ad-card-head"><h2>By Role</h2></div>{[['QA Engineer', '90%'], ['Software Tester', '87%'], ['Project Manager', '86%']].map(([role, score]) => <div className="ad-role-line" key={role}><span>{role}</span><b>{score}</b></div>)}</section></div><section className="ad-card"><div className="ad-card-head"><h2>Top Students</h2></div>{demoStudents.slice().sort((a, b) => b.score - a.score).map((student, index) => <div className="ad-rank" key={student.id}><b>{index + 1}</b><span>{student.name}<small>{student.id}</small></span><strong>{student.score}</strong></div>)}</section></>;
}

function Feedback() {
  const [selected, setSelected] = useState(null); return <><PageTitle eyebrow="Analyze" title="AI Student Reviews" description="Review role-specific analysis generated from each student's scenario answers."><span className="ad-demo-pill"><Sparkles size={14} /> Demo answer analysis</span></PageTitle><div className="ad-feedback-layout"><section className="ad-card"><div className="ad-card-head"><div><h2>Student answer reviews</h2><p>Generated from demo scenario answers and scores</p></div></div>{demoAiReports.map((item) => <button className={selected?.id === item.id ? 'ad-feedback active' : 'ad-feedback'} key={item.id} onClick={() => setSelected(item)}><span className="ad-student-avatar"><UserRound size={18} /></span><span><strong>{item.student} · {item.name}</strong><small>{item.role} · {item.scenario} · {item.score}%</small><em>{item.summary}</em></span><ChevronRight size={16} /></button>)}</section><section className="ad-card ad-feedback-detail"><h2>{selected ? `Review · ${selected.name}` : 'Select a student review'}</h2>{selected ? <><p className="ad-muted">{selected.student} · {selected.role} · {selected.scenario} · {selected.score}%</p><blockquote>{selected.summary}</blockquote><div className="ad-report-section"><strong>Answer evidence</strong><p>{selected.answerEvidence}</p></div><div className="ad-report-section"><strong>Demonstrated strengths</strong>{selected.strengths.map((item) => <p key={item}><Check size={14} /> {item}</p>)}</div><div className="ad-report-section"><strong>Knowledge gaps</strong>{selected.weaknesses.map((item) => <p key={item}><Target size={14} /> {item}</p>)}</div><div className="ad-report-section"><strong>Recommended next step</strong><p>{selected.recommendation}</p></div></> : <p className="ad-muted">Choose a student to inspect the role-specific answer review.</p>}</section></div><p className="ad-demo-note"><Shield size={14} /> Demo answer analysis only. No AI provider is connected; real reviews will require submitted answers and an Admin analysis service.</p></>;
}

function SettingsPage() {
  return <><PageTitle eyebrow="Configure" title="Settings" description="Admin profile and workspace preferences." /><div className="ad-settings-grid">{['Admin profile', 'General settings', 'AI Provider & Model', 'Notification settings', 'Security settings', 'About DevSprint'].map((item) => <section className="ad-card ad-setting" key={item}><span><Settings size={18} /></span><div><h2>{item}</h2><p>{item === 'AI Provider & Model' ? 'Placeholder controls only. No API keys are exposed.' : 'Manage this area of the Admin workspace.'}</p></div><ChevronRight size={17} /></section>)}</div></>;
}

export default function AdminApp() {
  const [page, setPage] = useState('dashboard'); const [drawer, setDrawer] = useState(false); const [student, setStudent] = useState(null);
  const go = (next, selectedStudent) => { if (next === 'student-details') setStudent(selectedStudent); setPage(next); setDrawer(false); };
  const pageContent = useMemo(() => {
    if (page === 'dashboard') return <Dashboard go={go} />; if (page === 'scenarios') return <Scenarios go={go} />; if (page === 'create-scenario') return <CreateScenario go={go} />; if (page === 'students') return <Students go={go} />; if (page === 'student-details') return <StudentDetails student={student} go={go} />; if (page === 'assignments') return <Assignments go={go} />; if (page === 'monitoring') return <Monitoring />; if (page === 'results') return <Results />; if (page === 'feedback') return <Feedback />; return <SettingsPage />;
  }, [page, student]);
  return <div className="ad-shell"><Sidebar page={page} setPage={go} /><div className="ad-main"><Header onMenu={() => setDrawer(true)} /><main className="ad-content">{pageContent}</main><nav className="ad-bottom-nav">{nav.slice(0, 5).map(({ id, label, icon: Icon }) => <button className={page === id ? 'active' : ''} key={id} onClick={() => go(id)}><Icon size={18} /><span>{label.split(' ')[0]}</span></button>)}</nav></div>{drawer && <div className="ad-drawer-layer"><button className="ad-backdrop" onClick={() => setDrawer(false)} aria-label="Close navigation" /><aside className="ad-drawer"><div className="ad-drawer-head"><Brand /><button className="ad-icon" onClick={() => setDrawer(false)} aria-label="Close navigation"><X size={20} /></button></div>{nav.map(({ id, label, icon: Icon }) => <button className={page === id ? 'ad-nav-link active' : 'ad-nav-link'} key={id} onClick={() => go(id)}><Icon size={17} /><span>{label}</span></button>)}<button className="ad-nav-link" onClick={() => go('settings')}><Settings size={17} /><span>Settings</span></button></aside></div>}</div>;
}
