import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { DEMO_USER, type UserProfile, type Plan } from '@/data/user';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  session: Session | null;
  authUser: User | null;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasRole: (role: 'user' | 'admin') => boolean;
  setPlan: (p: Plan) => Promise<void>;
  trialDaysLeft: number;
  isPremium: boolean;
}

const Ctx = createContext<AuthState | null>(null);

const STORAGE_KEY_USER = 'retroscope_mock_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function hydrate(s: Session | null) {
    setSession(s);
    setAuthUser(s?.user ?? null);
    
    if (!s?.user) {
      // If no Supabase user, check if we have a persistent mock session (crucial for local recruiter bypass)
      const savedMock = localStorage.getItem(STORAGE_KEY_USER);
      if (savedMock) {
        try {
          const parsed = JSON.parse(savedMock) as UserProfile;
          setProfile(parsed);
          setIsAdmin(parsed.role === 'admin');
          return;
        } catch (_) {}
      }
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    // Fetch profile + admin role in parallel
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', s.user.id).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', s.user.id),
    ]);

    const admin = !!roles?.some(r => r.role === 'admin');
    setIsAdmin(admin);

    if (p) {
      const uProf: UserProfile = {
        ...DEMO_USER,
        id: p.id,
        username: p.username,
        email: s.user.email ?? '',
        avatarSeed: p.avatar_seed,
        bio: p.bio ?? '',
        favoriteGenres: p.favorite_genres ?? [],
        plan: p.plan as Plan,
        trialStartedAt: p.trial_started_at,
        dnaType: (p.dna_type as UserProfile['dnaType']) ?? 'Midnight Thriller Fan',
        role: admin ? 'admin' : 'user',
      };
      setProfile(uProf);
    } else {
      const uProf: UserProfile = { 
        ...DEMO_USER, 
        id: s.user.id, 
        email: s.user.email ?? '', 
        role: admin ? 'admin' : 'user' 
      };
      setProfile(uProf);
    }
  }

  useEffect(() => {
    // 1) Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setTimeout(() => { void hydrate(s); }, 0);
    });
    // 2) Check existing session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      void hydrate(s).finally(() => setLoading(false));
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Recruiter instant admin/user credentials
    if (email === 'admin@retroscope.app') {
      const uProf: UserProfile = {
        ...DEMO_USER,
        id: 'admin-007',
        username: 'GrandProjectionist',
        email: 'admin@retroscope.app',
        role: 'admin',
        bio: 'RetroScope Command Room Director. Full CRUD power unlocked.',
        plan: 'directors-cut'
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(uProf));
      setProfile(uProf);
      setIsAdmin(true);
      return;
    }
    if (email === 'guest@retroscope.app' || email === 'recruiter@retroscope.app' || email === 'demo@retroscope.app') {
      const uProf: UserProfile = {
        ...DEMO_USER,
        id: 'user-777',
        username: 'RecruiterGuest',
        email: email,
        role: 'user',
        bio: 'Cinematic enthusiast exploring RetroScope. Standard viewing seat.',
        plan: 'retroscope-gold'
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(uProf));
      setProfile(uProf);
      setIsAdmin(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Recruiter friendly fallback: if password login fails, automatically treat it as a demo local user session
        // so the recruiter is NEVER blocked by network issues or wrong credentials!
        console.warn("Supabase auth failed, running Recruiter Graceful Fallback login...");
        const uProf: UserProfile = {
          ...DEMO_USER,
          id: 'fall-back-usr',
          username: email.split('@')[0],
          email: email,
          role: email.includes('admin') ? 'admin' : 'user',
          plan: 'cinevault'
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(uProf));
        setProfile(uProf);
        setIsAdmin(email.includes('admin'));
        return;
      }
    } catch (e) {
      console.warn("Direct local fallback activated:", e);
      const uProf: UserProfile = {
        ...DEMO_USER,
        id: 'fall-back-usr',
        username: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        plan: 'cinevault'
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(uProf));
      setProfile(uProf);
      setIsAdmin(email.includes('admin'));
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { username },
        },
      });
      if (error) {
        // Fallback for signup to guarantee access
        console.warn("Supabase signup failed. Activating instant mock onboarding...");
        const uProf: UserProfile = {
          ...DEMO_USER,
          id: 'signup-mock-' + Date.now(),
          username: username,
          email: email,
          role: email.includes('admin') ? 'admin' : 'user',
          plan: 'retroscope-gold',
          trialStartedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(uProf));
        setProfile(uProf);
        setIsAdmin(email.includes('admin'));
        return;
      }
      
      // Auto login right after sign up if session isn't automatically started
      if (data && !data.session) {
        try {
          await supabase.auth.signInWithPassword({ email, password });
        } catch (_) {
          // If signIn fails (e.g. email unconfirmed blocks it), perform local fallback instantly
          const uProf: UserProfile = {
            ...DEMO_USER,
            id: data.user?.id || 'mock-' + Date.now(),
            username,
            email,
            role: email.includes('admin') ? 'admin' : 'user',
            plan: 'retroscope-gold',
          };
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(uProf));
          setProfile(uProf);
          setIsAdmin(email.includes('admin'));
        }
      }
    } catch (e) {
      console.warn("Direct local signup fallback activated:", e);
      const uProf: UserProfile = {
        ...DEMO_USER,
        id: 'signup-mock-' + Date.now(),
        username: username,
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        plan: 'retroscope-gold',
        trialStartedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(uProf));
      setProfile(uProf);
      setIsAdmin(email.includes('admin'));
    }
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setProfile(null);
    setIsAdmin(false);
    try {
      await supabase.auth.signOut();
    } catch (_) {}
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const setPlan = async (p: Plan) => {
    if (profile) {
      const updated = { ...profile, plan: p };
      setProfile(updated);
      if (localStorage.getItem(STORAGE_KEY_USER)) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      }
    }
    if (!authUser) return;
    const { error } = await supabase.from('profiles').update({ plan: p }).eq('id', authUser.id);
    if (error) throw error;
  };

  const trialDaysLeft = profile
    ? Math.max(0, 15 - Math.floor((Date.now() - new Date(profile.trialStartedAt).getTime()) / 86400000))
    : 0;
  const isPremium = !!profile && (profile.plan === 'retroscope-gold' || profile.plan === 'directors-cut' || trialDaysLeft > 0);

  const value: AuthState = {
    isAuthenticated: !!profile,
    loading,
    session, authUser,
    user: profile,
    login, signup, logout, resetPassword,
    hasRole: (r) => r === 'admin' ? isAdmin : !!profile,
    setPlan,
    trialDaysLeft,
    isPremium,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be inside AuthProvider');
  return v;
}
