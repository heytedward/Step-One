
import React, { useState, useEffect, useRef } from 'react';
import { Challenge, UserState, Stamp, Ambition } from '../types';
import { AMBITION_CONTENT, COLORS, STAMP_COLORS } from '../constants';
import { HapticService } from '../services/haptics';
import * as Lucide from 'lucide-react';

const Icon = ({ name, size = 24, className = "", color = "currentColor" }: { name: string, size?: number, className?: string, color?: string }) => {
  const LucideIcon = (Lucide as any)[name] || Lucide.HelpCircle;
  return <LucideIcon size={size} className={className} strokeWidth={1.5} color={color} />;
};

interface TodayViewProps {
  userState: UserState;
  onChallengeComplete: (stamp: Stamp, type: 'foundation' | 'journey') => void;
  onUpdateAmbition: (ambition: Ambition) => void;
  openPaywall: (msg?: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ userState, onChallengeComplete, onUpdateAmbition, openPaywall }) => {
  const [activeTab, setActiveTab] = useState<'foundation' | 'journey'>('foundation');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResetMsg, setShowResetMsg] = useState(false);
  const [showFocusSwitcher, setShowFocusSwitcher] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Vision Boarding State
  const [customVision, setCustomVision] = useState('');
  const [selectedTime, setSelectedTime] = useState<number>(120);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState('10');

  const ambition = userState.userAmbition || 'Travel';
  const tasks = AMBITION_CONTENT[ambition];

  const resetTimer = () => {
    if (timerActive) {
      HapticService.warning();
      setShowResetMsg(true);
      setTimerActive(false);
      setTimeLeft(activeChallenge?.durationSeconds || (isCustomTime ? parseInt(customTimeInput) * 60 : selectedTime));
      setTimeout(() => setShowResetMsg(false), 4000);
    }
  };

  useEffect(() => {
    const handleVisibility = () => { if (document.visibilityState === 'hidden') resetTimer(); };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [timerActive, activeChallenge]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleSuccess();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft]);

  const handleSuccess = () => {
    setTimerActive(false);
    HapticService.success();
    // @ts-ignore
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [COLORS.yellow, COLORS.pink, COLORS.white] });
    
    const isJourney = !!activeChallenge && (
      activeChallenge.id.includes('travel') || 
      activeChallenge.id.includes('biz') || 
      activeChallenge.id.includes('hobby') || 
      activeChallenge.id.includes('health')
    );

    const newStamp: Stamp = {
      id: Math.random().toString(36).substr(2, 9),
      challengeId: activeChallenge?.id || 'custom-vision',
      date: new Date().toISOString(),
      icon: isJourney ? (activeChallenge?.icon || 'Compass') : 'Zap',
      color: STAMP_COLORS[Math.floor(Math.random() * STAMP_COLORS.length)]
    };

    onChallengeComplete(newStamp, isJourney ? 'journey' : 'foundation');
    setActiveChallenge(null);
  };

  const startMission = (challenge: Challenge) => {
    if (challenge.isPremium && !userState.isPro) {
      openPaywall();
      return;
    }
    HapticService.light();
    setActiveChallenge(challenge);
    setTimeLeft(challenge.durationSeconds);
    setTimerActive(true);
  };

  const startCustomVision = () => {
    if (!userState.isPro) { openPaywall(); return; }
    if (!customVision.trim()) { alert("Enter a vision first!"); return; }
    HapticService.light();
    const duration = isCustomTime ? parseInt(customTimeInput) * 60 : selectedTime;
    setActiveChallenge(null);
    setTimeLeft(duration);
    setTimerActive(true);
  };

  const handleFocusSwitcherTrigger = () => {
    HapticService.light();
    if (!userState.isPro) {
      openPaywall('Pro Explorers can switch goals anytime. Unlock full flexibility with a 14-day free trial.');
    } else {
      setShowFocusSwitcher(true);
    }
  };

  const handleSwitchAmbition = (targetAmbition: Ambition) => {
    if (targetAmbition === ambition) {
      setShowFocusSwitcher(false);
      return;
    }
    HapticService.success();
    onUpdateAmbition(targetAmbition);
    setShowFocusSwitcher(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-32 bg-[#FDFCFB]">
      {/* Header & Focus Switcher */}
      <div className="px-8 pt-12 pb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#1A202C] mb-2 font-display">StepOne</h1>
            
            <button 
              onClick={handleFocusSwitcherTrigger}
              className="flex items-center space-x-2 group active:scale-95 transition-transform"
            >
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-pink-400 transition-colors">
                {ambition} Focused
              </p>
              <Lucide.ChevronDown size={14} className="text-gray-300" strokeWidth={3} />
            </button>
          </div>

          {/* Streak Counter */}
          <div 
            key={userState.streak} 
            className="flex flex-col items-end animate-in slide-in-from-right zoom-in duration-500"
          >
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-2xl border border-orange-100/50 shadow-sm">
              <Lucide.Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-sm font-black text-orange-600 tabular-nums">
                {userState.streak}
              </span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-300 mt-1">
              Day Streak
            </span>
          </div>
        </div>
        
        <div className="bg-gray-100/50 p-1 rounded-2xl flex relative mt-6">
          <button 
            onClick={() => { HapticService.light(); setActiveTab('foundation'); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative z-10 flex items-center justify-center space-x-2 ${activeTab === 'foundation' ? 'text-gray-800' : 'text-gray-400'}`}
          >
            <Icon name="Zap" size={16} />
            <span>Daily Foundation</span>
          </button>
          <button 
            onClick={() => { HapticService.light(); setActiveTab('journey'); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative z-10 flex items-center justify-center space-x-2 ${activeTab === 'journey' ? 'text-gray-800' : 'text-gray-400'}`}
          >
            <Icon name="Compass" size={16} />
            <span>Journey Path</span>
          </button>
          <div className={`absolute top-1 bottom-1 w-[49%] bg-white rounded-xl shadow-sm transition-all duration-300 ${activeTab === 'journey' ? 'left-[50%]' : 'left-1'}`} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-8 space-y-4">
        {activeTab === 'foundation' ? (
          tasks.foundation.map(task => {
            const isDone = userState.completedFoundationIds.includes(task.id);
            return (
              <button 
                key={task.id} 
                disabled={isDone}
                onClick={() => startMission(task)}
                className={`w-full rounded-[2rem] p-6 flex items-center text-left transition-all ${isDone ? 'bg-gray-50 opacity-60' : 'bg-white shadow-sm border border-gray-100 active:scale-[0.98]'}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#ffdfba]/30 flex items-center justify-center text-orange-600 mr-5 flex-shrink-0">
                  <Icon name={task.icon} size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1A202C]">{task.title}</h3>
                  <p className="text-gray-400 text-xs font-medium leading-tight">{isDone ? 'Foundation set for today' : task.description}</p>
                </div>
                {isDone && <Icon name="CheckCircle2" className="text-green-500" />}
              </button>
            );
          })
        ) : (
          <div className="space-y-4">
            {tasks.journey.map((mission, idx) => {
              const isLocked = idx > userState.completedJourneyDay;
              const isPremium = mission.isPremium && !userState.isPro;
              const isDone = idx < userState.completedJourneyDay;
              const isCurrent = idx === userState.completedJourneyDay;

              return (
                <button 
                  key={mission.id}
                  disabled={isLocked && !isPremium}
                  onClick={() => startMission(mission)}
                  className={`w-full rounded-[2rem] p-6 flex items-center text-left transition-all relative ${isCurrent ? 'bg-white shadow-md border-2 border-pink-100 ring-4 ring-pink-50' : isLocked ? 'bg-gray-50/50 opacity-40' : 'bg-white opacity-60'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 ${isCurrent ? 'bg-[#ffb3ba] text-pink-900' : 'bg-gray-100 text-gray-400'}`}>
                    {isPremium ? <Icon name="Crown" size={24} /> : <Icon name={mission.icon} size={24} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1A202C]">{mission.title}</h3>
                    <p className="text-gray-400 text-xs font-medium leading-tight">{isPremium ? 'Unlock Pro to continue' : isCurrent ? mission.description : isDone ? 'Mission complete' : 'Locked'}</p>
                  </div>
                  {isLocked && !isPremium && <Icon name="Lock" size={16} className="text-gray-300" />}
                  {isDone && <Icon name="CheckCircle2" size={20} className="text-green-400" />}
                </button>
              );
            }).slice(0, userState.completedJourneyDay + 3)}
          </div>
        )}
      </div>

      {/* Vision Boarding Section */}
      <div className="px-8 mt-12 pb-12">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-[#bae1ff]/50">
          <div className="flex items-center space-x-3 mb-6">
            <Icon name="Wind" className="text-blue-400" />
            <h2 className="text-2xl font-bold text-[#1A202C] font-display">Vision Boarding</h2>
          </div>
          
          <div className="space-y-6">
            <input 
              type="text"
              placeholder="What's your vision?"
              value={customVision}
              onChange={(e) => setCustomVision(e.target.value)}
              className="w-full bg-[#bae1ff]/10 rounded-2xl px-6 py-4 text-gray-700 font-bold border-2 border-transparent focus:border-[#bae1ff] focus:outline-none transition-all placeholder:text-blue-300"
            />

            <div className="flex gap-2">
              {[120, 240, 360].map(seconds => (
                <button
                  key={seconds}
                  onClick={() => { HapticService.light(); setSelectedTime(seconds); setIsCustomTime(false); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${!isCustomTime && selectedTime === seconds ? 'bg-[#ffdfba] text-orange-900 shadow-sm' : 'bg-gray-50 text-gray-400'}`}
                >
                  {seconds / 60}m
                </button>
              ))}
              <button
                onClick={() => { HapticService.light(); setIsCustomTime(true); }}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${isCustomTime ? 'bg-[#ffdfba] text-orange-900 shadow-sm' : 'bg-gray-50 text-gray-400'}`}
              >
                Custom
              </button>
            </div>

            {isCustomTime && (
              <input 
                type="number"
                value={customTimeInput}
                onChange={(e) => setCustomTimeInput(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-6 py-3 text-gray-700 font-bold focus:outline-none border-2 border-transparent focus:border-orange-100"
                min="1"
              />
            )}

            <button 
              onClick={startCustomVision}
              className="w-full py-5 rounded-[1.5rem] font-black text-gray-800 shadow-xl shadow-pink-100 transition-all active:scale-95 text-lg relative overflow-hidden"
              style={{ backgroundColor: COLORS.pink }}
            >
              {!userState.isPro && <Icon name="Crown" size={16} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30" />}
              Start Session
            </button>
          </div>
        </div>
      </div>

      {/* Focus Switcher Modal */}
      {showFocusSwitcher && (
        <div className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in" onClick={() => setShowFocusSwitcher(false)}>
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 font-display">Switch Focus</h3>
              <button onClick={() => setShowFocusSwitcher(false)} className="text-gray-300 p-2"><Lucide.X size={20} /></button>
            </div>
            
            <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed px-1">
              Move between paths effortlessly. Your current progress is saved, and your new Roadmap will load immediately.
            </p>
            
            <div className="space-y-4">
              {[
                { type: 'Business' as Ambition, icon: 'Briefcase', color: COLORS.pink },
                { type: 'Travel' as Ambition, icon: 'Globe', color: COLORS.blue },
                { type: 'Hobby' as Ambition, icon: 'Palette', color: COLORS.orange },
                { type: 'Health' as Ambition, icon: 'Heart', color: COLORS.green }
              ].map(opt => (
                <button 
                  key={opt.type}
                  onClick={() => handleSwitchAmbition(opt.type)}
                  className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${ambition === opt.type ? 'border-pink-300 bg-pink-50/20' : 'border-gray-50 bg-white shadow-sm'}`}
                  style={{ minHeight: '64px' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: opt.color + '40' }}>
                    <Icon name={opt.icon} size={24} color={opt.color} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`font-bold block ${ambition === opt.type ? 'text-gray-800' : 'text-gray-700'}`}>{opt.type}</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{ambition === opt.type ? 'Active' : 'Switch Path'}</span>
                  </div>
                  {ambition === opt.type && <Lucide.Check size={20} className="text-pink-500 mr-2" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timer Overlay */}
      {timerActive && (
        <div className="fixed inset-0 z-[150] bg-white flex flex-col p-8 animate-in slide-in-from-bottom duration-500 overflow-hidden">
          <div className="flex justify-end">
            <button onClick={() => setTimerActive(false)} className="text-gray-300 font-bold p-2 transition-transform active:scale-90"><Lucide.X size={24} /></button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 min-h-0">
            <div className="w-20 h-20 rounded-3xl bg-pink-50 flex items-center justify-center text-pink-400 shadow-inner flex-shrink-0 animate-pulse">
              <Icon name={activeChallenge?.icon || "Wind"} size={40} />
            </div>
            
            <div className="px-4 flex-shrink-0">
              <h2 className="text-2xl font-bold text-[#1A202C] mb-1 font-display">{activeChallenge?.title || customVision}</h2>
              <p className="text-gray-400 text-xs max-w-xs leading-relaxed">{activeChallenge?.description || "Visualise your goal. This moment of presence is the compass for your future."}</p>
            </div>

            <div className="relative w-full flex-1 flex items-center justify-center max-h-[320px] max-w-[320px] mx-auto overflow-visible p-4">
              <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="#F8F8F8" strokeWidth="6" fill="transparent" />
                <circle
                  cx="50" cy="50" r="44" stroke={COLORS.pink} strokeWidth="6" fill="transparent"
                  strokeDasharray="276.5" strokeDashoffset={`${276.5 * (1 - timeLeft / (activeChallenge?.durationSeconds || (isCustomTime ? parseInt(customTimeInput) * 60 : selectedTime)))}`}
                  strokeLinecap="round" className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-[#1A202C] tabular-nums leading-none tracking-tighter">{formatTime(timeLeft)}</span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-3">Active Mission</span>
              </div>
            </div>

            {showResetMsg && (
              <div className="text-orange-400 font-bold text-xs animate-pulse flex-shrink-0 bg-orange-50 px-6 py-2 rounded-full border border-orange-100">
                Keep the focus alive...
              </div>
            )}
          </div>
          <p className="text-gray-400 text-[10px] text-center font-bold uppercase tracking-[0.4em] pb-8 pt-4 flex-shrink-0 opacity-40">Persistence is the path.</p>
        </div>
      )}
    </div>
  );
};
