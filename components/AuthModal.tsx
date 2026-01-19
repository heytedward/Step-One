
import React, { useState } from 'react';
import { HapticService } from '../services/haptics';
import * as Lucide from 'lucide-react';
import { COLORS } from '../constants';

interface AuthModalProps {
  onSuccess: (userId: string) => void;
  onClose?: () => void;
  isConversion?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onClose, isConversion }) => {
  const [loading, setLoading] = useState(false);

  const handleAppleSignIn = async () => {
    HapticService.success();
    setLoading(true);
    // Simulate Apple ID Auth
    await new Promise(r => setTimeout(r, 1200));
    const mockUserId = 'apple_user_' + Math.random().toString(36).substr(2, 9);
    onSuccess(mockUserId);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 flex flex-col items-center text-center">
        {isConversion && (
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-6 animate-bounce">
            <Lucide.ShieldCheck size={40} />
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-gray-800 mb-3 font-display">
          {isConversion ? 'Journey Started!' : 'Welcome Back'}
        </h2>
        
        <p className="text-gray-500 text-sm mb-10 leading-relaxed px-2">
          {isConversion 
            ? 'Create an account to sync your stamps and never lose your progress as you evolve.' 
            : 'Sign in to sync your progress across all your devices.'}
        </p>

        <button 
          onClick={handleAppleSignIn}
          disabled={loading}
          className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center space-x-3 font-bold transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lucide.Apple size={20} className="mb-0.5" />
              <span>Sign in with Apple</span>
            </>
          )}
        </button>

        {isConversion && (
          <button 
            onClick={() => { HapticService.light(); onClose?.(); }}
            className="mt-6 text-gray-300 font-bold text-xs uppercase tracking-widest hover:text-gray-400 transition-colors"
          >
            Keep Exploring as Guest
          </button>
        )}
      </div>
    </div>
  );
};
