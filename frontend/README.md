# Frontend - Transparent Charity DApp Client

Ứng dụng Single Page Application (SPA) phát triển trên nền tảng **React 19** và công cụ đóng gói thế hệ mới **Vite 8**, kết nối trực tiếp với mạng **Ethereum Sepolia Testnet** qua ví **MetaMask**.

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng

* **React 19:** Kiến trúc Component phân tách, tối ưu hóa quá trình re-rendering.
* **Vite 8:** Môi trường đóng gói siêu tốc, hỗ trợ Hot Module Replacement (HMR).
* **React Router DOM 7:** Điều hướng trang Client-side (SPA).
* **Ethers.js v6:** Giao tiếp với Smart Contract qua Web3 Provider (EIP-1193).
* **CSS Custom Design System:** Toàn bộ kiểu dáng, biến màu, responsive và theme tối/sáng được định nghĩa thống nhất tại `src/index.css`.

---

## 📂 Cấu Trúc Thư Mục Frontend

```text
frontend/
├── public/
│   ├── logo.png             # Logo thương hiệu tách nền trong suốt
│   └── _redirects           # Cấu hình tự động SPA routing cho Render / Netlify
├── src/
│   ├── assets/              # Logo và hình ảnh tĩnh
│   ├── components/
│   │   ├── Navbar.jsx       # Thanh điều hướng (Logo, ví, đổi mạng, Dark/Light, đa ngôn ngữ)
│   │   ├── Footer.jsx       # Chân trang (Logo, link Smart Contract Sepolia)
│   │   └── Icons.jsx        # Bộ sưu tập 15 icon SVG vector độc lập
│   ├── context/
│   │   ├── WalletContext.jsx    # Quản lý kết nối MetaMask, sự kiện đổi ví, đổi mạng
│   │   ├── LanguageContext.jsx  # Quản lý đa ngôn ngữ (Tiếng Việt & English)
│   │   └── ToastContext.jsx     # Hệ thống thông báo toast nổi
│   ├── contracts/
│   │   ├── CharityDonation.json # ABI của Smart Contract
│   │   └── contractConfig.js    # Cấu hình địa chỉ Contract và API Backend
│   ├── locales/
│   │   ├── vi.json          # File từ điển Tiếng Việt
│   │   └── en.json          # File từ điển English
│   ├── pages/
│   │   ├── HomePage.jsx         # Trang chủ hiển thị danh sách các chiến dịch
│   │   ├── CampaignDetail.jsx   # Chi tiết chiến dịch & Cổng quyên góp ETH trực tiếp
│   │   ├── OrganizationPage.jsx # Khu vực tổ chức: Tạo chiến dịch & Đề xuất rút quỹ
│   │   ├── AdminPage.jsx        # Khu vực Administrator: Phê duyệt & Giải ngân ETH
│   │   └── DashboardPage.jsx    # Dashboard minh bạch số liệu toàn hệ thống
│   ├── utils/
│   │   ├── errorUtils.js    # Bộ phân giải lỗi kỹ thuật Web3 sang thông báo tiếng Việt
│   │   └── format.js        # Định dạng ETH, địa chỉ ví rút gọn, ngày tháng
│   ├── App.jsx              # Định tuyến Router chính
│   ├── main.jsx             # Entry point của React
│   └── index.css            # Toàn bộ CSS Design System
├── index.html               # HTML template & Favicon
├── vite.config.js           # Cấu hình Vite
└── package.json
```

---

## ⚡ Các Tính Năng Frontend Độc Đáo

1. **Smart Error Parser (`errorUtils.js`):** Bắt và dịch các mã lỗi từ MetaMask / RPC (`INSUFFICIENT_FUNDS`, `ACTION_REJECTED`, `CALL_EXCEPTION`) thành các thông báo tiếng Việt thân thiện, rõ ràng.
2. **Network Guard:** Tự động phát hiện ví đang ở sai mạng và cung cấp nút bấm 1 chạm chuyển về mạng Sepolia Testnet (`0xaa36a7`).
3. **Admin Guard:** Tự động kiểm tra quyền sở hữu hợp đồng on-chain, chỉ hiển thị quyền truy cập cho địa chỉ ví Administrator.
4. **Theme Switcher:** Hỗ trợ chế độ Sáng (Light Mode) và Tối (Dark Mode).
5. **Đa Ngôn Ngữ (i18n):** Hỗ trợ chuyển đổi song ngữ Tiếng Việt và Tiếng Anh tức thì.

---

## 🚀 Lệnh Khởi Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy server phát triển cục bộ (Local Development)
npm run dev

# Đóng gói sản phẩm (Production Build)
npm run build

# Xem trước bản đóng gói
npm run preview
```
