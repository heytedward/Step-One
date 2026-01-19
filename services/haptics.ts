
export const HapticService = {
  success: () => {
    // Heavy haptic pulse
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 50, 200]);
    }
  },
  warning: () => {
    // Medium haptic for timer resets
    if ('vibrate' in navigator) {
      navigator.vibrate([150]);
    }
  },
  notification: (type: 'Warning' | 'Success' | 'Error') => {
    if ('vibrate' in navigator) {
      if (type === 'Warning') navigator.vibrate([100, 30, 100, 30, 100]);
      else if (type === 'Error') navigator.vibrate([200, 100, 200]);
      else navigator.vibrate([50, 50, 50]);
    }
  },
  light: () => {
    // Selection/Light haptic for buttons
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }
};
