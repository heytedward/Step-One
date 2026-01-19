
import React, { useState } from 'react';
import { UserState } from '../types';
import { HapticService } from '../services/haptics';
import { COLORS } from '../constants';
import * as Lucide from 'lucide-react';

interface SettingsViewProps {
  userState: UserState;
  onReset: () => void;
  openPaywall: () => void;
  openAuth: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ userState, onReset, openPaywall, openAuth }) => {
  const [activeLegalModal, setActiveLegalModal] = useState<null | 'terms' | 'privacy'>(null);

  const handleRemindersClick = () => {
    HapticService.success();
    alert("Daily Reminders: Notifications are enabled for 8:00 AM local time.");
  };

  const handleFeedbackClick = () => {
    HapticService.light();
    window.location.href = "mailto:hello@stepone.app?subject=StepOne%20Feedback";
  };

  const handleCommunityClick = (url: string) => {
    HapticService.success();
    window.open(url, '_blank');
  };

  const handleResetJourney = () => {
    HapticService.notification('Warning');
    if (window.confirm("Are you sure? This will permanently delete your streak and all earned stamps. Your subscription (if active) will remain.")) {
      HapticService.notification('Warning');
      if (window.confirm("FINAL WARNING: This action cannot be undone. Are you absolutely certain you want to clear all progress?")) {
        onReset();
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar pb-32 bg-[#FFFBFA]">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-1 font-display italic">Profile</h2>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">
          Settings & Identity
        </p>
      </header>

      {/* Profile Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 mb-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl relative overflow-hidden" 
             style={{ backgroundColor: COLORS.pink }}>
          {userState.isPro ? '💎' : '👩'}
          <div className="absolute inset-0 bg-white/20" />
        </div>
        
        <h4 className="text-2xl font-bold text-gray-800 mb-1">Explorer</h4>
        <p className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-6">
          {userState.isPro ? 'Pro Explorer' : userState.isGuest ? 'Guest Explorer' : 'Member'}
        </p>

        <div className="w-full space-y-3">
          {userState.isGuest && (
            <button 
              onClick={() => { HapticService.light(); openAuth(); }}
              className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <Lucide.Apple size={16} />
              <span>Sync Account</span>
            </button>
          )}
          {!userState.isPro && (
            <button 
              onClick={() => { HapticService.light(); openPaywall(); }}
              className="w-full bg-[#BAE1FF] text-blue-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-transform active:scale-95"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Preferences Section */}
        <div>
          <h5 className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-2 mb-3">Preferences</h5>
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-50">
            <SettingsItem icon={<Lucide.Bell size={18} />} label="Daily Reminders" onClick={handleRemindersClick} />
            <SettingsItem icon={<Lucide.ShieldCheck size={18} />} label="Privacy & Security" onClick={() => setActiveLegalModal('privacy')} />
            <SettingsItem icon={<Lucide.MessageSquare size={18} />} label="Send Feedback" onClick={handleFeedbackClick} />
          </div>
        </div>

        {/* Community Section */}
        <div>
          <h5 className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-2 mb-3">Join the Community</h5>
          <div className="bg-white rounded-3xl p-6 border border-gray-50 flex justify-around">
            <CommunityButton icon={<Lucide.Instagram size={24} />} label="@packslight" onClick={() => handleCommunityClick('https://instagram.com/packslight')} />
            <div className="w-px h-10 bg-gray-50" />
            <CommunityButton icon={<Lucide.Twitter size={24} />} label="@RevenueCat" onClick={() => handleCommunityClick('https://x.com/RevenueCat')} />
          </div>
        </div>

        {/* Information Section */}
        <div>
          <h5 className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-2 mb-3">Information</h5>
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-50">
            <SettingsItem icon={<Lucide.FileText size={18} />} label="Terms of Service" onClick={() => { HapticService.light(); setActiveLegalModal('terms'); }} />
            <SettingsItem icon={<Lucide.Shield size={18} />} label="Privacy Policy" onClick={() => { HapticService.light(); setActiveLegalModal('privacy'); }} />
            <SettingsItem icon={<Lucide.RefreshCcw size={18} />} label="Reset Journey" variant="danger" onClick={handleResetJourney} />
          </div>
        </div>
      </div>
      
      <p className="text-center text-[9px] text-gray-300 mt-16 font-black uppercase tracking-[0.3em] pb-12">
        StepOne v1.3.0 • @packslight Edition
      </p>

      {/* Full Screen Legal Modals */}
      {activeLegalModal && (
        <LegalModal 
          type={activeLegalModal} 
          onClose={() => setActiveLegalModal(null)} 
        />
      )}
    </div>
  );
};

const SettingsItem = ({ icon, label, onClick, variant }: { icon: React.ReactNode; label: string; onClick: () => void; variant?: 'danger' }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-50 last:border-0"
  >
    <div className="flex items-center space-x-4">
      <div className={`${variant === 'danger' ? 'text-red-300' : 'text-gray-400'}`}>{icon}</div>
      <span className={`font-bold text-sm ${variant === 'danger' ? 'text-red-300' : 'text-gray-700'}`}>{label}</span>
    </div>
    <Lucide.ChevronRight size={16} className="text-gray-200" strokeWidth={3} />
  </button>
);

const CommunityButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-2 transition-transform active:scale-90">
    <div className="text-gray-800">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>
  </button>
);

const LegalModal: React.FC<{ type: 'terms' | 'privacy', onClose: () => void }> = ({ type, onClose }) => (
  <div className="fixed inset-0 z-[300] bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
    {/* Safe Area Header */}
    <div className="h-24 w-full bg-gray-50 flex items-end justify-between px-6 pb-4 border-b border-gray-100 shrink-0">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
      </span>
      <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
        <Lucide.X size={24} />
      </button>
    </div>
    
    <div className="flex-1 overflow-y-auto p-8 space-y-6 text-sm text-gray-600 leading-relaxed font-medium">
      {type === 'privacy' ? (
        <>
          <h2 className="text-3xl font-bold text-gray-800 font-display italic">Privacy Policy</h2>
          <p>StepOne is committed to protecting your privacy. This policy describes how we handle your personal data across our iOS and Android applications.</p>
          
          <h3 className="text-lg font-bold text-gray-800">1. Information We Collect</h3>
          <p>We use Apple Sign-In and Google Sign-In to verify your identity. This provides us with your email address and a unique identifier. We also utilize RevenueCat to process and manage your subscription tokens securely.</p>
          
          <h3 className="text-lg font-bold text-gray-800">2. Usage of Data</h3>
          <p>Your journey progress (stamps, streaks, ambitions) is stored locally on your device using AsyncStorage. If you create an account, this data is synchronized with our secure servers to ensure continuity across devices.</p>
          
          <h3 className="text-lg font-bold text-gray-800">3. Purchase History</h3>
          <p>Subscription data is handled by RevenueCat. StepOne does not store credit card information; all financial transactions are processed by Apple or Google in accordance with their respective privacy policies.</p>
          
          <h3 className="text-lg font-bold text-gray-800">4. Your Rights</h3>
          <p>You may request a full deletion of your account and data at any time through the "Reset Journey" feature or by contacting support. Note that resetting progress within the app does not cancel active subscriptions.</p>
          
          <p className="text-[10px] text-gray-400 italic mt-8 border-t border-gray-100 pt-4">Last updated: October 20, 2023</p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 font-display italic">Terms of Service</h2>
          <p>By accessing StepOne, you agree to be bound by these terms. Please read them carefully.</p>
          
          <h3 className="text-lg font-bold text-gray-800">1. License & Usage</h3>
          <p>StepOne grants you a personal, non-exclusive license to use the app for personal growth and habit tracking. You agree not to reverse engineer or modify the application for unauthorized use.</p>
          
          <h3 className="text-lg font-bold text-gray-800">2. Content & Safety</h3>
          <p>The "Missions" provided are suggestions for micro-habits. Users are responsible for their own safety when performing physical or travel-related tasks. StepOne is not liable for any injuries sustained while participating in challenges.</p>
          
          <h3 className="text-lg font-bold text-gray-800">3. Subscriptions (RevenueCat)</h3>
          <p>Pro features are enabled via subscription. Payments are managed by your OS provider. Cancellation must be performed through your Apple/Google account settings. StepOne does not provide refunds directly.</p>
          
          <h3 className="text-lg font-bold text-gray-800">4. Limitation of Liability</h3>
          <p>StepOne is provided "as is". We make no guarantees regarding the continuous availability of the service or the synchronization of local data across all network conditions.</p>
          
          <p className="text-[10px] text-gray-400 italic mt-8 border-t border-gray-100 pt-4">Last updated: October 20, 2023</p>
        </>
      )}
      <div className="h-24" /> {/* Spacer for safe area bottom */}
    </div>
  </div>
);
