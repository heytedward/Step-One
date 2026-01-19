
import React, { useState } from 'react';
import { UserState, Tab, Stamp, Challenge } from '../types';
import { COLORS, AMBITION_CONTENT } from '../constants';
import { HapticService } from '../services/haptics';
import * as Lucide from 'lucide-react';

export const PassportView: React.FC<{ userState: UserState, onTabChange?: (tab: Tab) => void }> = ({ userState, onTabChange }) => {
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [sharing, setSharing] = useState(false);
  
  const getChallengeInfo = (id: string) => {
    const allChallenges = Object.values(AMBITION_CONTENT).flatMap(v => [...v.foundation, ...v.journey]);
    return allChallenges.find(c => c.id === id);
  };

  const handleShare = async (stamp: Stamp) => {
    HapticService.light();
    setSharing(true);
    const challenge = getChallengeInfo(stamp.challengeId);
    const shareText = `Just took StepOne toward my ${userState.userAmbition} goals! Completed "${challenge?.title || 'a mission'}". Join me on StepOne! cc @RevenueCat 🌎✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StepOne Achievement',
          text: shareText,
          url: 'https://stepone.app',
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Text copied! Ready to post to Instagram Stories.");
    }
    setSharing(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 pb-28 bg-[#FCF9F2] overflow-hidden">
      <header className="mb-6 text-center">
        <h2 className="text-3xl font-display font-bold text-gray-800 uppercase tracking-widest italic">
          Journey Passport
        </h2>
        <div className="h-0.5 w-12 bg-gray-200 mx-auto mt-2 rounded-full" />
      </header>

      {/* Tactile "Open Book" Container */}
      <div className="flex-1 relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex overflow-hidden book-inner-shadow">
        {/* Visual Spine Shadow */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 shadow-[0_0_15px_rgba(0,0,0,0.1)] z-10" />
        
        {/* Left Page: Personal Identity */}
        <div className="flex-1 flex flex-col p-6 border-r border-gray-50 bg-gradient-to-r from-gray-50/20 to-transparent">
          <div className="mb-8">
            <label className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] block mb-1">Property Of:</label>
            <div className="border-b-2 border-dashed border-gray-100 pb-2">
               <span className="font-display text-xl italic text-gray-800 leading-tight">
                {userState.userId ? 'Verified Traveler' : 'Guest Explorer'}
               </span>
            </div>
            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-1">ID: {userState.userId || 'Guest-001'}</p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center space-y-6 opacity-60">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 animate-float">
               <Lucide.Compass size={36} strokeWidth={1} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Current Standing</p>
              <div className="inline-block bg-gray-50 px-3 py-1 rounded-full">
                <p className="text-xs font-black text-gray-500 uppercase tracking-tighter">Level {userState.level} Legend</p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-end grayscale opacity-20">
             <Lucide.Map size={18} />
             <span className="text-[8px] font-black uppercase tracking-[0.3em]">Official Entry</span>
          </div>
        </div>

        {/* Right Page: The Stamp Ledger */}
        <div className="flex-1 flex flex-col p-4 bg-gradient-to-l from-gray-50/10 to-transparent overflow-y-auto no-scrollbar">
          {userState.stamps.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-12">
               <Lucide.ScrollText size={40} className="mb-4" strokeWidth={1} />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Fill these pages<br/>with action.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {userState.stamps.map((stamp, idx) => {
                const LucideIcon = (Lucide as any)[stamp.icon] || Lucide.Circle;
                return (
                  <button 
                    key={stamp.id}
                    onClick={() => { HapticService.light(); setSelectedStamp(stamp); }}
                    className="aspect-square bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden animate-stamp-in active:scale-95 group"
                    style={{ 
                      animationDelay: `${idx * 0.1}s`,
                      opacity: 0 // Will be set to 1 by animation
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-transform group-hover:scale-110" style={{ backgroundColor: stamp.color + '15' }}>
                       <LucideIcon size={20} style={{ color: stamp.color }} />
                    </div>
                    <span className="text-[6px] font-black text-gray-300 uppercase tracking-tighter">
                      {new Date(stamp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal remains visually consistent with high-end aesthetic */}
      {selectedStamp && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in" onClick={() => setSelectedStamp(null)}>
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="h-48 w-full flex items-center justify-center relative bg-stone-50 border-b border-gray-100">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')]" />
              <div className="w-28 h-28 bg-white rounded-2xl flex flex-col items-center justify-center shadow-xl border border-gray-100 rotate-2">
                <div className="flex items-center justify-center p-4 rounded-full bg-gray-50 mb-2">
                  {React.createElement((Lucide as any)[selectedStamp.icon] || Lucide.Circle, { size: 36, strokeWidth: 1.5, color: selectedStamp.color })}
                </div>
                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Entry Confirmed</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-gray-800 mb-2 italic text-center">
                {getChallengeInfo(selectedStamp.challengeId)?.title || "Explorer Entry"}
              </h3>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed text-center font-medium italic">
                Recorded on {new Date(selectedStamp.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}. This mark signifies another step toward your evolution.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleShare(selectedStamp)} 
                  disabled={sharing}
                  className="w-full py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center space-x-3"
                >
                  <Lucide.Share2 size={18} strokeWidth={2} />
                  <span>{sharing ? 'Exporting...' : 'Export Entry'}</span>
                </button>
                <button 
                  onClick={() => setSelectedStamp(null)} 
                  className="w-full py-2 text-gray-300 font-bold text-[10px] uppercase tracking-[0.3em]"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
