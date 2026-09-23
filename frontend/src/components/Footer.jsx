import React from 'react';
import { CONTRACT_ADDRESS } from '../contracts/contractConfig';
import { useLanguage } from '../context/LanguageContext';
import { IconShieldCheck, IconExternalLink, IconHeartHandshake } from './Icons';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Transparent Charity Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
            <span>Transparent Charity</span>
          </div>
          <p className="footer-sub" style={{ marginTop: '4px' }}>
            {t('footer.description')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <IconShieldCheck size={16} style={{ color: 'var(--success)' }} />
            {t('footer.contractLabel')}
            {CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" ? (
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="hash-pill"
              >
                {CONTRACT_ADDRESS.substring(0, 8)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 6)}
                <IconExternalLink size={12} />
              </a>
            ) : (
              <span className="font-mono">{t('footer.contractNotConfigured')}</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;