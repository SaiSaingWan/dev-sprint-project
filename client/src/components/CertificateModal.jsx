import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Award, Download, X, ShieldCheck, Sparkles } from 'lucide-react';

export default function CertificateModal({ 
  scenarioTitle, 
  roleKey, 
  record, 
  userProfile, 
  isPostSprint = false, // Flag to toggle between Final vs Highest Score
  onClose 
}) {
  const certRef = useRef(null);

  const handleDownloadImage = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: '#020617',
        scale: 2,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `DevSprint_Certificate_${roleKey}_${scenarioTitle.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  const roleTitleMap = {
    QA: 'QA Engineer Specialist',
    Tester: 'Software Tester Analyst',
    Programmer: 'Programmer / Hotfix Engineer',
  };

  const displayName = userProfile?.displayName || 'Alex Developer';
  const studentId = userProfile?.studentId ? ` (${userProfile.studentId})` : ' (DEV-88492)';

  // Helper to return title and humorous parenthetical subtitle
  const getRankBadgeInfo = (score) => {
    if (score >= 90) {
      return { 
        title: '🏆 Zero-Downtime Hero', 
        subtitle: "(SLA God)" 
      };
    }
    if (score >= 70) {
      return { 
        title: '🩹 Band-Aid Specialist', 
        subtitle: "(It's ugly, but it's live!)" 
      };
    }
    return { 
      title: '🔥 Firefighter', 
      subtitle: "(Barely survived the crash!)" 
    };
  };

  const scoreToDisplay = record?.score || 0;
  const badgeInfo = getRankBadgeInfo(scoreToDisplay);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative space-y-4 sm:space-y-6 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CERTIFICATE DISPLAY BOX */}
        <div
          ref={certRef}
          className="bg-slate-950 border-2 border-sky-500/40 rounded-xl sm:rounded-2xl p-4 sm:p-8 relative overflow-hidden text-center space-y-4 sm:space-y-6 shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header Branding */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-1.5 text-sky-400 font-extrabold text-xs sm:text-sm tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>DevSprint Academy</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              OFFICIAL SPRINT CREDENTIAL
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <Award className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Certificate of Assessment
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              This credential certifies that the software engineer has completed the production crisis assessment:
            </p>
          </div>

          {/* Scenario & Role Details */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-1">
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold">
              {scenarioTitle}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-sky-300">
              {roleTitleMap[roleKey] || roleKey}
            </div>

            {/* Fun Achievement Title & Bracketed Subtitle */}
            <div className="inline-flex items-center space-x-1 mt-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
              <span>{badgeInfo.title}</span>
              <span className="text-slate-400 font-normal lowercase tracking-normal">
                {badgeInfo.subtitle}
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              {/* Dynamic Label based on post-sprint vs historical record */}
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold">
                {isPostSprint ? 'Final Score' : 'Highest Score'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{scoreToDisplay}/100</div>
            </div>

            <div className="bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold">Health Record</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 sm:mt-2 truncate">
                {record?.healthStatus || 'N/A'}
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold">Team Morale</div>
              <div className="text-xs sm:text-sm font-bold text-amber-400 mt-1 sm:mt-2 truncate">
                {record?.moraleStatus || 'N/A'}
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-left">
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400">Issued to Student:</div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {displayName}{studentId}
              </div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Pass</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadImage}
          className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Certificate Image (.PNG)</span>
        </button>
      </div>
    </div>
  );
}