import React, { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../contracts/contractConfig";
import { useLanguage } from "../context/LanguageContext";
import { formatEth, formatEthFixed, formatAddress, formatDateTime } from "../utils/format";
import {
  IconTrendingUp, IconHeartHandshake, IconCoins, IconCheckCircle, IconExternalLink, IconSparkles
} from "../components/Icons";

const DashboardPage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statusVariant = (status) => {
    switch (status) {
      case "requested": return "status-pill status-requested";
      case "approved":  return "status-pill status-approved";
      case "executed":  return "status-pill status-executed";
      default:          return "status-pill status-active";
    }
  };

  return (
    <div className="page-container">
      <div className="page-title-box">
        <h1>
          <span style={{ color: "var(--primary)", display: "inline-flex", alignItems: "center", marginRight: 10 }}>
            <IconTrendingUp size={28} />
          </span>
          {t('dashboard.title')}
        </h1>
        <p>{t('dashboard.subtitle')}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>{t('dashboard.loading')}</p>
        </div>
      ) : !stats ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p>{t('dashboard.errorLoading')}</p>
        </div>
      ) : (
        <div>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                <IconSparkles size={22} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalCampaigns}</h3>
                <p>{t('dashboard.totalCampaigns')}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--pink-bg)", color: "var(--pink)" }}>
                <IconHeartHandshake size={22} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalDonations}</h3>
                <p>{t('dashboard.totalDonations')}</p>
              </div>
            </div>

            <div className="stat-card highlight-green">
              <div className="stat-icon" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                <IconCoins size={22} />
              </div>
              <div className="stat-info">
                <h3>{formatEthFixed(stats.totalDonatedWei)} ETH</h3>
                <p>{t('dashboard.totalDonated')}</p>
              </div>
            </div>

            <div className="stat-card highlight-blue">
              <div className="stat-icon" style={{ background: "var(--info-bg)", color: "var(--info)" }}>
                <IconTrendingUp size={22} />
              </div>
              <div className="stat-info">
                <h3>{formatEth(stats.totalDistributedWei)} ETH</h3>
                <p>{t('dashboard.totalDistributed')}</p>
              </div>
            </div>
          </div>

          {/* Recent Donations Table */}
          <div className="section-box" style={{ marginTop: "36px" }}>
            <div className="section-header">
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--success)" }}><IconHeartHandshake size={20} /></span>
                {t('dashboard.recentDonations')}
              </h2>
              <button className="btn-refresh" onClick={fetchStats} aria-label="Refresh dashboard data">
                {t('dashboard.refreshData')}
              </button>
            </div>

            {stats.recentDonations.length === 0 ? (
              <p className="text-muted" style={{ padding: "20px 0" }}>{t('dashboard.noDonations')}</p>
            ) : (
              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>{t('dashboard.campaign')}</th>
                      <th>{t('dashboard.donorWallet')}</th>
                      <th>{t('dashboard.amountEth')}</th>
                      <th>{t('dashboard.timestamp')}</th>
                      <th>{t('dashboard.verification')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentDonations.map((d) => (
                      <tr key={d._id || d.transactionHash}>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                            #{d.blockchainCampaignId}
                          </span>
                        </td>
                        <td>
                          <code className="hash-pill" title={d.donorWallet}>
                            {formatAddress(d.donorWallet)}
                          </code>
                        </td>
                        <td>
                          <strong style={{ color: "var(--success)" }}>+{formatEth(d.amount)} ETH</strong>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                          {formatDateTime(d.timestamp)}
                        </td>
                        <td>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${d.transactionHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="link-etherscan"
                            aria-label="View on Etherscan"
                            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            {d.transactionHash.substring(0, 10)}...
                            <IconExternalLink size={13} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Distributions Table */}
          <div className="section-box" style={{ marginTop: "28px" }}>
            <div className="section-header">
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--primary)" }}><IconCoins size={20} /></span>
                {t('dashboard.recentDistributions')}
              </h2>
            </div>

            {stats.recentDistributions.length === 0 ? (
              <p className="text-muted" style={{ padding: "20px 0" }}>{t('dashboard.noDistributions')}</p>
            ) : (
              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>{t('dashboard.campaign')}</th>
                      <th>{t('dashboard.recipient')}</th>
                      <th>{t('dashboard.purpose')}</th>
                      <th>{t('dashboard.distAmount')}</th>
                      <th>{t('dashboard.distStatus')}</th>
                      <th>{t('dashboard.timestamp')}</th>
                      <th>{t('dashboard.verification')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentDistributions.map((dist) => (
                      <tr key={dist._id || dist.blockchainRequestId}>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                            #{dist.blockchainCampaignId}
                          </span>
                        </td>
                        <td>
                          <code className="hash-pill" title={dist.recipient}>
                            {formatAddress(dist.recipient)}
                          </code>
                        </td>
                        <td style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {dist.purpose}
                        </td>
                        <td>
                          <strong style={{ color: "var(--danger)" }}>-{formatEthFixed(dist.amount)} ETH</strong>
                        </td>
                        <td>
                          <span className={statusVariant(dist.status)}>
                            {dist.status === "executed" && <IconCheckCircle size={13} />}
                            {" "}{dist.status}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                          {formatDateTime(dist.timestamp)}
                        </td>
                        <td>
                          {dist.transactionHash ? (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${dist.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="link-etherscan"
                              aria-label="View on Etherscan"
                              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                            >
                              {dist.transactionHash.substring(0, 10)}...
                              <IconExternalLink size={13} />
                            </a>
                          ) : (
                            <span style={{ color: "var(--text-dim)" }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;