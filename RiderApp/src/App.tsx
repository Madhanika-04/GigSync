import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RiderHeader } from './components/rider/Header';
import { Sidebar } from './components/rider/Sidebar';
import { Dashboard } from './components/rider/Dashboard';
import { ProfilePage } from './components/rider/ProfilePage';
import { ClaimsPage } from './components/rider/ClaimsPage';
import { ExplorePage } from './components/rider/ExplorePage';
import { BottomNav, type ViewType } from './components/rider/BottomNav';
import { MOCK_RIDER, type InsurancePolicy, type Platform as RiderPlatform, type RiderPayout } from './data/mock';
import { API_BASE_URL, HOMEPAGE_URL } from './config';

type RiderClaimStatus = 'Processing' | 'Approved' | 'Paid' | 'Rejected';
type RiderClaimDisruption = 'Heavy Rain' | 'Pollution' | 'Air Pollution' | 'Extreme Heat' | 'Zone Closure';

interface RiderClaimRecord {
  id: string;
  date: string;
  disruption: RiderClaimDisruption;
  location: string;
  incomeLoss: number;
  payout: number;
  status: RiderClaimStatus;
  rainfallMm?: number;
  ordersDropped?: number;
  paymentMethod?: string;
  txnId?: string;
  aqiLevel?: number;
}

interface SessionUser {
  id: string;
  role: 'rider';
  name: string;
  email: string;
  selectedPlan: string | null;
  platform: string | null;
  city: string | null;
  totalPayouts: number;
  payoutHistory: RiderPayout[];
  activeClaim: RiderClaimRecord | null;
  claimHistory: RiderClaimRecord[];
}

function normalizeClaimHistory(value: unknown): RiderClaimRecord[] {
  return Array.isArray(value) ? value as RiderClaimRecord[] : [];
}

const PLAN_DETAILS: Record<string, { coverageType: string; weeklyPremium: number; coverageLimit: number; maxPayoutPerEvent: number; bioLabel: string; avgDailyIncome: number; avgWeeklyIncome: number; rating: number; riskMessage: string; }> = {
  Basic: {
    coverageType: 'Starter Weather Shield',
    weeklyPremium: 59,
    coverageLimit: 1200,
    maxPayoutPerEvent: 1200,
    bioLabel: 'Starter Protection',
    avgDailyIncome: 520,
    avgWeeklyIncome: 3200,
    rating: 4.5,
    riskMessage: 'Low Risk Zone',
  },
  Standard: {
    coverageType: 'Balanced Weather Shield',
    weeklyPremium: 79,
    coverageLimit: 1500,
    maxPayoutPerEvent: 1500,
    bioLabel: 'Standard Protection',
    avgDailyIncome: 620,
    avgWeeklyIncome: 3800,
    rating: 4.6,
    riskMessage: 'Moderate Risk Zone',
  },
  Plus: {
    coverageType: 'Weather + Pollution Pulse',
    weeklyPremium: 99,
    coverageLimit: 1800,
    maxPayoutPerEvent: 1800,
    bioLabel: 'Plus Protection',
    avgDailyIncome: 700,
    avgWeeklyIncome: 4500,
    rating: 4.8,
    riskMessage: 'Managed Medium Risk Zone',
  },
  Premium: {
    coverageType: 'Premium Weather + Pollution Shield',
    weeklyPremium: 149,
    coverageLimit: 2500,
    maxPayoutPerEvent: 2500,
    bioLabel: 'Premium Protection',
    avgDailyIncome: 840,
    avgWeeklyIncome: 5300,
    rating: 4.9,
    riskMessage: 'High Risk Zone',
  },
  Elite: {
    coverageType: 'Elite Fleet Protection Shield',
    weeklyPremium: 199,
    coverageLimit: 3200,
    maxPayoutPerEvent: 3200,
    bioLabel: 'Elite Protection',
    avgDailyIncome: 980,
    avgWeeklyIncome: 6100,
    rating: 5,
    riskMessage: 'Priority Protection Zone',
  },
};

