import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Lock, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase';
import { useAuth } from '@/lib/auth';

interface AgeVerificationData {
  verified: boolean;
  timestamp: number;
  expiryDate: number;
  ipHash?: string;
}

export function useAgeVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const VERIFICATION_KEY = 'retroscope_age_verified';
  const VERIFICATION_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days
  const AGE_REQUIREMENT = 18;

  // Check local verification status on mount
  useEffect(() => {
    const checkVerification = () => {
      try {
        const stored = localStorage.getItem(VERIFICATION_KEY);
        if (stored) {
          const data: AgeVerificationData = JSON.parse(stored);
          if (data.verified && Date.now() < data.expiryDate) {
            setIsVerified(true);
            setShowModal(false);
            return;
          }
        }
      } catch (e) {
        console.error('Error checking verification:', e);
      }
      setShowModal(true);
    };

    checkVerification();
  }, []);

  const trackVerification = async (verified: boolean) => {
    if (!user) return;

    try {
      // Save to Supabase for privacy-aware tracking
      await supabase
        .from('age_verifications')
        .insert({
          user_id: user.id,
          verified,
          verified_at: new Date().toISOString(),
          ip_hash: await getIpHash(), // Hash for privacy
        })
        .throwOnError();
    } catch (error) {
      console.error('Failed to track verification:', error);
      // Still proceed even if tracking fails
    }
  };

  const handleVerify = async (age: number) => {
    setLoading(true);
    try {
      const verified = age >= AGE_REQUIREMENT;
      
      // Track verification
      await trackVerification(verified);

      // Store locally
      const data: AgeVerificationData = {
        verified,
        timestamp: Date.now(),
        expiryDate: Date.now() + VERIFICATION_EXPIRY,
      };
      localStorage.setItem(VERIFICATION_KEY, JSON.stringify(data));

      if (verified) {
        setIsVerified(true);
        setShowModal(false);
      } else {
        // Show error for underage
        alert(`Sorry, you must be ${AGE_REQUIREMENT} years old to access this content.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    isVerified,
    showModal,
    setShowModal,
    handleVerify,
    loading,
  };
}

async function getIpHash(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data.ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '';
  }
}

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerify: (age: number) => void;
  loading?: boolean;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onVerify,
  loading = false,
}) => {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedAge !== null) {
      onVerify(selectedAge);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-lg bg-background border border-border shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 px-6 py-8 border-b border-border/50">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Age Verification Required
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This content is restricted to users 18 years or older
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-8 space-y-6">
              {/* Privacy Notice */}
              <div className="flex items-start gap-3 p-3 rounded-md bg-blue-500/5 border border-blue-500/20">
                <Lock className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Your age verification is stored securely and privately. We hash your IP for anonymity.
                </p>
              </div>

              {/* Age Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Enter your age:
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={selectedAge ?? ''}
                  onChange={(e) => setSelectedAge(e.target.value ? parseInt(e.target.value) : null)}
                  disabled={loading}
                  placeholder="Enter your age"
                  className="w-full px-4 py-2.5 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Or select:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[18, 21, 25].map((age) => (
                    <button
                      key={age}
                      onClick={() => setSelectedAge(age)}
                      disabled={loading}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                        selectedAge === age
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border text-foreground hover:border-primary/50'
                      } disabled:opacity-50`}
                    >
                      {age}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {submitted && selectedAge !== null && selectedAge < 18 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-sm text-red-400"
                >
                  You must be 18 years or older.
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/50 flex gap-3">
              <button
                onClick={() => {
                  // Close without verification - blocks access
                  window.history.back();
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-md bg-background border border-border text-foreground hover:bg-background/80 transition disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedAge === null || loading}
                className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to guard routes
export function useAgeGuard(requiredAge: number = 18) {
  const [hasAccess, setHasAccess] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('retroscope_age_verified');
      if (stored) {
        const data: AgeVerificationData = JSON.parse(stored);
        if (data.verified && Date.now() < data.expiryDate) {
          setHasAccess(true);
          return;
        }
      }
    } catch (e) {
      console.error('Error checking age guard:', e);
    }
    
    setShowVerification(true);
  }, []);

  return { hasAccess, showVerification, setShowVerification };
}
