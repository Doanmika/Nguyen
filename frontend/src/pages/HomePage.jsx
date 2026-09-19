import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../contracts/contractConfig';
import { useLanguage } from '../context/LanguageContext';
import { formatEth, calcProgress, getDaysRemaining, formatDate, formatAddress } from '../utils/format';
import {
  IconSparkles,
  IconArrowRight,
  IconShieldCheck,
  IconClock,
  IconBuilding
} from '../components/Icons';

const HomePage = () => {
  const { t, language } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (err) {
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return (
    <div className="page-container">
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-pill">
            <IconShieldCheck size={16} />
            <span>{t('home.verifiedBadge')}</span>
          </div>
          <h1>{t('home.heroTitle')}</h1>
          <p>{t('home.heroSubtitle')}</p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              <IconSparkles size={16} />
              {t('home.exploreLedger')}
            </Link>
            <Link to="/organization" className="btn-secondary">
              <IconBuilding size={16} />
              {t('home.forOrganizations')}
            </Link>
          </div>
        </div>
      </section>

      <section className="campaigns-section">
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {t('home.activeCampaigns')}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t('home.campaignsSubtitle')}
            </p>
          </div>
          <button className="btn-refresh" onClick={fetchCampaigns}>
            {t('common.refresh')}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>{t('home.loadingCampaigns')}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state">
            <IconSparkles size={36} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <h3>{t('home.noCampaigns')}</h3>
            <p style={{ marginTop: '6px' }}>{t('home.createFirstCampaignDesc') || 'You can take the role of an Organization to create the first campaign right now.'}</p>
            <Link to="/organization" className="btn-primary" style={{ marginTop: '20px' }}>
              <IconBuilding size={16} />
              {t('home.createFirstCampaign')}
            </Link>
          </div>
        ) : (
          <div className="campaign-grid">
            {campaigns.map((c) => {
              const progress = calcProgress(c.totalDonated, c.goalAmount);
              const daysRemaining = getDaysRemaining(c.endDate);

              return (
                <div key={c._id || c.blockchainCampaignId} className="campaign-card">
                  <div className="card-top">
                    <span className="card-id-tag">#CAMPAIGN-{c.blockchainCampaignId}</span>
                    <span className={`status-pill status-${c.status}`}>
                      <span className="dot-status"></span>
                      {c.status === 'active' ? t('home.statusActive') : t('home.statusEnded')}
                    </span>
                  </div>

                  <h3 className="card-title">{c.title}</h3>
                  <p className="card-desc">{c.description || 'No detailed description provided by the organizing organization.'}</p>

                  <div className="card-progress-box">
                    <div className="progress-header">
                      <span className="progress-amount">
                        {formatEth(c.totalDonated)} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>ETH</span>
                      </span>
                      <span className="progress-percent-badge">{progress}%</span>
                    </div>

                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="progress-sub">
                      <span>{t('home.goal')}: <strong>{formatEth(c.goalAmount)} ETH</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IconClock size={13} />
                        {daysRemaining > 0 ? t('home.daysRemaining', { days: daysRemaining }) : t('home.expired')}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer-meta">
                    <div>
                      {t('home.organization')}: <code>{formatAddress(c.organizationWallet)}</code>
                    </div>
                    <div>
                      {formatDate(c.startDate, language)}
                    </div>
                  </div>

                  <Link to={`/campaign/${c.blockchainCampaignId}`} className="btn-card-action">
                    {t('home.donateDetail')}
                    <IconArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;