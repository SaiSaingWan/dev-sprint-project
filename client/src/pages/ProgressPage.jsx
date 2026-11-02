import { useState, useEffect } from 'react';
import { getOrCreateUserProfile } from '../services/userService';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { TrendingUp, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProgressPage() {
  const [profile, setProfile] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getOrCreateUserProfile('user_test_client');
        setProfile(user);

        const scSnap = await getDocs(collection(db, 'scenarios'));
        const scList = [];
        scSnap.forEach((doc) => scList.push({ id: doc.id, ...doc.data() }));
        setScenarios(scList);
      } catch (err) {
        console.error("Error loading progress data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sky-400 font-medium animate-pulse flex items-center space-x-2">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Loading Career Progress Matrix...</span>
        </div>
      </div>
    );
  }

  const roleExp = profile?.roleExp || { QA: 0, Tester: 0, Programmer: 0 };
  const highScores = profile?.highScores || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Career Progress & Skill Matrix</h1>
        <p className="text-slate-400 text-sm mt-1">Track your competency levels across engineering roles and complete high scores.</p>
      </div>

      {/* Role Progression Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { key: 'QA', title: 'QA Engineer', color: 'emerald', exp: roleExp.QA || 0 },
          { key: 'Tester', title: 'Software Tester', color: 'sky', exp: roleExp.Tester || 0 },
          { key: 'Programmer', title: 'Programmer / Developer', color: 'purple', exp: roleExp.Programmer || 0 },
        ].map((role) => {
          const maxExp = 1000;
          const percent = Math.min(100, Math.round((role.exp / maxExp) * 100));

          return (
            <div key={role.key} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase">{role.title}</span>
                <span className="text-xs font-mono text-sky-400 font-bold">{role.exp} / {maxExp} EXP</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full bg-${role.color}-500 transition-all duration-500`} 
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>Progress to Tier 2</span>
                <strong className="text-slate-200">{percent}%</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scenario High Score Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" /> Scenario High-Score Matrix Table
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                <th className="py-3 px-4">Scenario Title</th>
                <th className="py-3 px-4 text-center">QA Engineer</th>
                <th className="py-3 px-4 text-center">Software Tester</th>
                <th className="py-3 px-4 text-center">Programmer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {scenarios.map((sc) => {
                const qaScore = highScores[`${sc.id}_QA`] || 0;
                const testerScore = highScores[`${sc.id}_Tester`] || 0;
                const progScore = highScores[`${sc.id}_Programmer`] || 0;

                return (
                  <tr key={sc.id} className="hover:bg-slate-950/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {sc.title}
                      <span className="block text-[10px] text-slate-500 font-normal">{sc.difficulty}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={qaScore > 0 ? 'text-emerald-400' : 'text-slate-600'}>
                        {qaScore > 0 ? `${qaScore}/100` : '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={testerScore > 0 ? 'text-sky-400' : 'text-slate-600'}>
                        {testerScore > 0 ? `${testerScore}/100` : '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={progScore > 0 ? 'text-purple-400' : 'text-slate-600'}>
                        {progScore > 0 ? `${progScore}/100` : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}