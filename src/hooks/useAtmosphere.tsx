import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

export interface AtmosphereConfig {
  background: string;
  card: string;
  primary: string;
  accent: string;
  glow: string;
  text: string;
  border: string;
}

export const ATMOSPHERE_PALETTES: Record<string, AtmosphereConfig> = {
  classic: {
    background: 'oklch(0.20 0.005 60)',      // #1B1B1B
    card: 'oklch(0.25 0.005 60)',            // #2A2A2A
    primary: 'oklch(0.74 0.16 50)',          // #FF8C42
    accent: 'oklch(0.74 0.16 50)',
    glow: 'oklch(0.80 0.13 60)',             // #FFB067
    text: 'oklch(0.93 0.04 85)',             // #F2E8CF
    border: 'oklch(0.32 0.005 60)',          // #3A3A3A
  },
  anime: {
    background: '#0B1020',
    card: '#111827',
    primary: '#FF4D8D',
    accent: '#7C3AED',
    glow: '#FF66C4',
    text: '#F9FAFB',
    border: '#1F2937',
  },
  kids: {
    background: '#0F172A',
    card: '#1E293B',
    primary: '#38BDF8',
    accent: '#F59E0B',
    glow: '#A5F3FC',
    text: '#FFFFFF',
    border: '#334155',
  },
  mature: {
    background: '#050505',
    card: '#111111',
    primary: '#991B1B',
    accent: '#7C2D12',
    glow: '#DC2626',
    text: '#F3F4F6',
    border: '#222222',
  },
  
  // Content Overrides
  salaar: {
    background: '#060B08', // smoky dark green
    card: '#111613',
    primary: '#8A1515',    // deep red
    accent: '#1C3D26',     // dark green
    glow: '#DC2626',
    text: '#F3F4F6',
    border: '#1F2921',
  },
  interstellar: {
    background: '#02020A', // cosmic deep blue
    card: '#0D0E1C',
    primary: '#60A5FA',    // cosmic blue
    accent: '#94A3B8',     // cosmic silver
    glow: '#3B82F6',
    text: '#F8FAFC',
    border: '#1E293B',
  },
  cyberpunk: {
    background: '#0D0214', // dark cyber purple
    card: '#1A0B2E',
    primary: '#FF007F',    // neon pink
    accent: '#00F0FF',     // neon cyan
    glow: '#FF00FF',
    text: '#FAFAFA',
    border: '#3A0F5C',
  },
  romance: {
    background: '#1F0C14', // warm dark pink
    card: '#3D1525',
    primary: '#F472B6',    // pink glow
    accent: '#FB923C',     // sunset orange
    glow: '#F472B6',
    text: '#FFF1F2',
    border: '#5C1D36',
  },
  horror: {
    background: '#050000', // absolute black
    card: '#140505',       // charcoal red
    primary: '#991B1B',    // blood red
    accent: '#260404',     // flickering shadow
    glow: '#EF4444',
    text: '#E5E7EB',
    border: '#3F0707',
  }
};

type AtmosphereType = keyof typeof ATMOSPHERE_PALETTES;

interface AtmosphereContextType {
  atmosphere: AtmosphereType;
  config: AtmosphereConfig;
  setAtmosphere: (atm: AtmosphereType) => void;
  resetAtmosphere: () => void;
}

const AtmosphereContext = createContext<AtmosphereContextType | undefined>(undefined);

export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState?.location?.pathname || '/';

  // Base default state deduced from active URL path
  const getDefaultAtmosphereFromPath = (path: string): AtmosphereType => {
    if (path.startsWith('/anime')) return 'anime';
    if (path.startsWith('/kids')) return 'kids';
    if (path.startsWith('/mature')) return 'mature';
    return 'classic';
  };

  const initialAtmosphere = getDefaultAtmosphereFromPath(currentPath);
  const [overrideAtmosphere, setOverrideAtmosphere] = useState<AtmosphereType | null>(null);

  const activeAtmosphere = overrideAtmosphere || initialAtmosphere;
  const config = ATMOSPHERE_PALETTES[activeAtmosphere] || ATMOSPHERE_PALETTES.classic;

  // Sync route path changes
  useEffect(() => {
    // When route path shifts, clear any custom content overrides automatically
    // so we return to the appropriate universe baseline cleanly
    setOverrideAtmosphere(null);
  }, [currentPath]);

  // Inject CSS Variables on document.documentElement dynamically for 60fps interpolation
  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    root.style.setProperty('--background', config.background);
    root.style.setProperty('--card', config.card);
    root.style.setProperty('--card-foreground', config.text);
    root.style.setProperty('--popover', config.card);
    root.style.setProperty('--popover-foreground', config.text);
    root.style.setProperty('--primary', config.primary);
    root.style.setProperty('--accent', config.accent);
    root.style.setProperty('--hover-glow', config.glow);
    root.style.setProperty('--foreground', config.text);
    root.style.setProperty('--border', config.border);
    root.style.setProperty('--input', config.border);
    root.style.setProperty('--ring', config.primary);
  }, [config]);

  const setAtmosphere = (atm: AtmosphereType) => {
    setOverrideAtmosphere(atm);
  };

  const resetAtmosphere = () => {
    setOverrideAtmosphere(null);
  };

  return (
    <AtmosphereContext.Provider value={{ atmosphere: activeAtmosphere, config, setAtmosphere, resetAtmosphere }}>
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  const context = useContext(AtmosphereContext);
  if (!context) {
    throw new Error('useAtmosphere must be used within an AtmosphereProvider');
  }
  return context;
}
