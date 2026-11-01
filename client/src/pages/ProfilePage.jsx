export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Profile & Sprint Archives</h1>
        <p className="text-slate-400 text-sm mt-1">Review past completed runs and PDF reports.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white">Alex Developer</h2>
        <p className="text-xs text-slate-400 mt-1">Student ID: #DEV-88492</p>
        <div className="mt-4 p-4 bg-slate-950 rounded-xl text-slate-400 text-xs">
          [ Retrospective PDF Download History placeholder - Page 4 detail ]
        </div>
      </div>
    </div>
  );
}