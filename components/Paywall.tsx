
import React, { useState } from 'react';
import { RevenueCatService } from '../services/revenueCat';
import { HapticService } from '../services/haptics';
import { COLORS } from '../constants';
import { Ambition } from '../types';
import * as Lucide from 'lucide-react';

export const Paywall: React.FC<{ ambition: Ambition | null, message?: string | null, onClose: () => void, onSuccess: () => void }> = ({ ambition, message, onClose, onSuccess }) => {
  const [loading, setLoading] = useState<'monthly' | 'lifetime' | null>(null);

  const handlePurchase = async (type: 'monthly' | 'lifetime') => {
    HapticService.light();
    setLoading(type);
    try {
      if (type === 'monthly') {
        await RevenueCatService.purchaseMonthly();
      } else {
        await RevenueCatService.purchaseLifetime();
      }
      HapticService.success();
      onSuccess();
    } catch (e) { 
      alert("Try again later."); 
    } finally { 
      setLoading(null); 
    }
  };

  const ambitionLabel = ambition ? (ambition === 'Hobby' ? 'Hobby' : ambition === 'Health' ? 'Wellness' : ambition) : 'Personal';
  const displayMessage = message || `Unlock your personalized ${ambitionLabel} Roadmap with a 14-day free trial.`;

  return (
    <div className="fixed inset-0 bg-white z-[120] flex flex-col p-8 overflow-y-auto no-scrollbar">
      <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center font-bold text-gray-400 z-10 transition-transform active:scale-90">✕</button>

      <div className="text-center mt-12 mb-10">
        <div className="w-16 h-16 bg-[#FFDFBA] rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6 shadow-xl shadow-orange-100/50">
          <Lucide.Crown size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-display">Upgrade Your Path</h2>
        <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">
          {displayMessage}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {/* Card A: Subscription */}
        <button 
          onClick={() => handlePurchase('monthly')}
          disabled={loading !== null}
          className="group relative flex flex-col items-start p-6 rounded-[2.5rem] text-left transition-all active:scale-[0.98] border-2 border-transparent hover:border-pink-200 overflow-hidden"
          style={{ backgroundColor: COLORS.pink + '30' }}
        >
          <div className="absolute top-4 right-4 text-pink-500 opacity-20 group-hover:opacity-40 transition-opacity">
            <Lucide.RefreshCw size={48} strokeWidth={1} />
          </div>
          <div className="bg-white/60 p-2 rounded-xl mb-4">
            <Lucide.RefreshCw size={20} className="text-pink-500" />
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-1">Monthly Explorer</h3>
          <div className="flex items-baseline space-x-1 mb-2">
            <span className="text-2xl font-black text-gray-800">$4.99</span>
            <span className="text-sm font-bold text-gray-400">/ month</span>
          </div>
          <div className="bg-pink-400/10 px-3 py-1 rounded-full">
            <p className="text-[10px] font-black uppercase tracking-widest text-pink-600">14-Day Free Trial included</p>
          </div>
          {loading === 'monthly' && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>

        {/* Card B: Lifetime */}
        <button 
          onClick={() => handlePurchase('lifetime')}
          disabled={loading !== null}
          className="group relative flex flex-col items-start p-6 rounded-[2.5rem] text-left transition-all active:scale-[0.98] border-2 border-transparent hover:border-blue-200 overflow-hidden"
          style={{ backgroundColor: COLORS.blue + '30' }}
        >
          <div className="absolute top-4 right-4 text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity">
            <Lucide.Infinity size={48} strokeWidth={1} />
          </div>
          <div className="bg-white/60 p-2 rounded-xl mb-4">
            <Lucide.Infinity size={20} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-1">Lifetime Legend</h3>
          <div className="flex items-baseline space-x-1 mb-2">
            <span className="text-2xl font-black text-gray-800">$29.99</span>
            <span className="text-sm font-bold text-gray-400">Once</span>
          </div>
          <div className="bg-blue-400/10 px-3 py-1 rounded-full">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Never pay again. All missions included.</p>
          </div>
          {loading === 'lifetime' && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <BenefitRow icon="Compass" title="Full 30-Day Personalized Path" />
        <BenefitRow icon="Zap" title="Personalized Focus Switcher" />
        <BenefitRow icon="Wind" title="Premium Custom Vision Timers" />
      </div>

      <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] mb-4">
        Secure checkout • Cancel anytime
      </p>
    </div>
  );
};

const BenefitRow = ({ icon, title }: { icon: string; title: string }) => {
  const Icon = (Lucide as any)[icon] || Lucide.Check;
  return (
    <div className="flex items-center space-x-4 px-2">
      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-500">
        <Icon size={14} strokeWidth={3} />
      </div>
      <p className="text-xs font-bold text-gray-600">{title}</p>
    </div>
  );
};
