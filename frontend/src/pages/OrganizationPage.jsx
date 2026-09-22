import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { API_BASE_URL } from '../contracts/contractConfig';
import { useLanguage } from '../context/LanguageContext';
import { formatEth, formatDate } from '../utils/format';
import { parseBlockchainError } from '../utils/errorUtils';
import {
  IconWallet, IconBuilding, IconCoins, IconCheckCircle, IconAlertCircle, IconClock
} from '../components/Icons';

const OrganizationPage = () => {
  const { account, contract, isSepolia, connectWallet, switchToSepolia } = useWallet();
  const { t } = useLanguage();

  // State cho Form tao chien dich
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalEth, setGoalEth] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(null);

  // State cho Form tao yeu cau phan phoi
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [distAmountEth, setDistAmountEth] = useState('');
  const [purpose, setPurpose] = useState('');
  const [creatingDist, setCreatingDist] = useState(false);
  const [distSuccess, setDistSuccess] = useState(null);

  // Danh sach chien dich cua to chuc
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [distErrorMsg, setDistErrorMsg] = useState('');

  const fetchMyCampaigns = useCallback(async () => {
    if (!account) return;
    try {
      setLoadingCampaigns(true);
      const res = await fetch(`${API_BASE_URL}/campaigns/organization/${account}`);
      const data = await res.json();
      if (data.success) {
        setMyCampaigns(data.data);
        if (data.data.length > 0) {
          setSelectedCampaignId((prev) => prev || data.data[0].blockchainCampaignId.toString());
        }
      }
    } catch (err) {
      console.error('Error fetching organization campaigns:', err);
    } finally {
      setLoadingCampaigns(false);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      fetchMyCampaigns();
    }
  }, [account, fetchMyCampaigns]);

  // Xu ly tao chien dich tren Blockchain
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setCampaignSuccess(null);

    if (!account || !contract) {
      setErrorMsg(t('organization.contractNotFound'));
      return;
    }

    try {
      setCreatingCampaign(true);
      const goalWei = ethers.parseEther(goalEth);
      const duration = Number(durationDays);

      console.log('Sending createCampaign transaction to blockchain...');
      const tx = await contract.createCampaign(title, description, goalWei, duration);
      console.log('Tx hash:', tx.hash);

      const receipt = await tx.wait();
      console.log('Tx mined:', receipt);

      // Doc event CampaignCreated tu receipt hoac lay so luong campaignCount
      let createdId = 0;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed && parsed.name === 'CampaignCreated') {
            createdId = Number(parsed.args[0]);
            break;
          }
        } catch (e) {
          // Khong phai event cua contract nay thi bo qua
        }
      }

      if (!createdId) {
        // Fallback: goi contract.campaignCount()
        const count = await contract.campaignCount();
        createdId = Number(count);
      }

      // Luu vao backend database
      const now = new Date();
      const end = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
      await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockchainCampaignId: createdId,
          title,
          description,
          organizationWallet: account,
          goalAmount: goalWei.toString(),
          startDate: now.toISOString(),
          endDate: end.toISOString(),
          transactionHash: tx.hash,
        }),
      });

      setCampaignSuccess(t('organization.campaignSuccess', { id: createdId, hash: tx.hash }));
      setTitle('');
      setDescription('');
      setGoalEth('');
      fetchMyCampaigns();
    } catch (err) {
      console.error('Error creating campaign:', err);
      setErrorMsg(parseBlockchainError(err));
    } finally {
      setCreatingCampaign(false);
    }
  };

  // Xu ly tao yeu cau phan phoi tren Blockchain
  const handleCreateDistribution = async (e) => {
    e.preventDefault();
    setDistErrorMsg('');
    setDistSuccess(null);

    if (!account || !contract) {
      setDistErrorMsg(t('organization.contractNotFound'));
      return;
    }

    if (!selectedCampaignId) {
      setDistErrorMsg(t('organization.noCampaignSelected'));
      return;
    }

    try {
      setCreatingDist(true);
      const amountWei = ethers.parseEther(distAmountEth);

      console.log('Sending createDistributionRequest transaction to blockchain...');
      const tx = await contract.createDistributionRequest(
        Number(selectedCampaignId),
        recipient,
        amountWei,
        purpose
      );
      const receipt = await tx.wait();

      let reqId = 0;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed && parsed.name === 'FundDistributionRequested') {
            reqId = Number(parsed.args[0]);
            break;
          }
        } catch (e) {}
      }

      if (!reqId) {
        const count = await contract.requestCount();
        reqId = Number(count);
      }

      // Luu vao backend
      await fetch(`${API_BASE_URL}/distributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockchainRequestId: reqId,
          blockchainCampaignId: Number(selectedCampaignId),
          organizationWallet: account,
          recipient,
          amount: amountWei.toString(),
          purpose,
          transactionHash: tx.hash,
        }),
      });

      setDistSuccess(t('organization.distributionSuccess', { id: reqId, hash: tx.hash }));
      setRecipient('');
      setDistAmountEth('');
      setPurpose('');
    } catch (err) {
      console.error('Error creating distribution request:', err);
      setDistErrorMsg(parseBlockchainError(err));
    } finally {
      setCreatingDist(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-title-box">
        <h1><IconBuilding size={28} /> {t('organization.title')}</h1>
        <p>{t('organization.subtitle')}</p>
      </div>

      {!account ? (
        <div className="form-card" style={{ margin: '0 auto', maxWidth: '420px', textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ width: 56, height: 56, background: 'var(--primary-light)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
            <IconWallet size={28} />
          </div>
          <h3 style={{ marginBottom: 8 }}>{t('organization.connectWalletTitle')}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>{t('organization.connectWalletDesc')}</p>
          <button className="btn-primary full-width" onClick={connectWallet} aria-label="Connect MetaMask wallet">
            🦊 {t('common.connectWallet')}
          </button>
        </div>
      ) : !isSepolia ? (
        <div className="form-card" style={{ margin: '0 auto', maxWidth: '420px', textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ width: 56, height: 56, background: 'var(--warning-bg)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--warning)' }}>
            <IconAlertCircle size={28} />
          </div>
          <h3 style={{ marginBottom: 8 }}>{t('organization.wrongNetworkTitle')}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>{t('organization.wrongNetworkDesc')}</p>
          <button className="btn-warning" style={{ width: '100%', padding: '10px 20px', borderRadius: 'var(--radius-md)' }} onClick={switchToSepolia} aria-label="Switch to Sepolia Testnet">
            {t('common.switchToSepolia')}
          </button>
        </div>
      ) : (
        <div className="org-grid">
          {/* Form tao chien dich moi */}
          <div className="form-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}><IconBuilding size={22} /></span>
              {t('organization.createCampaign')}
            </h2>
            {campaignSuccess && (
              <div className="alert-box alert-success" role="alert" aria-live="polite">
                <IconCheckCircle size={18} /> {campaignSuccess}
              </div>
            )}
            {errorMsg && (
              <div className="alert-box alert-danger" role="alert" aria-live="assertive">
                <IconAlertCircle size={18} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCampaign}>
              <div className="form-group">
                <label>{t('organization.campaignTitle')}</label>
                <input
                  type="text"
                  placeholder={t('organization.campaignTitlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('organization.description')}</label>
                <textarea
                  rows="4"
                  placeholder={t('organization.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('organization.goalEth')}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    placeholder={t('organization.goalEthPlaceholder')}
                    value={goalEth}
                    onChange={(e) => setGoalEth(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('organization.durationDays')}</label>
                  <input
                    type="number"
                    min="1"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary full-width" disabled={creatingCampaign}>
                {creatingCampaign ? t('organization.creatingCampaign') : t('organization.createCampaignBtn')}
              </button>
            </form>
          </div>

          {/* Form tao yeu cau phan phoi quy */}
          <div className="form-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}><IconCoins size={22} /></span>
              {t('organization.distributionRequest')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
              {t('organization.distributionDesc')}
            </p>

            {distSuccess && (
              <div className="alert-box alert-success" role="alert" aria-live="polite">
                <IconCheckCircle size={18} /> {distSuccess}
              </div>
            )}
            {distErrorMsg && (
              <div className="alert-box alert-danger" role="alert" aria-live="assertive">
                <IconAlertCircle size={18} /> {distErrorMsg}
              </div>
            )}

            <form onSubmit={handleCreateDistribution}>
              <div className="form-group">
                <label>{t('organization.selectCampaign')}</label>
                {myCampaigns.length === 0 ? (
                  <p className="text-muted">{t('organization.noCampaignsAvailable')}</p>
                ) : (
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    required
                  >
                    {myCampaigns.map((c) => (
                      <option key={c.blockchainCampaignId} value={c.blockchainCampaignId}>
                        #{c.blockchainCampaignId} - {c.title} ({t('organization.availableBalance')}: {(parseFloat(formatEth(c.totalDonated)) - parseFloat(formatEth(c.totalDistributed))).toFixed(4)} ETH)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label>{t('organization.recipientAddress')}</label>
                <input
                  type="text"
                  placeholder={t('organization.recipientPlaceholder')}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('organization.distAmountEth')}</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder={t('organization.distAmountPlaceholder')}
                  value={distAmountEth}
                  onChange={(e) => setDistAmountEth(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('organization.distPurpose')}</label>
                <input
                  type="text"
                  placeholder={t('organization.distPurposePlaceholder')}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary full-width"
                disabled={creatingDist || myCampaigns.length === 0}
                style={{ padding: '12px', background: 'linear-gradient(135deg, var(--secondary) 0%, #047857 100%)' }}
              >
                {creatingDist ? t('organization.submittingDistribution') : t('organization.submitDistribution')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Danh sach cac chien dich cua toi */}
      {account && (
        <div className="section-box" style={{ marginTop: '36px' }}>
          <div className="section-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--primary)' }}><IconClock size={20} /></span>
              {t('organization.myCampaigns')}
              <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)', marginLeft: 4 }}>{myCampaigns.length}</span>
            </h2>
            <button className="btn-refresh" onClick={fetchMyCampaigns} aria-label="Refresh campaigns list">{t('common.refresh')} 🔄</button>
          </div>
          {loadingCampaigns ? (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>{t('organization.loading')}</p>
          ) : myCampaigns.length === 0 ? (
            <p className="text-muted">{t('organization.noCampaigns')}</p>
          ) : (
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>{t('organization.campaignId')}</th>
                    <th>{t('organization.campaignTitle')}</th>
                    <th>{t('organization.goal')}</th>
                    <th>{t('organization.donated')}</th>
                    <th>{t('organization.distributed')}</th>
                    <th>{t('organization.status')}</th>
                    <th>{t('organization.endDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {myCampaigns.map((c) => (
                    <tr key={c._id || c.blockchainCampaignId}>
                      <td>#{c.blockchainCampaignId}</td>
                      <td><strong>{c.title}</strong></td>
                      <td>{formatEth(c.goalAmount)} ETH</td>
                      <td><span className="text-success">{formatEth(c.totalDonated)} ETH</span></td>
                      <td><span className="text-danger">{formatEth(c.totalDistributed)} ETH</span></td>
                      <td><span className="status-pill status-active">{c.status}</span></td>
                      <td>{formatDate(c.endDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;