import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { API_BASE_URL } from '../contracts/contractConfig';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { formatEth, formatAddress, formatDate, formatDateTime } from '../utils/format';
import { parseBlockchainError } from '../utils/errorUtils';
import {
  IconExternalLink,
  IconWallet,
  IconCheckCircle,
  IconAlertCircle,
  IconCoins
} from '../components/Icons';

const CampaignDetail = () => {
  const { id } = useParams();
  const { account, contract, isSepolia, connectWallet, switchToSepolia } = useWallet();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();

  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [donationAmount, setDonationAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [txSuccess, setTxSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const cRes = await fetch(`${API_BASE_URL}/campaigns/${id}`);
      const cData = await cRes.json();
      if (cData.success) {
        setCampaign(cData.data);
      }

      const dRes = await fetch(`${API_BASE_URL}/donations/campaign/${id}`);
      const dData = await dRes.json();
      if (dData.success) {
        setDonations(dData.data);
      }

      const distRes = await fetch(`${API_BASE_URL}/distributions/campaign/${id}`);
      const distData = await distRes.json();
      if (distData.success) {
        setDistributions(distData.data);
      }
    } catch (err) {
      console.error('Error fetching campaign details:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setTxSuccess(null);

    if (!account) {
      toast.error(t('campaignDetail.connectWalletFirst'));
      return;
    }

    if (!isSepolia) {
      toast.error(t('campaignDetail.switchNetworkFirst'));
      return;
    }

    if (!contract) {
      setErrorMsg(t('campaignDetail.contractNotFound'));
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setErrorMsg(t('campaignDetail.enterValidAmount'));
      return;
    }

    try {
      setDonating(true);
      const weiAmount = ethers.parseEther(donationAmount);

      const tx = await contract.donate(Number(id), { value: weiAmount });
      console.log('Transaction pending:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      try {
        await fetch(`${API_BASE_URL}/donations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blockchainCampaignId: Number(id),
            donorWallet: account,
            amount: weiAmount.toString(),
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (beErr) {
        console.warn('Backend sync error:', beErr);
      }

      setTxSuccess(tx.hash);
      setDonationAmount('');
      fetchData();
    } catch (err) {
      console.error('Donation error:', err);
      setErrorMsg(parseBlockchainError(err));
    } finally {
      setDonating(false);
    }
  };

  if (!campaign) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>{t('campaignDetail.loadingDetails')}</p>
        </div>
      </div>
    );
  }

  const donatedEth = parseFloat(formatEth(campaign.totalDonated));
  const goalEth = parseFloat(formatEth(campaign.goalAmount));
  const distributedEth = parseFloat(formatEth(campaign.totalDistributed));
  const remainingFundsEth = (donatedEth - distributedEth).toFixed(4);
  const progressPercent = goalEth > 0 ? Math.min(100, Math.round((donatedEth / goalEth) * 100)) : 0;

  return (
    <div className="page-container">
      <Link to="/" className="btn-back" onClick={() => navigate(-1)}>
        {t('campaignDetail.backToList')}
      </Link>

      <div className="detail-layout">
        {/* Main Column */}
        <div className="detail-main-col">
          {/* Header Card */}
          <div className="card-panel detail-header-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span className="hash-pill">
                {t('campaignDetail.campaignId', { id: campaign.blockchainCampaignId })}
              </span>
              <span className={`status-pill status-${campaign.status}`}>
                <span className="dot-status"></span>
                {campaign.status === 'active' ? t('campaignDetail.statusOpen') : t('campaignDetail.statusClosed')}
              </span>
            </div>

            <h1>{campaign.title}</h1>

            <div className="detail-org-tag">
              <span>{t('campaignDetail.organizer')}:</span>
              <span className="hash-pill">
                {formatAddress(campaign.organizationWallet)}
              </span>
            </div>

            {/* Financial Overview Metrics */}
            <div className="detail-stats-grid">
              <div className="metric-item">
                <span className="metric-label">{t('campaignDetail.donated')}</span>
                <span className="metric-value highlight-green">{donatedEth} ETH</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">{t('campaignDetail.goal')}</span>
                <span className="metric-value">{goalEth} ETH</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">{t('campaignDetail.distributed')}</span>
                <span className="metric-value">{distributedEth} ETH</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">{t('campaignDetail.availableFunds')}</span>
                <span className="metric-value highlight-blue">{remainingFundsEth} ETH</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-bg" style={{ height: '10px' }}>
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>{t('campaignDetail.progressAchieved', { percent: progressPercent })}</span>
              <span>{t('campaignDetail.deadline')}: {formatDate(campaign.endDate)}</span>
            </div>
          </div>

          {/* Description Card */}
          <div className="card-panel">
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>{t('campaignDetail.purposeAndPlan')}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {campaign.description || t('campaignDetail.noDescription')}
            </p>
          </div>

          {/* Donor Ledger Table */}
          <div className="card-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{t('campaignDetail.donorLedger', { count: donations.length })}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('campaignDetail.donorLedgerSubtitle')}</p>
              </div>
              <span className="nav-badge-net">On-Chain Verified</span>
            </div>

            {donations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                {t('campaignDetail.noDonations')}
              </p>
            ) : (
              <div className="table-container">
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>{t('campaignDetail.donorWallet')}</th>
                        <th>{t('campaignDetail.amount')}</th>
                        <th>{t('campaignDetail.time')}</th>
                        <th>{t('campaignDetail.verification')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((d) => (
                        <tr key={d._id || d.transactionHash}>
                          <td>
                            <span className="font-mono">
                              {formatAddress(d.donorWallet)}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--success)' }}>+{formatEth(d.amount)} ETH</strong>
                          </td>
                          <td>{formatDateTime(d.timestamp)}</td>
                          <td>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${d.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hash-pill"
                            >
                              {d.transactionHash.substring(0, 8)}...
                              <IconExternalLink size={12} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Distribution History Table */}
          <div className="card-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{t('campaignDetail.distributionHistory', { count: distributions.length })}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('campaignDetail.distributionSubtitle')}</p>
              </div>
              <span className="nav-badge-net">Audited</span>
            </div>

            {distributions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                {t('campaignDetail.noDistributions')}
              </p>
            ) : (
              <div className="table-container">
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>{t('campaignDetail.recipient')}</th>
                        <th>{t('campaignDetail.purpose')}</th>
                        <th>{t('campaignDetail.distAmount')}</th>
                        <th>{t('campaignDetail.distStatus')}</th>
                        <th>{t('common.txHash')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {distributions.map((dist) => (
                        <tr key={dist._id || dist.blockchainRequestId}>
                          <td>
                            <span className="font-mono">
                              {formatAddress(dist.recipient)}
                            </span>
                          </td>
                          <td>{dist.purpose}</td>
                          <td>
                            <strong style={{ color: 'var(--danger)' }}>-{formatEth(dist.amount)} ETH</strong>
                          </td>
                          <td>
                            <span className={`status-pill status-${dist.status}`}>
                              {dist.status}
                            </span>
                          </td>
                          <td>
                            {dist.transactionHash ? (
                              <a
                                href={`https://sepolia.etherscan.io/tx/${dist.transactionHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hash-pill"
                              >
                                {dist.transactionHash.substring(0, 8)}...
                                <IconExternalLink size={12} />
                              </a>
                            ) : (
                              <span style={{ color: 'var(--text-dim)' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Donation Terminal */}
        <div className="sticky-sidebar">
          <div className="donate-terminal-card">
            <div className="donate-terminal-header">
              <h3>
                <IconCoins size={20} style={{ color: 'var(--primary)' }} />
                {t('campaignDetail.donateTerminal')}
              </h3>
              <p>{t('campaignDetail.donateTerminalDesc')}</p>
            </div>

            {!account ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {t('campaignDetail.connectToDonate')}
                </p>
                <button className="btn-primary full-width" onClick={connectWallet}>
                  <IconWallet size={16} />
                  {t('common.connectWallet')}
                </button>
              </div>
            ) : !isSepolia ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div className="alert-box alert-error">
                  <IconAlertCircle size={18} />
                  <div>{t('campaignDetail.wrongNetwork')}</div>
                </div>
                <button className="btn-warning full-width" onClick={switchToSepolia}>
                  {t('campaignDetail.switchNetworkBtn')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonate}>
                <div className="form-group">
                  <label>{t('campaignDetail.donationAmountLabel')}</label>
                  <div className="input-with-adornment">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="0.01"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      disabled={donating}
                      required
                    />
                    <span className="input-adornment-badge">ETH</span>
                  </div>
                </div>

                <div className="quick-amount-pills">
                  {t('campaignDetail.quickAmounts')}
                  {['0.005', '0.01', '0.05'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className="btn-quick-pill"
                      onClick={() => setDonationAmount(amt)}
                      disabled={donating}
                    >
                      +{amt} ETH
                    </button>
                  ))}
                </div>

                {errorMsg && (
                  <div className="alert-box alert-error">
                    <IconAlertCircle size={18} />
                    <div>{errorMsg}</div>
                  </div>
                )}

                {txSuccess && (
                  <div className="alert-box alert-success" style={{ flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconCheckCircle size={18} />
                      <strong>{t('campaignDetail.donationSuccess')}</strong>
                    </div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txSuccess}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tx-verify-link"
                    >
                      {t('campaignDetail.verifyOnEtherscan')}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={donating}
                  style={{ padding: '12px' }}
                >
                  {donating ? t('campaignDetail.donating') : t('campaignDetail.donateButton')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;