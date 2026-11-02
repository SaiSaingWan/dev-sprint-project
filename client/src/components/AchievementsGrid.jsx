import { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Trophy, 
  Sparkles, 
  HeartHandshake, 
  Smile, 
  Layers, 
  Crown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AchievementsGrid({ profile }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalExp = profile?.totalExp || 0;
  const roleExp = profile?.roleExp || { QA: 0, Tester: 0, Programmer: 0 };
  const highScores = profile?.highScores || {};
  const attempts = profile?.attempts || [];

  // Full 10 Achievement Library with dynamic unlock logic
  const badges = [
    {
      id: 'first_responder',
      title: 'First Responder',
      desc: 'Complete 1 scenario assessment (Any Role)',
      icon: CheckCircle2,
      unlocked: totalExp > 0,
    },
    {
      id: 'qa_specialist',
      title: 'QA Specialist',
      desc: 'Earn 500+ EXP in QA Engineer role',
      icon: ShieldCheck,
      unlocked: (roleExp.QA || 0) >= 500,
    },
    {
      id: 'automation_ace',
      title: 'Automation Ace',
      desc: 'Earn 500+ EXP in Software Tester role',
      icon: Flame,
      unlocked: (roleExp.Tester || 0) >= 500,
    },
    {
      id: 'code_hotfixer',
      title: 'Code Hotfixer',
      desc: 'Earn 500+ EXP in Programmer role',
      icon: Trophy,
      unlocked: (roleExp.Programmer || 0) >= 500,
    },
    {
      id: 'full_stack_lead',
      title: 'Full-Stack Crisis Lead',
      desc: 'Earn 300+ EXP across ALL 3 roles',
      icon: Crown,
      unlocked:
        (roleExp.QA || 0) >= 300 &&
        (roleExp.Tester || 0) >= 300 &&
        (roleExp.Programmer || 0) >= 300,
    },
    {
      id: 'flawless_sprint',
      title: 'Flawless Sprint',
      desc: 'Score 100/100 on any Scenario',
      icon: Sparkles,
      unlocked: Object.values(highScores).some((score) => score === 100),
    },
    {
      id: 'zero_downtime_hero',
      title: 'Zero Downtime Hero',
      desc: 'Finish a sprint with 100% System Health',
      icon: HeartHandshake,
      unlocked: attempts.some((att) => att.healthStatus?.includes('100%')),
    },
    {
      id: 'cool_under_pressure',
      title: 'Cool Under Pressure',
      desc: 'Finish a sprint with CONFIDENT Morale',
      icon: Smile,
      unlocked: attempts.some((att) => att.moraleStatus?.includes('CONFIDENT')),
    },
    {
      id: 'catalog_completionist',
      title: 'Catalog Completionist',
      desc: 'Complete high scores across at least 3 scenarios',
      icon: Layers,
      unlocked: Object.keys(highScores).length >= 3,
    },
    {
      id: 'legendary_architect',
      title: 'Legendary Architect',
      desc: 'Reach 3,000+ Total EXP',
      icon: Award,
      unlocked: totalExp >= 3000,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  
  // Show only 2 badges when collapsed
  const visibleBadges = isExpanded ? badges : badges.slice(0, 2);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Sprint Badges & Trophies
        </h2>
        <span className="text-xs font-mono font-bold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-sky-400">
          {unlockedCount} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleBadges.map((b) => {
          const IconComp = b.icon;
          return (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition ${
                b.unlocked
                  ? 'bg-slate-950 border-amber-500/40'
                  : 'bg-slate-950/40 border-slate-800 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg ${
                    b.unlocked
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    b.unlocked
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {b.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{b.title}</h3>
                <p className="text-slate-400 text-xs mt-1 leading-snug">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEE MORE / SHOW LESS TOGGLE BUTTON */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
      >
        <span>{isExpanded ? 'Show Less' : `See More (${badges.length - 2} hidden)`}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-sky-400" /> : <ChevronDown className="w-4 h-4 text-sky-400" />}
      </button>
    </div>
  );
}