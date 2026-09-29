# Hướng Dẫn Cài Đặt (Setup Guide)

Tài liệu này hướng dẫn cách cấu hình và khởi chạy ứng dụng Transparent Charity trên môi trường máy tính cá nhân (Development).

---

## 1. Yêu cầu hệ thống
Hãy đảm bảo máy tính của bạn đã được cài đặt các phần mềm sau:
- **Node.js**: Phiên bản 18.x trở lên (Kiểm tra bằng lệnh `node -v`).
- **MongoDB**: Hệ quản trị cơ sở dữ liệu (Cài đặt cục bộ bản MongoDB Community hoặc dùng MongoDB Atlas). Phiên bản 6.x trở lên.
- **Git**: (Kiểm tra bằng lệnh `git --version`).
- Trình duyệt cài sẵn tiện ích ví **MetaMask**.

---

## 2. Clone repo và cài đặt Dependencies
Tải mã nguồn dự án về máy:
```bash
git clone <đường-dẫn-repo>
cd transparent-charity/blockchain_project_documentation
```

Cài đặt các gói thư viện cho Backend:
```bash
cd backend
npm install
```

Cài đặt các gói thư viện cho Frontend:
```bash
cd ../frontend
npm install
```

---

## 3. Cấu hình biến môi trường
Dự án yêu cầu các biến cấu hình thông qua file `.env`. Bạn cần tạo mới 2 file từ file `.env.example`.

### Tại thư mục `backend/`
Tạo file `backend/.env` và copy cấu trúc từ `backend/.env.example`. Dưới đây là ý nghĩa các biến:

| Tên biến | Ý nghĩa | Ví dụ giá trị | Bắt buộc |
| :--- | :--- | :--- | :--- |
| `PORT` | Cổng chạy API Backend | `5000` | Không (Mặc định 5000) |
| `MONGODB_URI` | Chuỗi kết nối đến MongoDB | `mongodb://127.0.0.1:27017/transparent_charity` | Có |
| `SEPOLIA_RPC_URL` | URL RPC kết nối với mạng Sepolia (lấy từ Alchemy/Infura) | `https://rpc.sepolia.org` hoặc `https://eth-sepolia.g.alchemy.com/v2/...` | Có |
| `CONTRACT_ADDRESS`| Địa chỉ Smart Contract sau khi bạn deploy | `0x123abc...` | Có |
| `ADMIN_WALLET_ADDRESS`| Địa chỉ ví của bạn (Ví sẽ có quyền Admin) | `0xabc123...` | Có |

### Tại thư mục `frontend/`
Tạo file `frontend/.env.local` theo mẫu từ `frontend/.env.example`:

| Tên biến | Ý nghĩa | Ví dụ giá trị | Bắt buộc |
| :--- | :--- | :--- | :--- |
| `VITE_CONTRACT_ADDRESS`| Trùng với địa chỉ ở mục Backend | `0x123abc...` | Có |
| `VITE_API_BASE_URL` | Endpoint của Backend | `http://localhost:5000/api` | Có |

---

## 4. Deploy Smart Contract và Lấy Địa Chỉ 
*Lưu ý: Mã nguồn không tích hợp Hardhat/Truffle nên bước này cần làm thủ công qua trình duyệt.*
1. Mở trang web [Remix IDE](https://remix.ethereum.org/).
2. Tạo file mới tên `CharityDonation.sol` và dán toàn bộ mã nguồn từ file `blockchain/CharityDonation.sol` trong dự án vào.
3. Ở cột bên trái, vào tab "Solidity Compiler", chọn phiên bản Complier phù hợp (ví dụ 0.8.x) và bấm **Compile**.
4. Chuyển sang tab "Deploy & Run Transactions":
   - Mục Environment: Chọn **Injected Provider - MetaMask** (Hãy chắc chắn MetaMask đang ở mạng Sepolia và có ít Sepolia ETH để trả phí Gas).
   - Mục Account: Ví đang kết nối sẽ trở thành `admin` mặc định.
   - Bấm nút **Deploy**.
5. Đợi giao dịch xác nhận, bạn sẽ thấy địa chỉ contract mới bên dưới. Copy địa chỉ đó và dán vào 2 biến `CONTRACT_ADDRESS` và `VITE_CONTRACT_ADDRESS` ở bước 3.

---

## 5. Thiết lập Database & Chạy Backend
Mở Terminal, trỏ vào thư mục `backend/`:

1. Đảm bảo dịch vụ MongoDB (như MongoDB Compass / local daemon) đang chạy mở ở cổng `27017`.
2. *(Tùy chọn)* Nạp dữ liệu mẫu để test giao diện:
   ```bash
   node seedData.js
   ```
3. Khởi chạy máy chủ Backend (chạy môi trường dev có tự động watch):
   ```bash
   npm run dev
   ```
   *=> Output thành công sẽ báo server đang chạy port 5000 và đã kết nối DB, kèm log "[Blockchain Listener] Dang lang nghe Smart Contract..."*

---

## 6. Chạy Frontend
Mở một Terminal mới, trỏ vào thư mục `frontend/`:

Khởi chạy web DApp:
```bash
npm run dev
```
*=> Ứng dụng sẽ chạy tại địa chỉ `http://localhost:5173` (hoặc cổng bất kì mà Vite báo).* 
Mở trình duyệt, truy cập địa chỉ trên để bắt đầu trải nghiệm dự án.

---

## 7. Chạy Lệnh Hỗ Trợ Khác
Dự án có cung cấp một số tập lệnh (scripts) theo file cấu hình:
- **Build Production Frontend:** Gói giao diện thành file tĩnh để đưa lên host (Vercel/Netlify).
  ```bash
  cd frontend
  npm run build
  ```
- **Preview Frontend Build:** Xem trước bản build.
  ```bash
  npm run preview
  ```
- **Chạy Linter:** Kiểm tra lỗi code ở React.
  ```bash
  npm run lint
  ```

---

## 8. Xử lý sự cố thường gặp
- **Lỗi `MongoServerError: Authentication failed` hoặc timeout:** 
  Kiểm tra lại service MongoDB local đã khởi động chưa. Nếu bạn dùng MongoDB Atlas (Cloud), đảm bảo chuỗi `MONGODB_URI` đã điền đúng tài khoản/mật khẩu và Allow IP Address truy cập.
- **Lỗi `filter not found` trên Terminal Backend:**
  Đây là lỗi cảnh báo bình thường (đã được bọc try-catch trong mã nguồn) khi public RPC node bị reset kết nối. Ethers.js sẽ tự động tái kết nối, bạn không cần quan tâm.
- **Cổng 5000 bị chiếm (Port in use):**
  Lỗi do có app khác đang chạy. Mở `backend/.env` và đổi `PORT=5001`. Đồng thời sửa lại `VITE_API_BASE_URL=http://localhost:5001/api` bên Frontend.
- **Lỗi `[Blockchain Listener] Khoi tao that bai` hoặc Backend sập ngay khi chạy:**
  Do biến `SEPOLIA_RPC_URL` chưa được điền đúng chuẩn, hoặc biến `CONTRACT_ADDRESS` trống. Hãy chắc chắn đã deploy contract ở mục 4 và cập nhật `.env`.
