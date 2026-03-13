import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RiderHeader } from './components/rider/Header';
import { Sidebar } from './components/rider/Sidebar';
import { Dashboard } from './components/rider/Dashboard';
import { ProfilePage } from './components/rider/ProfilePage';
import { ClaimsPage } from './components/rider/ClaimsPage';
import { ExplorePage } from './components/rider/ExplorePage';
import { BottomNav, type ViewType } from './components/rider/BottomNav';
import { MOCK_RIDER, MOCK_POLICY } from './data/mock';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<ViewType>('dashboard');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 antialiased font-sans selection:bg-primary/20">

      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <Sidebar
        activeView={view}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
        riderName={MOCK_RIDER.name}
        riderPlatform={MOCK_RIDER.platform}
      />

      {/* ── Main area — shifts right on desktop by sidebar width ── */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">

        {/* Top Header — full-width above content */}
        <RiderHeader theme={theme} toggleTheme={toggleTheme} setView={setView} />

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
                <Dashboard />
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
                <ProfilePage rider={MOCK_RIDER} policy={MOCK_POLICY} />
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
                <ExplorePage />
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
                <ClaimsPage />
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
