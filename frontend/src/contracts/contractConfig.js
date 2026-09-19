// Cấu hình địa chỉ Smart Contract và API Backend
// Sau khi bạn deploy contract trên Remix IDE ở mạng Sepolia, hãy dán địa chỉ contract vào .env:
// VITE_CONTRACT_ADDRESS=0x...
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x61528fc1d666AD81F252b67ab047ca12862e3E8b";

// Sepolia Chain ID (Hex: 0xaa36a7, Decimal: 11155111)
export const SEPOLIA_CHAIN_ID = "0xaa36a7";

// URL kết nối tới Backend Node.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
