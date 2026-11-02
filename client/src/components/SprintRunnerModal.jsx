import { useState } from 'react';
import { recordSprintAttempt } from '../services/userService';
import CertificateModal from './CertificateModal';
import { Clock, ArrowRight, CheckCircle2, AlertOctagon, RotateCcw } from 'lucide-react';

export default function SprintRunnerModal({ scenario, roleKey, onClose }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  const [isFinished, setIsFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const currentQuestions = scenario?.roles?.[roleKey]?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIdx];

  // Cumulative Health & Morale Calculator
  const calculateMetrics = (upToIdx) => {
    let healthHP = 100;
    let riskyChoiceCount = 0;

    for (let i = 0; i < upToIdx; i++) {
      const opt = selectedAnswers[i];
      if (opt) {
        if (opt.points === 6) {
          healthHP -= 10;
          riskyChoiceCount += 0.5;
        } else if (opt.points <= 2) {
          healthHP -= 25;
          riskyChoiceCount += 1;
        }
      }
    }

    healthHP = Math.max(0, Math.min(100, healthHP));

    let healthLabel = `${healthHP}% (STABLE)`;
    if (healthHP === 0) {
      healthLabel = '0% (CRASHED)';
    } else if (healthHP < 40) {
      healthLabel = `${healthHP}% (CRITICAL)`;
    } else if (healthHP < 80) {
      healthLabel = `${healthHP}% (DEGRADED)`;
    }

    let moraleLabel = 'CONFIDENT';
    if (riskyChoiceCount >= 2.5) {
      moraleLabel = 'PANICKED';
    } else if (riskyChoiceCount >= 1) {
      moraleLabel = 'ANXIOUS';
    }

    return { healthHP, healthLabel, moraleLabel };
  };

  const { healthLabel: currentHealth, moraleLabel: currentMorale } = calculateMetrics(currentQuestionIdx);

  const handleSelectOption = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: option,
    }));
  };

  const handleNext = async () => {
    const nextMetrics = calculateMetrics(currentQuestionIdx + 1);

    if (nextMetrics.healthHP === 0) {
      setIsGameOver(true);
      setIsFinished(true);
      return;
    }

    if (currentQuestionIdx + 1 < currentQuestions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      let calculatedScore = 0;
      currentQuestions.forEach((_, idx) => {
        const opt = selectedAnswers[idx];
        if (opt) calculatedScore += opt.points || 0;
      });

      setFinalScore(calculatedScore);
      setIsFinished(true);

      try {
        await recordSprintAttempt({
          userId: 'user_test_client',
          scenarioId: scenario.id || scenario.firestoreId,
          scenarioTitle: scenario.title,
          role: roleKey,
          score: calculatedScore,
          healthStatus: nextMetrics.healthLabel,
          moraleStatus: nextMetrics.moraleLabel,
        });
      } catch (err) {
        console.error('Failed to save attempt to Firestore:', err);
      }
    }
  };

  const selectedOptionForCurrent = selectedAnswers[currentQuestionIdx];
  const finalMetrics = calculateMetrics(currentQuestions.length);

  // Render shared CertificateModal upon victory with isPostSprint set to true
  if (isFinished && !isGameOver) {
    return (
      <CertificateModal
        scenarioTitle={scenario.title}
        roleKey={roleKey}
        record={{
          score: finalScore,
          healthStatus: finalMetrics.healthLabel,
          moraleStatus: finalMetrics.moraleLabel,
        }}
        isPostSprint={true}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        {!isFinished && (
          <div className="bg-slate-900 p-4 border-b border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                  {roleKey} Mode
                </span>
                <h3 className="font-extrabold text-white text-base mt-0.5">{scenario.title}</h3>
              </div>

              <div className="bg-slate-950 border border-slate-700 text-sky-400 font-mono font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                <Clock className="w-4 h-4" />
                <span>{scenario.timeLimitMinutes || 15}:00</span>
              </div>
            </div>

            {/* Dynamic Status Bar */}
            <div className="flex items-center justify-between bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 font-sans text-[11px]">Health:</span>
                <span
                  className={`font-bold ${
                    currentHealth.includes('STABLE')
                      ? 'text-emerald-400'
                      : currentHealth.includes('DEGRADED')
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {currentHealth}
                </span>
              </div>

              <div className="text-slate-800">|</div>

              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 font-sans text-[11px]">Morale:</span>
                <span
                  className={`font-bold ${
                    currentMorale === 'CONFIDENT'
                      ? 'text-emerald-400'
                      : currentMorale === 'ANXIOUS'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {currentMorale}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          {!isFinished ? (
            currentQuestion ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">
                    {currentQuestion.actTitle || `ACT ${Math.ceil((currentQuestionIdx + 1) / 3)}`}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Question {currentQuestionIdx + 1} of {currentQuestions.length}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                  {currentQuestion.prompt}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options?.map((opt, idx) => {
                    const isSelected = selectedOptionForCurrent?.text === opt.text;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between space-x-3 ${
                          isSelected
                            ? 'bg-sky-950/60 border-sky-500 shadow-lg shadow-sky-500/10'
                            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                        }`}
                      >
                        <span
                          className={`text-xs md:text-sm leading-snug ${
                            isSelected ? 'text-white font-semibold' : 'text-slate-300'
                          }`}
                        >
                          {opt.text}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">No questions available for this role.</div>
            )
          ) : (
            /* GAME OVER STATE */
            <div className="text-center py-8 space-y-5 my-auto">
              <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl border border-rose-500/40 animate-bounce">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-rose-500 tracking-tight">CRITICAL SYSTEM COLLAPSE!</h3>
                <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
                  System Health hit 0%. Multiple risky decisions caused cascading database locks and total API downtime.
                </p>
                <div className="mt-2 text-xs font-mono font-bold text-rose-400">
                  💀 Production Wrecker <span className="text-slate-400 font-normal">(Game Over — Rollback Required)</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-sm mx-auto">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Sprint Result</span>
                <div className="text-lg font-bold text-rose-400 mt-1">INCIDENT FAILED</div>
              </div>

              <div className="space-y-2 max-w-sm mx-auto pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Return to Missions Catalog</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Toolbar */}
        {!isFinished && (
          <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-end items-center">
            <button
              onClick={handleNext}
              disabled={!selectedOptionForCurrent}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition shadow-lg ${
                !selectedOptionForCurrent
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : currentQuestionIdx + 1 === currentQuestions.length
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
              }`}
            >
              <span>
                {currentQuestionIdx + 1 === currentQuestions.length ? 'Submit Assessment' : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}