function resolvePlanName(selectedPlan: string | null | undefined): keyof typeof PLAN_DETAILS {
  if (!selectedPlan) return 'Plus';

  const normalized = selectedPlan.trim().toLowerCase();
  if (normalized === 'basic') return 'Basic';
  if (normalized === 'standard') return 'Standard';
  if (normalized === 'plus') return 'Plus';
  if (normalized === 'premium') return 'Premium';
  if (normalized === 'elite') return 'Elite';

  return 'Plus';
}

function getCityZone(city: string) {
  const normalizedCity = city.trim().toLowerCase();
  if (normalizedCity.includes('cbe') || normalizedCity.includes('coimbatore')) return 'Cbe Central';
  if (normalizedCity.includes('salem')) return 'Salem Hub';
  if (normalizedCity.includes('madurai')) return 'Madurai Urban';
  if (normalizedCity.includes('trichy')) return 'Trichy Core';
  return `${city} South`;
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<ViewType>('dashboard');
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  const syncSessionFromBackend = async (redirectOnFailure: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
        credentials: 'include',
      });

      if (!response.ok) {
        setAuthState('unauthenticated');
        if (redirectOnFailure) {
          window.location.href = `${HOMEPAGE_URL}/rider/auth?mode=signin`;
        }
        return;
      }

      const result = await response.json();
      if (result.user?.role !== 'rider') {
        setAuthState('unauthenticated');
        if (redirectOnFailure) {
          window.location.href = `${HOMEPAGE_URL}/rider/auth?mode=signin`;
        }
        return;
      }

      setSessionUser(result.user);
      setAuthState('authenticated');
    } catch {
      if (redirectOnFailure) {
        setAuthState('unauthenticated');
        window.location.href = `${HOMEPAGE_URL}/rider/auth?mode=signin`;
      }
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    void syncSessionFromBackend(true);
  }, []);

  useEffect(() => {
    if (authState !== 'authenticated') {
      return;
    }

    const intervalId = window.setInterval(() => {
      void syncSessionFromBackend(false);
    }, 10000);

    const refreshOnVisibility = () => {
      if (document.visibilityState === 'visible') {
        void syncSessionFromBackend(false);
      }
    };

    document.addEventListener('visibilitychange', refreshOnVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshOnVisibility);
    };
  }, [authState]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      window.location.href = HOMEPAGE_URL;
    }
  };

  const handleClaimTriggered = (updatedUser: SessionUser, triggeredClaim?: RiderClaimRecord) => {
    setSessionUser(previous => {
      const safePreviousClaimHistory = normalizeClaimHistory(previous?.claimHistory);
      const safeUpdatedClaimHistory = normalizeClaimHistory(updatedUser?.claimHistory);
      const previousActiveClaim = previous?.activeClaim ?? null;
      const activeClaim = updatedUser?.activeClaim ?? triggeredClaim ?? previousActiveClaim;
      const claimHistory = safeUpdatedClaimHistory.length > 0
        ? safeUpdatedClaimHistory
        : triggeredClaim
          ? (previousActiveClaim ? [previousActiveClaim, ...safePreviousClaimHistory] : safePreviousClaimHistory)
          : safePreviousClaimHistory;

      return {
        ...(previous ?? updatedUser),
        ...updatedUser,
        claimHistory,
        activeClaim,
      };
    });
    setView('claims');
  };

  const activePlanName = resolvePlanName(sessionUser?.selectedPlan);
  const activePlan = PLAN_DETAILS[activePlanName];
  const activeCity = sessionUser?.city ?? MOCK_RIDER.city;
  const activePlatform = (sessionUser?.platform as RiderPlatform | null) ?? MOCK_RIDER.platform;
  const activeZone = getCityZone(activeCity);
  const riderFirstName = (sessionUser?.name ?? MOCK_RIDER.name).split(' ')[0];

  const riderProfile = {
    ...MOCK_RIDER,
    id: sessionUser?.id ? `RID-${sessionUser.id.slice(-4).toUpperCase()}` : MOCK_RIDER.id,
    name: sessionUser?.name ?? MOCK_RIDER.name,
    email: sessionUser?.email ?? MOCK_RIDER.email,
    bio: `${activePlan.bioLabel} Delivery Partner | ${activePlanName} Plan`,
    platform: activePlatform,
    zone: activeZone,
    city: activeCity,
    rating: activePlan.rating,
    avgDailyIncome: activePlan.avgDailyIncome,
    avgWeeklyIncome: activePlan.avgWeeklyIncome,
    address: {
      ...MOCK_RIDER.address,
      cityState: `${activeCity}, Tamil Nadu`,
    },
    social: {
      facebook: riderFirstName.toLowerCase(),
      twitter: `@${riderFirstName.toLowerCase()}_${activePlanName.toLowerCase()}`,
      linkedin: `${riderFirstName.toLowerCase()}-${activePlanName.toLowerCase()}-gig`,
      instagram: `@${riderFirstName.toLowerCase()}_${activePlatform.toLowerCase()}`,
    },
  };

  const activePolicy: InsurancePolicy = {
    policyId: sessionUser?.id ? `POL-${activePlanName.toUpperCase()}-${sessionUser.id.slice(-6).toUpperCase()}` : `POL-${activePlanName.toUpperCase()}-2026`,
    status: 'Active',
    coverageType: activePlan.coverageType,
    weeklyPremium: activePlan.weeklyPremium,
    coverageLimit: activePlan.coverageLimit,
    maxPayoutPerEvent: activePlan.maxPayoutPerEvent,
    startDate: '14 Mar 2026',
    expiryDate: '14 Apr 2026',
  };

  const totalPayouts = typeof sessionUser?.totalPayouts === 'number' ? sessionUser.totalPayouts : 0;
  const payoutHistory = Array.isArray(sessionUser?.payoutHistory) ? sessionUser.payoutHistory : [];
  const rawActiveClaim = sessionUser?.activeClaim ?? null;
  const baseClaimHistory = normalizeClaimHistory(sessionUser?.claimHistory);
  const settledActiveClaim = rawActiveClaim && (rawActiveClaim.status === 'Approved' || rawActiveClaim.status === 'Paid' || rawActiveClaim.status === 'Rejected')
    ? {
      ...rawActiveClaim,
      status: rawActiveClaim.status === 'Approved' ? 'Paid' : rawActiveClaim.status,
    }
    : null;
  const claimHistory = settledActiveClaim && !baseClaimHistory.some(claim => claim.id === settledActiveClaim.id)
    ? [settledActiveClaim, ...baseClaimHistory]
    : baseClaimHistory;
  const activeClaim = settledActiveClaim ? null : rawActiveClaim;

  if (authState !== 'authenticated' || !sessionUser) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-border/50 bg-card px-8 py-7 text-center shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">GigSync Rider</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight">Checking your rider session</h1>
          <p className="mt-2 text-sm text-muted-foreground">Validating your login before opening the rider dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 antialiased font-sans selection:bg-primary/20">

      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <Sidebar
        activeView={view}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
        riderName={riderProfile.name}
        riderPlatform={riderProfile.platform}
      />

      {/* ── Main area — shifts right on desktop by sidebar width ── */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">

        {/* Top Header — full-width above content */}
        <RiderHeader theme={theme} toggleTheme={toggleTheme} setView={setView} riderName={riderProfile.name} onLogout={handleLogout} />

        {/* Page content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 pb-32 lg:pb-10">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Dashboard rider={riderProfile} policy={activePolicy} totalPayouts={totalPayouts} payoutHistory={payoutHistory} riskMessage={activePlan.riskMessage} />
              </motion.div>
            )}
            {view === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <ProfilePage rider={riderProfile} policy={activePolicy} />
              </motion.div>
            )}
            {view === 'search' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <ExplorePage
                  riderZone={activeZone}
                  riderCity={activeCity}
                  onClaimTriggered={handleClaimTriggered}
                />
              </motion.div>
            )}
            {view === 'claims' && (
              <motion.div
                key="claims"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <ClaimsPage activeClaim={activeClaim} claimHistory={claimHistory} riderZone={activeZone} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer — only on desktop */}
        <footer className="hidden lg:block border-t border-border/30 py-6 px-8 opacity-40">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            <span>© 2025 GigSync · AI-Powered Parametric Insurance</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Compliance</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Mobile Bottom Nav (hidden on desktop) ── */}
      <BottomNav activeView={view} setView={setView} />
    </div>
  );
}

export default App;
