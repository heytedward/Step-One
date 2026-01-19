
import React, { useState, useEffect } from 'react';
import { UserState, Tab, Stamp, Ambition } from './types';
import { StorageService } from './services/storage';
import { RevenueCatService } from './services/revenueCat';
import { Onboarding } from './components/Onboarding';
import { TodayView } from './components/TodayView';
import { PassportView } from './components/PassportView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';
import { Paywall } from './components/Paywall';
import { AuthModal } from './components/AuthModal';

const App: React.FC = () => {
  const [state, setState] = useState<UserState>(() => {
    const loaded = StorageService.loadState();
    // Daily Reset Logic
    const today = new Date().toISOString().split('T')[0];
    if (loaded.lastCompletionDate?.split('T')[0] !== today) {
      return { ...loaded, completedFoundationIds: [] };
    }
    return loaded;
  });

  const [activeTab, setActiveTab] = useState<Tab>(Tab.Today);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isConversionFlow, setIsConversionFlow] = useState(false);

  useEffect(() => { StorageService.saveState(state); }, [state]);

  const handleChallengeComplete = (stamp: Stamp, type: 'foundation' | 'journey') => {
    const today = new Date().toISOString();
    const isFirstStamp = state.stamps.length === 0;

    setState(prev => ({
      ...prev,
      lastCompletionDate: today,
      streak: prev.lastCompletionDate?.split('T')[0] === new Date(Date.now() - 86400000).toISOString().split('T')[0] ? prev.streak + 1 : 1,
      completedFoundationIds: type === 'foundation' ? [...prev.completedFoundationIds, stamp.challengeId] : prev.completedFoundationIds,
      completedJourneyDay: type === 'journey' ? prev.completedJourneyDay + 1 : prev.completedJourneyDay,
      stamps: [stamp, ...prev.stamps],
    }));

    // Trigger Guest-to-User conversion flow after 1st stamp ONLY if they haven't subscribed
    if (isFirstStamp && state.isGuest && !state.isPro) {
      setTimeout(() => {
        setIsConversionFlow(true);
        setShowAuth(true);
      }, 2500); // Delay for confetti to finish
    }
  };

  const handleOnboardingComplete = (ambition: Ambition) => {
    setState(p => ({ ...p, hasCompletedOnboarding: true, userAmbition: ambition }));
    setPaywallMessage(null);
    setShowPaywall(true);
  };

  const handleUpdateAmbition = (ambition: Ambition) => {
    setState(p => ({ ...p, userAmbition: ambition }));
  };

  const handleOpenPaywall = (msg?: string) => {
    setPaywallMessage(msg || null);
    setShowPaywall(true);
  };

  const handleAuthSuccess = (userId: string) => {
    setState(p => ({ ...p, isGuest: false, userId }));
    setShowAuth(false);
    setIsConversionFlow(false);
  };

  const handleReset = () => {
    // Clear storage and reset state to initial (triggering onboarding)
    const newState = StorageService.clearState();
    // Maintain subscription state from local mock if it exists (simulate RC server-side persistence)
    const isPro = localStorage.getItem('is_pro_mock') === 'true';
    
    setState({
      ...newState,
      isPro: isPro // Don't wipe the purchase history/status
    });
    setActiveTab(Tab.Today);
  };

  if (!state.hasCompletedOnboarding) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} onRequestPaywall={() => handleOpenPaywall()} />
        {showPaywall && (
          <Paywall ambition={state.userAmbition} message={paywallMessage} onClose={() => setShowPaywall(false)} onSuccess={() => { setState(p => ({ ...p, isPro: true })); setShowPaywall(false); }} />
        )}
      </>
    );
  }

  return (
    <div className="h-screen w-full bg-[#FFFBFA] flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden text-gray-800">
      {/* Status Bar Spacer */}
      <div className="h-10 w-full bg-[#FDFCFB]" />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeTab === Tab.Today && (
          <TodayView 
            userState={state} 
            onChallengeComplete={handleChallengeComplete} 
            onUpdateAmbition={handleUpdateAmbition}
            openPaywall={handleOpenPaywall} 
          />
        )}
        {activeTab === Tab.Passport && <PassportView userState={state} onTabChange={setActiveTab} />}
        {activeTab === Tab.Settings && (
          <SettingsView 
            userState={state} 
            onReset={handleReset} 
            openPaywall={() => handleOpenPaywall()} 
            openAuth={() => { setIsConversionFlow(false); setShowAuth(true); }}
          />
        )}
      </main>

      <BottomNav currentTab={activeTab} onTabChange={setActiveTab} />

      {/* Overlays */}
      {showPaywall && (
        <Paywall 
          ambition={state.userAmbition} 
          message={paywallMessage}
          onClose={() => setShowPaywall(false)} 
          onSuccess={() => { setState(p => ({ ...p, isPro: true })); setShowPaywall(false); }} 
        />
      )}
      
      {showAuth && (
        <AuthModal 
          isConversion={isConversionFlow} 
          onSuccess={handleAuthSuccess} 
          onClose={() => setShowAuth(false)} 
        />
      )}
    </div>
  );
};

export default App;
