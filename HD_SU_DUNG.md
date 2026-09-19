# Hướng Dẫn Cài Đặt và Khởi Chạy Dự Án

## 1. Cấu trúc Dự Án
```text
transparent-charity/
├── PROJECT_OVERVIEW.md         # Tài liệu mô tả dự án
├── blockchain/
│   ├── CharityDonation.sol     # Smart Contract Solidity
│   └── CharityDonation.json    # ABI của Smart Contract
├── backend/                    # Node.js + Express + MongoDB + Ethers.js
└── frontend/                   # React.js (Vite) + MetaMask + Ethers.js
```

---

## 2. Các Bước Triển Khai (Hướng dẫn từng bước)

### Bước 1: Deploy Smart Contract trên Remix IDE
1. Mở trình duyệt và truy cập [Remix IDE](https://remix.ethereum.org).
2. Tạo file mới tên `CharityDonation.sol` trong Remix và dán nội dung từ file `blockchain/CharityDonation.sol`.
3. Vào tab **Solidity Compiler**: Chọn phiên bản compiler `0.8.20` hoặc cao hơn và nhấn **Compile CharityDonation.sol**.
4. Vào tab **Deploy & Run Transactions**:
   - Ở mục **ENVIRONMENT**, chọn `Injected Provider - MetaMask`.
   - Đảm bảo ví MetaMask của bạn đang ở mạng **Sepolia Testnet** và có sẵn một ít Sepolia ETH (để trả phí gas).
   - Nhấn **Deploy** và xác nhận giao dịch trên MetaMask.
5. Sau khi Deploy thành công, sao chép địa chỉ hợp đồng (**Contract Address**, dạng `0x...`).

---

### Bước 2: Cấu hình địa chỉ Contract vào Dự Án
1. **Ở Backend**:
   - Tạo file `backend/.env` từ file `backend/.env.example`:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://127.0.0.1:27017/transparent_charity
     SEPOLIA_RPC_URL=https://rpc.sepolia.org
     CONTRACT_ADDRESS=<DÁN_ĐỊA_CHỈ_CONTRACT_VÀO_ĐÂY>
     ```
2. **Ở Frontend**:
   - Mở file `frontend/src/contracts/contractConfig.js` và thay thế địa chỉ `CONTRACT_ADDRESS`:
     ```javascript
     export const CONTRACT_ADDRESS = "<DÁN_ĐỊA_CHỈ_CONTRACT_VÀO_ĐÂY>";
     ```

---

### Bước 3: Khởi chạy Backend
1. Mở terminal tại thư mục `backend`:
   ```bash
   cd backend
   node server.js
   ```
   *(Server sẽ chạy tại `http://localhost:5000` và tự động kết nối MongoDB cũng như lắng nghe Smart Contract Events)*.

---

### Bước 4: Khởi chạy Frontend
1. Mở terminal tại thư mục `frontend`:
   ```bash
   cd frontend
   npm run dev
   ```
2. Mở trình duyệt theo đường dẫn hiển thị (thường là `http://localhost:5173`).

---

## 3. Kịch Bản Kiểm Thử & Demo Các Chức Năng

### Kịch bản 1: Tổ chức tạo chiến dịch & Người dùng quyên góp
1. Mở trang web `http://localhost:5173`.
2. Chuyển sang trang **Tổ chức** (`/organization`), kết nối ví MetaMask.
3. Điền thông tin tạo chiến dịch (Tên, Mô tả, Mục tiêu ETH, Thời hạn) và nhấn **Tạo Chiến Dịch**. Xác nhận trên MetaMask.
4. Chuyển sang trang chủ **Chiến dịch** (`/`), chọn chiến dịch vừa tạo.
5. Đổi sang ví khác (đóng vai trò **Donor**), nhập số ETH (ví dụ `0.01` ETH) và bấm **Xác nhận Quyên Góp**.
6. Xem kết quả giao dịch và click vào liên kết **Sepolia Etherscan** để kiểm tra giao dịch thật trên Blockchain.

### Kịch bản 2: Yêu cầu phân phối quỹ & Admin phê duyệt
1. Tổ chức vào trang **Tổ chức** (`/organization`), tạo một **Yêu Cầu Phân Phối Quỹ** (nhập ví người nhận, số ETH cần giải ngân, mục đích sử dụng) rồi bấm gửi.
2. Đổi ví MetaMask sang ví **Administrator** (ví đã deploy Smart Contract).
3. Vào trang **Administrator** (`/admin`), nhấn **Phê duyệt** yêu cầu.
4. Sau khi duyệt, nhấn **Giải ngân ETH**. Smart Contract sẽ chuyển ETH trực tiếp từ quỹ chiến dịch sang ví người nhận.
5. Vào **Dashboard Minh Bạch** (`/dashboard`) để xem toàn bộ thống kê tổng quan, các lượt quyên góp và các đợt giải ngân đã được kiểm chứng minh bạch trên Ethereum Sepolia!
