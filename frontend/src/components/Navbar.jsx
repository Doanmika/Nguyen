import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { IconHeartHandshake, IconWallet, IconShieldCheck, IconAlertCircle, IconMoon, IconSun, IconGlobe } from './Icons';

const Navbar = ({ theme, onToggleTheme }) => {
  const { account, isAdmin, isSepolia, connectWallet, disconnectWallet, switchToSepolia, setToastFn } = useWallet();
  const { language, toggleLanguage, t } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const currentTheme = theme || 'light';

  useEffect(() => {
    if (setToastFn) {
      setToastFn(toast);
    }
  }, [setToastFn, toast]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleSwitchNetwork = async () => {
    setIsSwitchingNetwork(true);
    try {
      await switchToSepolia();
      toast.success(t('navbar.switchNetwork') + ' thành công');
    } catch (err) {
      toast.error(t('navbar.switchNetwork') + ' thất bại');
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand-group">
          <Link to="/" className="nav-logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Transparent Charity Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
            <span>Transparent Charity</span>
          </Link>
          <span className="nav-badge-net">{t('navbar.networkBadge')}</span>
          <button
            className="nav-menu-toggle"
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div id="primary-navigation" className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>
            {t('navbar.home')}
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={closeMenu}>
            {t('navbar.dashboard')}
          </Link>
          <Link to="/organization" className={isActive('/organization') ? 'active' : ''} onClick={closeMenu}>
            {t('navbar.organization')}
          </Link>
          {isAdmin && (
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''} onClick={closeMenu}>
              {t('navbar.admin')}
            </Link>
          )}
        </div>

        <div className="nav-wallet">
          <button
            className="lang-toggle"
            onClick={toggleLanguage}
            aria-label={t('common.language')}
            title={t('common.language')}
          >
            <IconGlobe size={17} />
            <span className="lang-text">{language === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={currentTheme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            title={currentTheme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            aria-pressed={currentTheme === 'dark'}
          >
            {currentTheme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
          </button>

          {account && !isSepolia && (
            <button className="btn-warning" onClick={handleSwitchNetwork} disabled={isSwitchingNetwork}>
              <IconAlertCircle size={15} />
              {isSwitchingNetwork ? t('common.loading') : t('navbar.switchNetwork')}
            </button>
          )}

          {account ? (
            <div className="wallet-badge">
              <span className="dot-status"></span>
              {isAdmin && (
                <span title={t('navbar.adminBadge')} style={{ color: 'var(--primary)', display: 'flex' }}>
                  <IconShieldCheck size={16} />
                </span>
              )}
              <span className="wallet-address" title={account}>{formatAddress(account)}</span>
              <button className="btn-small-disconnect" onClick={disconnectWallet} title={t('navbar.disconnectWallet')}>
                ✕
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={connectWallet}>
              <IconWallet size={16} />
              {t('navbar.connectWallet')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;