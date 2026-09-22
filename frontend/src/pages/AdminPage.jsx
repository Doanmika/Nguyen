import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { API_BASE_URL } from '../contracts/contractConfig';
import { useLanguage } from '../context/LanguageContext';
import { parseBlockchainError } from '../utils/errorUtils';

const AdminPage = () => {
  const { account, contract, isAdmin, isSepolia, connectWallet, switchToSepolia } = useWallet();
  const { t } = useLanguage();

  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDistributions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/distributions`);
      const data = await res.json();
      if (data.success) {
        setDistributions(data.data);
      }
    } catch (err) {
      console.error('Error fetching distributions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistributions();
  }, [fetchDistributions]);

  // Admin phe duyet yeu cau
  const handleApprove = async (requestId) => {
    setMsg('');
    setErrorMsg('');
    if (!contract) return;

    try {
      setActionLoading((prev) => ({ ...prev, [requestId]: 'approving' }));
      console.log(`Approving request #${requestId}...`);
      const tx = await contract.approveDistribution(requestId);
      const _receipt = await tx.wait();

      // Cap nhat DB
      await fetch(`${API_BASE_URL}/distributions/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          transactionHash: tx.hash,
        }),
      });

      setMsg(t('admin.approvedSuccess', { id: requestId, hash: tx.hash }));
      fetchDistributions();
    } catch (err) {
      console.error('Error approving:', err);
      setErrorMsg(parseBlockchainError(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  // Thuc thi chuyen tien giai ngan
  const handleExecute = async (requestId) => {
    setMsg('');
    setErrorMsg('');
    if (!contract) return;

    try {
      setActionLoading((prev) => ({ ...prev, [requestId]: 'executing' }));
      console.log(`Executing disbursement for request #${requestId}...`);
      const tx = await contract.executeDistribution(requestId);
      const _receipt = await tx.wait();

      // Cap nhat DB
      await fetch(`${API_BASE_URL}/distributions/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'executed',
          transactionHash: tx.hash,
        }),
      });

      setMsg(t('admin.executedSuccess', { id: requestId, hash: tx.hash }));
      fetchDistributions();
    } catch (err) {
      console.error('Error executing:', err);
      setErrorMsg(parseBlockchainError(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const formatEth = (wei) => {
    try {
      return ethers.formatEther(wei || '0');
    } catch (e) {
      return '0';
    }
  };

  return (
    <div className="page-container">
      <div className="page-title-box">
        <h1>{t('admin.title')}</h1>
        <p>{t('admin.subtitle')}</p>
      </div>

      {!account ? (
        <div className="wallet-prompt center-box">
          <h3>{t('admin.connectWalletTitle')}</h3>
          <button className="btn-primary" onClick={connectWallet}>
            🦊 {t('common.connectWallet')}
          </button>
        </div>
      ) : !isSepolia ? (
        <div className="wallet-prompt center-box">
          <h3>{t('admin.wrongNetworkTitle')}</h3>
          <button className="btn-warning" onClick={switchToSepolia}>
            {t('common.switchToSepolia')}
          </button>
        </div>
      ) : !isAdmin ? (
        <div className="center-box" style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛔</div>
          <h2>{t('admin.accessDenied')}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '500px', margin: '8px auto' }}>
            {t('admin.accessDeniedDesc', { address: account })}
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '12px' }}>
            {t('admin.onlyOwner')}
          </p>
        </div>
      ) : (
        <div>
          <div className="admin-status-bar">
            <div>
              <strong>{t('admin.adminAddress')}:</strong> <code>{account}</code>
            </div>
            <div>
              <span className="status-pill status-approved">
                ✓ {t('admin.adminVerified')}
              </span>
            </div>
          </div>

          {msg && <div className="alert-success" style={{ marginTop: '16px' }}>{msg}</div>}
          {errorMsg && <div className="alert-error" style={{ marginTop: '16px' }}>{errorMsg}</div>}

          <div className="section-box" style={{ marginTop: '24px' }}>
            <div className="section-header">
              <h2>{t('admin.distributionList', { count: distributions.length })}</h2>
              <button className="btn-refresh" onClick={fetchDistributions}>{t('admin.refresh')}</button>
            </div>

            {loading ? (
              <p>{t('admin.loading')}</p>
            ) : distributions.length === 0 ? (
              <p className="text-muted">{t('admin.noDistributions')}</p>
            ) : (
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>{t('admin.reqId')}</th>
                      <th>{t('admin.campaign')}</th>
                      <th>{t('admin.requestingOrg')}</th>
                      <th>{t('admin.recipient')}</th>
                      <th>{t('admin.purpose')}</th>
                      <th>{t('admin.amount')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('admin.actions')}</th>
                      <th>{t('admin.txHash')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions.map((d) => (
                      <tr key={d._id || d.blockchainRequestId}>
                        <td><strong>#{d.blockchainRequestId}</strong></td>
                        <td>{t('admin.campaign')} #{d.blockchainCampaignId}</td>
                        <td><code>{d.organizationWallet ? `${d.organizationWallet.substring(0, 6)}...` : '—'}</code></td>
                        <td><code>{d.recipient.substring(0, 6)}...{d.recipient.substring(d.recipient.length - 4)}</code></td>
                        <td>{d.purpose}</td>
                        <td><strong>{formatEth(d.amount)} ETH</strong></td>
                        <td>
                          <span className={`status-badge status-${d.status}`}>
                            {d.status === 'requested' && t('admin.statusRequested')}
                            {d.status === 'approved' && t('admin.statusApproved')}
                            {d.status === 'executed' && t('admin.statusExecuted')}
                            {d.status === 'rejected' && t('admin.statusRejected')}
                          </span>
                        </td>
                        <td>
                          {d.status === 'requested' && (
                            <button
                              className="btn-secondary"
                              style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success-border)" }}
                              onClick={() => handleApprove(d.blockchainRequestId)}
                              disabled={!isAdmin || actionLoading[d.blockchainRequestId] === 'approving'}
                              title={!isAdmin ? t('admin.onlyAdminCanApprove') : ''}
                            >
                              {actionLoading[d.blockchainRequestId] === 'approving' ? t('admin.approving') : t('admin.approve')}
                            </button>
                          )}
                          {d.status === 'approved' && (
                            <button
                              className="btn-secondary"
                              style={{ background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--primary)" }}
                              onClick={() => handleExecute(d.blockchainRequestId)}
                              disabled={actionLoading[d.blockchainRequestId] === 'executing'}
                            >
                              {actionLoading[d.blockchainRequestId] === 'executing' ? t('admin.executing') : t('admin.execute')}
                            </button>
                          )}
                          {d.status === 'executed' && (
                            <span className="text-success">{t('admin.completed')}</span>
                          )}
                        </td>
                        <td>
                          {d.transactionHash ? (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${d.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="link-etherscan"
                            >
                              {t('admin.viewTx')}
                            </a>
                          ) : (
                            '—'
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

export default AdminPage;