import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SprintRunnerModal from '../components/SprintRunnerModal';
import { Play, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function MissionsPage() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal Selection States
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRoleKey, setSelectedRoleKey] = useState('QA');
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const querySnapshot = await getDocs(collection(db, 'scenarios'));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ firestoreId: doc.id, ...doc.data() });
        });
        setScenarios(docs);
      } catch (err) {
        console.error("Error fetching scenarios:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchScenarios();
  }, []);

  const filteredScenarios = scenarios.filter((s) => {
    if (activeFilter === 'All') return true;
    return s.difficulty === activeFilter;
  });

  const handleOpenRoleModal = (sc) => {
    setSelectedScenario(sc);
    setSelectedRoleKey('QA');
    setIsRoleModalOpen(true);
  };

  const handleStartRunner = () => {
    setIsRoleModalOpen(false);
    setIsRunnerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sky-400 font-medium animate-pulse flex items-center space-x-2">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Loading Scenarios from Firestore...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Scenario Test Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">Select a scenario to launch a timed assessment with interactive narrative decision trees.</p>
        </div>

        {/* FILTER PILLS */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 border border-slate-800 rounded-xl self-start md:self-auto">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeFilter === filter
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* SCENARIO CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScenarios.map((sc) => {
          const diffColor =
            sc.difficulty === 'Beginner'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : sc.difficulty === 'Intermediate'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

          return (
            <div
              key={sc.firestoreId || sc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`${diffColor} border text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase`}>
                    {sc.difficulty} • {sc.timeLimitMinutes || 15} Mins
                  </span>
                  <span className="text-xs font-mono text-slate-500">10 Questions / Role</span>
                </div>
                <h3 className="text-xl font-bold text-white">{sc.title}</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{sc.description}</p>

                <div className="mt-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Available Assessment Roles
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>QA Engineer:</span> <strong className="text-emerald-400">10 Questions</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Software Tester:</span> <strong className="text-sky-400">10 Questions</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Programmer:</span> <strong className="text-purple-400">10 Questions</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenRoleModal(sc)}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Select Role & Start Test</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: ROLE SELECTION MODAL */}
      {isRoleModalOpen && selectedScenario && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedScenario.difficulty}
                </span>
                <h3 className="font-extrabold text-white text-lg mt-1">{selectedScenario.title}</h3>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select Your Target Role:
              </label>
              <div className="space-y-3">
                {[
                  { key: 'QA', title: 'QA Engineer', desc: 'Focus: Edge-cases & System Boundaries' },
                  { key: 'Tester', title: 'Software Tester', desc: 'Focus: Automated scripts & Assertions' },
                  { key: 'Programmer', title: 'Programmer / Developer', desc: 'Focus: Hotfixes & DB Query Optimization' },
                ].map((r) => (
                  <label
                    key={r.key}
                    onClick={() => setSelectedRoleKey(r.key)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedRoleKey === r.key
                        ? 'border-sky-500 bg-sky-950/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="selected-role"
                        checked={selectedRoleKey === r.key}
                        onChange={() => setSelectedRoleKey(r.key)}
                        className="text-sky-600 focus:ring-0 accent-sky-500"
                      />
                      <div>
                        <div className="font-bold text-sm text-white">{r.title}</div>
                        <div className="text-[11px] text-slate-400">{r.desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-sky-400 flex items-center space-x-1">
                <ShieldAlert className="w-4 h-4 mr-1 text-amber-400" /> Assessment Rules:
              </p>
              <p>• <strong>10 Sequential Crisis Questions</strong></p>
              <p>• Time Limit: <strong>{selectedScenario.timeLimitMinutes || 15} Minutes</strong></p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="w-1/3 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStartRunner}
                className="w-2/3 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-sky-600/20"
              >
                Start Scenario Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXTRACTED TEST RUNNER MODAL */}
      {isRunnerOpen && selectedScenario && (
        <SprintRunnerModal
          scenario={selectedScenario}
          roleKey={selectedRoleKey}
          onClose={() => setIsRunnerOpen(false)}
        />
      )}
    </div>
  );
}