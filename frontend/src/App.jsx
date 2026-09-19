import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import CampaignDetail from './pages/CampaignDetail';
import OrganizationPage from './pages/OrganizationPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
          <h2>Có lỗi xảy ra</h2>
          <pre style={{ textAlign: 'left', maxWidth: '600px', margin: '20px auto', padding: '20px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', overflow: 'auto' }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} className="btn-primary">
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const THEME_STORAGE_KEY = 'charity-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  let storedTheme = null;
  try {
    storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    storedTheme = null;
  }

  if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <WalletProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <div className="app-layout">
              <Navbar theme={theme} onToggleTheme={toggleTheme} />
              <main className="main-content">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/campaign/:id" element={<CampaignDetail />} />
                    <Route path="/organization" element={<OrganizationPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                  </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </WalletProvider>
  );
}

export default App;

