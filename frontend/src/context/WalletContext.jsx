import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CharityDonationABI from '../contracts/CharityDonation.json';
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from '../contracts/contractConfig';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [adminAddress, setAdminAddress] = useState(null);
  const [isSepolia, setIsSepolia] = useState(false);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastFn, setToastFn] = useState(null);

  const toast = (message, type = 'error') => {
    if (toastFn) {
      toastFn[type](message);
    } else {
      console.warn('Toast not available:', message);
    }
  };

  // Kiem tra mang Sepolia
  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsSepolia(chainId.toLowerCase() === SEPOLIA_CHAIN_ID.toLowerCase());
    }
  };

  // Khoi tao Contract instance
  const initContract = async (signerOrProvider) => {
    if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
      try {
        const c = new ethers.Contract(CONTRACT_ADDRESS, CharityDonationABI, signerOrProvider);
        setContract(c);
        const adm = await c.admin();
        setAdminAddress(adm.toLowerCase());
      } catch (err) {
        console.error("Loi khoi tao contract:", err);
      }
    }
  };

// Ket noi MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Vui long cai dat MetaMask de su dung chuc nang nay!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0].toLowerCase());
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await initContract(signer);
        await checkNetwork();
      }
    } catch (err) {
      console.error("Loi ket noi MetaMask:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Chuyen sang mang Sepolia
  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setIsSepolia(true);
    } catch (err) {
      // Neu chua co mang Sepolia trong MetaMask thi yeu cau them
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          setIsSepolia(true);
        } catch (addError) {
          console.error("Loi them mang Sepolia:", addError);
        }
      }
    }
  };

  // Ngat ket noi
  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
  };

  // Lang nghe su thay doi vi va mang tren MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(async (accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0].toLowerCase());
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          await initContract(signer);
          await checkNetwork();
        }
      });

      const handleAccountsChanged = async (accounts) => {
        if (accounts && accounts.length > 0) {
          const newAcc = accounts[0].toLowerCase();
          setAccount(newAcc);
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            await initContract(signer);
            await checkNetwork();
          } catch (err) {
            console.error('Loi dong bo signer khi doi tai khoan:', err);
          }
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = async () => {
        // Khong reload trang, chi cap nhat state
        setIsSepolia(false);
        setContract(null);
        setAdminAddress(null);
        try {
          await checkNetwork();
          if (account) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            await initContract(signer);
          }
        } catch (err) {
          console.error('Loi khi doi mang:', err);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const isAdmin = Boolean(account && adminAddress && account.toLowerCase() === adminAddress.toLowerCase());

return (
    <WalletContext.Provider
      value={{
        account,
        adminAddress,
        isAdmin,
        isSepolia,
        contract,
        loading,
        error,
        connectWallet,
        disconnectWallet,
        switchToSepolia,
        setToastFn,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
