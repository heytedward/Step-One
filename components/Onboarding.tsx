
import React, { useState } from 'react';
import { HapticService } from '../services/haptics';
import { COLORS } from '../constants';
import { Ambition } from '../types';
import * as Lucide from 'lucide-react';

interface OnboardingProps {
  onComplete: (ambition: Ambition) => void;
  onRequestPaywall: () => void;
}

const SCREENS = [
  {
    title: "Dream Big",
    description: "You were made for more than your bedroom walls. Solo travel and personal growth are transformations.",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800",
    cta: "I'm Ready",
    color: COLORS.pink
  },
  {
    title: "The Training",
    description: "Consistency is a skill. Our Presence Missions teach you to stay focused and grounded on what matters most.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    cta: "Show Me How",
    color: COLORS.orange
  },
  {
    title: "Collect Memories",
    description: "Every mission completed earns you a digital stamp. Build your adventure passport and track your evolution.",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800",
    cta: "Let's Go",
    color: COLORS.blue
  }
];

const AMBITIONS: { type: Ambition, label: string, icon: string, color: string }[] = [
  { type: 'Travel', label: 'Travel More', icon: 'Globe', color: COLORS.blue },
  { type: 'Business', label: 'Start a Business', icon: 'Briefcase', color: COLORS.pink },
  { type: 'Hobby', label: 'Learn a Hobby', icon: 'Palette', color: COLORS.orange },
  { type: 'Health', label: 'Get Healthier', icon: 'Heart', color: COLORS.green }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onRequestPaywall }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAmbitionSelection, setShowAmbitionSelection] = useState(false);

  const next = () => {
    HapticService.light();
    if (currentStep < SCREENS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setShowAmbitionSelection(true);
    }
  };

  const selectAmbition = (ambition: Ambition) => {
    HapticService.success();
    onComplete(ambition);
  };

  if (showAmbitionSelection) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col p-10 bg-[#FFFBFA] overflow-y-auto">
        <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight text-gray-800 text-center font-display mt-10">
          Choose Your Ambition
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed font-normal text-center mb-10">
          We'll personalize your journey based on your primary goal.
        </p>

        <div className="grid grid-cols-1 gap-6 mb-10">
          {AMBITIONS.map((a) => {
            const Icon = (Lucide as any)[a.icon];
            return (
              <button
                key={a.type}
                onClick={() => selectAmbition(a.type)}
                className="flex items-center p-6 rounded-[2rem] text-left transition-all active:scale-95 border-2 border-transparent hover:border-gray-200 bg-white shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mr-6" style={{ backgroundColor: a.color + '40' }}>
                  <Icon size={32} strokeWidth={1.5} color={a.color} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{a.label}</h3>
                  <p className="text-gray-400 text-sm font-medium">Build confidence in this path.</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const step = SCREENS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex flex-col transition-colors duration-500" style={{ backgroundColor: COLORS.bgSoft }}>
      <div className="h-1/2 w-full relative overflow-hidden">
        <img 
          src={step.image} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Onboarding" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
      </div>
      
      <div className="flex-1 px-10 pb-16 flex flex-col justify-center text-center">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight text-gray-800 font-display">
            {step.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-normal">
            {step.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col items-center">
          <div className="flex space-x-3 mb-10">
            {SCREENS.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-10' : 'w-2'}`} 
                style={{ backgroundColor: i === currentStep ? step.color : '#EEE' }}
              />
            ))}
          </div>
          
          <button 
            onClick={next}
            className="w-full max-w-xs py-5 rounded-full font-extrabold text-gray-800 shadow-xl shadow-pink-100 transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: step.color }}
          >
            {step.cta}
          </button>
        </div>
      </div>
    </div>
  );
};
