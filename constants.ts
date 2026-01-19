
import { Challenge, Ambition } from './types';

export const COLORS = {
  pink: '#ffb3ba',
  orange: '#ffdfba',
  yellow: '#ffffba',
  green: '#baffc9',
  blue: '#bae1ff',
  white: '#FFFFFF',
  text: '#4A4A4A',
  bgSoft: '#FFFBFA',
  deepText: '#1A202C',
  passportTeal: '#0F4C47', // Deep leather teal
  gold: '#D4AF37'
};

export const AMBITION_CONTENT: Record<Ambition, { foundation: Challenge[], journey: Challenge[] }> = {
  Travel: {
    foundation: [
      { id: 'tf1', title: 'Hydrate Foundation', description: 'Adventure requires fuel. Drink 16oz of water.', durationSeconds: 30, level: 1, isPremium: false, icon: 'Zap' },
      { id: 'tf2', title: 'Gear Check', description: 'Ensure your travel bag is tidy and ready.', durationSeconds: 60, level: 1, isPremium: false, icon: 'Zap' }
    ],
    journey: Array.from({ length: 30 }, (_, i) => ({
      id: `travel-${i + 1}`,
      title: `Day ${i + 1}: ${['Passport Research', 'Flight Alert Setup', 'Language Basics', 'Budgeting for Paris', 'Packing List'][i % 5]}`,
      description: `Step ${i + 1} toward your solo travel dream. Build confidence through action.`,
      durationSeconds: 120 + (i * 30),
      level: Math.floor(i / 7) + 1,
      isPremium: i >= 7,
      icon: 'Globe'
    }))
  },
  Business: {
    foundation: [
      { id: 'bf1', title: 'Deep Work Block', description: 'Define your top 3 tasks for the day.', durationSeconds: 60, level: 1, isPremium: false, icon: 'Zap' },
      { id: 'bf2', title: 'Networking Reach', description: 'Draft a message to a potential collaborator.', durationSeconds: 60, level: 1, isPremium: false, icon: 'Zap' }
    ],
    journey: Array.from({ length: 30 }, (_, i) => ({
      id: `biz-${i + 1}`,
      title: `Day ${i + 1}: ${['Mission Statement', 'Identify Competitors', 'Social Media Bio', 'Logo Concept', 'First Customer Map'][i % 5]}`,
      description: `Step ${i + 1} toward launching your business. Consistency is key.`,
      durationSeconds: 120 + (i * 30),
      level: Math.floor(i / 7) + 1,
      isPremium: i >= 7,
      icon: 'Briefcase'
    }))
  },
  Hobby: {
    foundation: [
      { id: 'hf1', title: 'Supply Setup', description: 'Organize your creative materials.', durationSeconds: 60, level: 1, isPremium: false, icon: 'Zap' },
      { id: 'hf2', title: 'Inspiration Search', description: 'Save 3 references that inspire your work.', durationSeconds: 60, level: 1, isPremium: false, icon: 'Zap' }
    ],
    journey: Array.from({ length: 30 }, (_, i) => ({
      id: `hobby-${i + 1}`,
      title: `Day ${i + 1}: ${['Color Theory', 'Drafting Basics', 'Community Search', 'Practice Session', 'Feedback Request'][i % 5]}`,
      description: `Step ${i + 1} toward mastering your new craft. Enjoy the process.`,
      durationSeconds: 120 + (i * 30),
      level: Math.floor(i / 7) + 1,
      isPremium: i >= 7,
      icon: 'Palette'
    }))
  },
  Health: {
    foundation: [
      { id: 'zf1', title: 'Movement Break', description: '30 seconds of dynamic stretching.', durationSeconds: 30, level: 1, isPremium: false, icon: 'Zap' },
      { id: 'zf2', title: 'Hydration Goal', description: 'Finish a full glass of water.', durationSeconds: 30, level: 1, isPremium: false, icon: 'Zap' }
    ],
    journey: Array.from({ length: 30 }, (_, i) => ({
      id: `health-${i + 1}`,
      title: `Day ${i + 1}: ${['Meal Prep Basics', 'Sleep Audit', 'Sunlight Exposure', 'Mindful Eating', 'Step Count Goal'][i % 5]}`,
      description: `Step ${i + 1} toward a healthier you. Small steps, big changes.`,
      durationSeconds: 120 + (i * 30),
      level: Math.floor(i / 7) + 1,
      isPremium: i >= 7,
      icon: 'Heart'
    }))
  }
};

export const STAMP_COLORS = [COLORS.pink, COLORS.orange, COLORS.blue, COLORS.green];
