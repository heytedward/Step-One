
import React from 'react';
import { Tab } from '../types';
import { HapticService } from '../services/haptics';
import { COLORS } from '../constants';
import { Zap, Compass, User } from 'lucide-react';

export const BottomNav: React.FC<{ currentTab: Tab, onTabChange: (tab: Tab) => void }> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: Tab.Today, icon: Zap, label: 'Win' },
    { id: Tab.Passport, icon: Compass, label: 'Journey' },
    { id: Tab.Settings, icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-50 flex justify-around items-center h-24 pb-8 z-40 px-6">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => { HapticService.light(); onTabChange(tab.id); }}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${currentTab === tab.id ? 'scale-105 opacity-100' : 'opacity-25'}`}
        >
          <tab.icon size={26} strokeWidth={1.5} className="mb-1" color={currentTab === tab.id ? COLORS.deepText : '#999'} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">{tab.label}</span>
          {currentTab === tab.id && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.pink }} />}
        </button>
      ))}
    </div>
  );
};
