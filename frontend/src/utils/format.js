import { ethers } from 'ethers';

export const formatEth = (wei) => {
  try {
    return ethers.formatEther(wei || '0');
  } catch (e) {
    return '0';
  }
};

export const formatEthFixed = (wei, decimals = 4) => {
  try {
    return parseFloat(ethers.formatEther(wei || '0')).toFixed(decimals);
  } catch (e) {
    return '0';
  }
};

export const formatAddress = (addr) => {
  if (!addr) return '';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export const calcProgress = (donated, goal) => {
  try {
    const d = parseFloat(ethers.formatEther(donated || '0'));
    const g = parseFloat(ethers.formatEther(goal || '1'));
    if (g <= 0) return 0;
    const p = Math.round((d / g) * 100);
    return p > 100 ? 100 : p;
  } catch (e) {
    return 0;
  }
};

export const getDaysRemaining = (endDate) => {
  return Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));
};

export const formatDate = (date, language = 'vi') => {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  return new Date(date).toLocaleDateString(locale);
};

export const formatDateTime = (date, language = 'vi') => {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  return new Date(date).toLocaleString(locale);
};