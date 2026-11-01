export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Career Progress & Role Matrix</h1>
        <p className="text-slate-400 text-sm mt-1">EXP accumulated per role.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-emerald-400">QA Engineer</span>
          <div className="text-3xl font-black text-white mt-2">520 / 1,000 EXP</div>
          <div className="mt-2 text-slate-400 text-xs">[ QA Progress Bar placeholder ]</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">📊 High Score Matrix Table</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-slate-400 text-xs">
          [ Matrix Table placeholder - Page 3 detail ]
        </div>
      </div>
    </div>
  );
}