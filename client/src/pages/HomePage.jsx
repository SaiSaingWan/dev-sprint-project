import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Megaphone, Trophy, ArrowRight, Activity, Award, Sparkles, Zap } from 'lucide-react';

export default function HomePage({ onNavigateToMissions }) {
  const [latestScenario, setLatestScenario] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        // Parallel fetching: 1 pre-calculated cache document + 1 current user document
        const [dashSnap, userSnap] = await Promise.all([
          getDoc(doc(db, 'system', 'home_dashboard')),
          getDoc(doc(db, 'users', 'user_test_client'))
        ]);

        if (dashSnap.exists()) {
          const dashData = dashSnap.data();
          setLatestScenario(dashData.latestScenario);
          setLeaderboard(dashData.topPlayers || []);
        }

        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        }
      } catch (err) {
        console.error("Error loading home dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sky-400 font-medium animate-pulse flex items-center space-x-2">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Loading Home Dashboard...</span>
        </div>
      </div>
    );
  }

  // Quick top role check
  const roleExp = userProfile?.roleExp || { QA: 0, Tester: 0, Programmer: 0 };
  const topRole = Object.keys(roleExp).reduce((a, b) => (roleExp[a] > roleExp[b] ? a : b), 'QA');

  return (
    <div className="space-y-6">
      {/* 1. LATEST SCENARIO ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-sky-900/60 via-slate-900 to-slate-900 border border-sky-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <span className="bg-sky-500/20 text-sky-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-sky-500/30 mb-3 inline-flex items-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5 text-sky-400" /> Ajarn Announcement
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          {latestScenario ? latestScenario.title : 'New Assessment Live!'}
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
          {latestScenario ? latestScenario.description : 'Test your software engineering instincts under real-time production outages.'}
        </p>
        <button 
          onClick={onNavigateToMissions}
          className="mt-5 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-sky-600/20 flex items-center gap-2"
        >
          <span>Launch Scenario Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. GRID CONTENT: LEADERBOARD & SPRINT SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PRE-COMPUTED GLOBAL LEADERBOARD */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Global Leaderboard (Top 5)
          </h2>

          {leaderboard.length > 0 ? (
            <div className="space-y-2.5">
              {leaderboard.map((user, rank) => (
                <div 
                  key={user.id} 
                  className={`flex items-center justify-between p-3.5 rounded-xl border ${
                    user.id === 'user_test_client' 
                      ? 'bg-sky-950/40 border-sky-500/50' 
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      rank === 0 ? 'bg-amber-400 text-slate-950' :
                      rank === 1 ? 'bg-slate-300 text-slate-950' :
                      rank === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{rank + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {user.displayName || 'Alex Developer'}
                        {user.id === 'user_test_client' && (
                          <span className="text-[9px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-bold uppercase border border-sky-500/30">You</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {user.studentId || user.id}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-sky-400 font-mono">{user.totalExp || 0} EXP</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 bg-slate-950 rounded-xl border border-slate-800">
              No leaderboard entries found in cache. Run node seedDashboard.js on server.
            </div>
          )}
        </div>

        {/* PERSONAL SPRINT SUMMARY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" /> Player Sprint Summary
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Lifetime EXP</span>
                <div className="text-2xl font-black text-sky-400 font-mono mt-0.5">
                  {userProfile?.totalExp || 0} EXP
                </div>
              </div>
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Top Performing Role</span>
                <div className="text-sm font-bold text-white mt-0.5">{topRole} Engineer</div>
              </div>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">High Score Status</span>
              <div className="text-xs text-slate-300">
                Active Scenarios Played: <strong className="text-sky-400">{Object.keys(userProfile?.highScores || {}).length}</strong>
              </div>
            </div>

            <button
              onClick={onNavigateToMissions}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 border border-slate-700"
            >
              <span>Practice Next Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}