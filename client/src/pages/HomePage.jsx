import { Megaphone, Trophy, ArrowRight, Activity } from 'lucide-react';

export default function HomePage({ onNavigateToMissions }) {
  return (
    <div className="space-y-6">
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-sky-900/50 via-slate-900 to-slate-900 border border-sky-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <span className="bg-sky-500/20 text-sky-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-sky-500/30 mb-3 inline-flex items-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5" /> Ajarn Announcement
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">New Midterm Crisis Scenario Live!</h1>
        <p className="text-slate-300 text-sm mt-2">
          "Microservice Meltdown: Production Outage" is ready for testing.
        </p>
        <button 
          onClick={onNavigateToMissions}
          className="mt-4 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl transition flex items-center gap-2"
        >
          <span>Browse All Scenarios</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Content Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Global Leaderboard
          </h2>
          <div className="text-slate-400 text-sm p-4 bg-slate-950 rounded-xl border border-slate-800">
            [ Leaderboard items placeholder - Page 1 detail ]
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" /> Sprint Summary
          </h2>
          <div className="text-slate-400 text-sm p-4 bg-slate-950 rounded-xl border border-slate-800">
            [ Player high score summary placeholder ]
          </div>
        </div>
      </div>
    </div>
  );
}