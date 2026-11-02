import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import CertificateModal from '../components/CertificateModal';
import { FileText, Award, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const [scenarios, setScenarios] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Accordion State for expanded scenarios
  const [expandedScenarioId, setExpandedScenarioId] = useState(null);

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    async function fetchReportsData() {
      try {
        // 1. Fetch scenarios catalog
        const scSnap = await getDocs(collection(db, 'scenarios'));
        const scDocs = [];
        scSnap.forEach((doc) => scDocs.push({ id: doc.id, ...doc.data() }));
        setScenarios(scDocs);

        // 2. Fetch User Profile
        const userSnap = await getDoc(doc(db, 'users', 'user_test_client'));
        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        }

        // 3. Fetch User Attempts history
        const attSnap = await getDocs(collection(db, 'users', 'user_test_client', 'attempts'));
        const attDocs = [];
        attSnap.forEach((doc) => attDocs.push({ id: doc.id, ...doc.data() }));
        setAttempts(attDocs);
      } catch (err) {
        console.error('Error fetching reports data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReportsData();
  }, []);

  // Filter played scenarios (scenarios with at least 1 attempt)
  const playedScenarios = scenarios.filter((sc) =>
    attempts.some((att) => att.scenarioId === sc.id || att.scenarioId === sc.firestoreId)
  );

  const getRoleRecord = (scenario, roleKey) => {
    const scId = scenario.id || scenario.firestoreId;
    const highScores = userProfile?.highScores || {};
    const highScoreKey = `${scId}_${roleKey}`;
    const score = highScores[highScoreKey] || 0;

    // Retrieve latest attempt metadata for health/morale
    const roleAttempts = attempts.filter(
      (att) => (att.scenarioId === scId || att.scenarioId === scenario.id || att.scenarioId === scenario.firestoreId) && att.role === roleKey
    );
    const latestAttempt = roleAttempts[0] || {};

    return {
      score,
      played: score > 0 || roleAttempts.length > 0,
      healthStatus: latestAttempt.healthStatus || 'N/A',
      moraleStatus: latestAttempt.moraleStatus || 'N/A',
    };
  };

  const toggleExpand = (scId) => {
    setExpandedScenarioId(expandedScenarioId === scId ? null : scId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sky-400 font-medium animate-pulse flex items-center space-x-2">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Loading Retrospective Reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Sprint Retrospective Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your highest role scores, explore individual role breakdowns, and download official certificates.
        </p>
      </div>

      {/* Played Scenarios List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" /> Played Scenario Archives
        </h2>

        {playedScenarios.length > 0 ? (
          <div className="space-y-3">
            {playedScenarios.map((sc) => {
              const isExpanded = expandedScenarioId === sc.id;
              const roles = ['QA', 'Tester', 'Programmer'];

              return (
                <div
                  key={sc.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition"
                >
                  {/* Scenario Summary Header (Accordion Trigger) */}
                  <div
                    onClick={() => toggleExpand(sc.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition"
                  >
                    <div>
                      <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {sc.difficulty}
                      </span>
                      <h3 className="font-bold text-white text-base mt-1">{sc.title}</h3>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-sky-400 font-mono font-bold">
                        3 Roles Tracked
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded 3 Roles Record Breakdown */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800 bg-slate-900/40 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {roles.map((rKey) => {
                        const record = getRoleRecord(sc, rKey);
                        const roleTitle =
                          rKey === 'QA'
                            ? 'QA Engineer'
                            : rKey === 'Tester'
                            ? 'Software Tester'
                            : 'Programmer';

                        return (
                          <div
                            key={rKey}
                            onClick={() =>
                              record.played &&
                              setSelectedCert({
                                scenarioTitle: sc.title,
                                roleKey: rKey,
                                record,
                              })
                            }
                            className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition ${
                              record.played
                                ? 'bg-slate-950 border-sky-500/40 cursor-pointer hover:border-sky-400'
                                : 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">{roleTitle}</span>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                                  record.played
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                {record.played ? 'Completed' : 'Not Played'}
                              </span>
                            </div>

                            <div>
                              <div className="text-[10px] text-slate-400 uppercase font-bold">
                                Highest Score Saved
                              </div>
                              <div className="text-2xl font-black text-sky-400 font-mono">
                                {record.score}
                                <span className="text-xs text-slate-500">/100</span>
                              </div>
                            </div>

                            {record.played ? (
                              <button className="w-full py-2 bg-slate-800 hover:bg-sky-600 text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5">
                                <Award className="w-3.5 h-3.5 text-amber-400" />
                                <span>View Certificate</span>
                              </button>
                            ) : (
                              <div className="text-[11px] text-slate-500 text-center py-1">
                                Play role in Missions tab
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-slate-400 text-sm p-4 bg-slate-950 rounded-xl border border-slate-800">
            No completed sprint attempts found. Play a mission to unlock reports and certificates!
          </div>
        )}
      </div>

      {/* Certificate Modal Overlay with userProfile passed */}
      {selectedCert && (
        <CertificateModal
          scenarioTitle={selectedCert.scenarioTitle}
          roleKey={selectedCert.roleKey}
          record={selectedCert.record}
          userProfile={userProfile}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}