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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function hydrate(s: Session | null) {
    setSession(s);
    setAuthUser(s?.user ?? null);
    if (!s?.user) { setProfile(null); setIsAdmin(false); return; }

    // Fetch profile + admin role in parallel
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', s.user.id).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', s.user.id),
    ]);

    const admin = !!roles?.some(r => r.role === 'admin');
    setIsAdmin(admin);

    if (p) {
      setProfile({
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
      });
    } else {
      setProfile({ ...DEMO_USER, id: s.user.id, email: s.user.email ?? '', role: admin ? 'admin' : 'user' });
    }
  }

  useEffect(() => {
    // 1) Subscribe FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      // Defer Supabase reads to avoid deadlock inside callback
      setTimeout(() => { void hydrate(s); }, 0);
    });
    // 2) Then check existing session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      void hydrate(s).finally(() => setLoading(false));
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (username: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { username },
      },
    });
    if (error) throw error;
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const setPlan = async (p: Plan) => {
    if (!authUser) return;
    const { error } = await supabase.from('profiles').update({ plan: p }).eq('id', authUser.id);
    if (error) throw error;
    setProfile(prev => prev ? { ...prev, plan: p } : prev);
  };

  const trialDaysLeft = profile
    ? Math.max(0, 15 - Math.floor((Date.now() - new Date(profile.trialStartedAt).getTime()) / 86400000))
    : 0;
  const isPremium = !!profile && (profile.plan === 'retroscope-gold' || profile.plan === 'directors-cut' || trialDaysLeft > 0);

  const value: AuthState = {
    isAuthenticated: !!session,
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
