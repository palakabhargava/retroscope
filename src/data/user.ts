import type { Mood } from './movies';

export type Plan = 'free-reel' | 'cinevault' | 'retroscope-gold' | 'directors-cut';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarSeed: string;
  bio: string;
  favoriteGenres: string[];
  plan: Plan;
  trialStartedAt: string; // ISO
  dnaType: 'Plot Twist Hunter' | 'Comfort Rewatcher' | 'Classic Cinema Lover' | 'Midnight Thriller Fan' | 'Emotional Explorer';
  achievements: { id: string; label: string; icon: string }[];
  moodHistory: { mood: Mood; count: number }[];
  watchStats: { watched: number; hours: number; reviews: number; favorites: number };
  role: 'user' | 'admin';
}

export const DEMO_USER: UserProfile = {
  id: 'u-001',
  username: 'reel_wanderer',
  email: 'demo@retroscope.app',
  avatarSeed: 'reel-wanderer',
  bio: 'Projectionist at heart. Collects ticket stubs and rainstorms.',
  favoriteGenres: ['Drama', 'Sci-Fi', 'Noir'],
  plan: 'cinevault',
  trialStartedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  dnaType: 'Midnight Thriller Fan',
  achievements: [
    { id: 'a1', label: 'First Reel', icon: '🎞' },
    { id: 'a2', label: '50 Tickets', icon: '🎟' },
    { id: 'a3', label: 'Night Owl', icon: '🌙' },
    { id: 'a4', label: 'Critic Voice', icon: '✍️' },
  ],
  moodHistory: [
    { mood: 'night-vibes', count: 14 },
    { mood: 'thriller-rush', count: 9 },
    { mood: 'comfort-watch', count: 6 },
    { mood: 'emotional', count: 5 },
    { mood: 'rainy-mood', count: 4 },
    { mood: 'happy', count: 3 },
  ],
  watchStats: { watched: 41, hours: 73, reviews: 12, favorites: 18 },
  role: 'user',
};

export const PLANS: { id: Plan; name: string; price: string; tagline: string; perks: string[]; highlight?: boolean }[] = [
  { id: 'free-reel', name: 'Free Reel', price: '$0', tagline: 'A taste of the theatre', perks: ['Standard catalogue', 'Mood recommendations', 'Standard player'] },
  { id: 'cinevault', name: 'CineVault', price: '$5/mo', tagline: 'For the Saturday cinephile', perks: ['Full catalogue', 'Vintage tickets history', 'HD ambient lighting'], highlight: true },
  { id: 'retroscope-gold', name: 'RetroScope Gold', price: '$9/mo', tagline: 'Cinema, in chrome', perks: ['Movie Taste DNA', 'Scene Heatmap', 'Dynamic UI'] },
  { id: 'directors-cut', name: "Director's Cut", price: '$14/mo', tagline: 'Front row, every night', perks: ['All Gold features', 'Early premieres', 'Director commentary unlocked'] },
];
