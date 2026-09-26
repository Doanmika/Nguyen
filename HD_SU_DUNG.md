# HƯỚNG DẪN SỬ DỤNG VÀ KIỂM THỬ HỆ THỐNG
## DỰ ÁN: HỆ THỐNG QUYÊN GÓP TỪ THIỆN MINH BẠCH BẰNG BLOCKCHAIN (TRANSPARENT CHARITY)

* **Tác giả:** **Nguyễn Quang Đoàn**
* **Mạng thử nghiệm:** Ethereum Sepolia Testnet
* **Smart Contract Address:** `0x61528fc1d666AD81F252b67ab047ca12862e3E8b`
* **Website Trực Tuyến:** [https://nguyen-2cb8.onrender.com](https://nguyen-2cb8.onrender.com)

---

## 1. Chuẩn Bị Môi Trường

### 1.1. Cài Đặt Ví MetaMask
1. Cài đặt tiện ích mở rộng **MetaMask** trên trình duyệt (Chrome, Brave, Edge, Firefox).
2. Tạo ví mới hoặc khôi phục ví có sẵn bằng Cụm từ khôi phục bí mật (Secret Recovery Phrase).
3. Đảm bảo ví đang chọn mạng **Sepolia Testnet**:
   * Vào Cài đặt MetaMask ➔ Mạng (Networks) ➔ Bật "Hiển thị mạng thử nghiệm" (Show test networks).
   * Chọn mạng **Sepolia**.

### 1.2. Nhận ETH Sepolia Miễn Phí (Faucet)
Để thực hiện giao dịch quyên góp hoặc tạo chiến dịch trên Blockchain, bạn cần có một lượng nhỏ phí Gas Sepolia ETH:
* [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application-development/docs/building-apps-with-gemini)
* [Sepolia PoW Faucet (pk910)](https://sepolia-faucet.pk910.de/)
* [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

---

## 2. Hướng Dẫn Khởi Chạy Hệ Thống Cục Bộ (Localhost)

### 2.1. Khởi Chạy Backend Server
1. Mở cửa sổ Terminal tại thư mục `backend`:
   ```bash
   cd backend
   node server.js
   ```
2. Máy chủ Backend sẽ khởi động tại địa chỉ: `http://localhost:5000`.
3. Màn hình console sẽ xuất hiện thông báo:
   ```text
   [Server] Dang chay tren cong http://localhost:5000 (development)
   [Blockchain Listener] Dang lang nghe Smart Contract tai dia chi: 0x61528fc1d666AD81F252b67ab047ca12862e3E8b
   [MongoDB] Ket noi thanh cong: ...
   ```

### 2.2. Khởi Chạy Frontend Web
1. Mở một cửa sổ Terminal thứ hai tại thư mục `frontend`:
   ```bash
   cd frontend
   npm run dev
   ```
2. Trình duyệt sẽ mở giao diện tại: `http://localhost:5173` (hoặc `http://localhost:5174`).

---

## 3. Quy Trình Kiểm Thử Chi Tiết 3 Vai Trò (Testing Guide)

### 🟢 Vai Trò 1: Nhà Hảo Tâm (Donor)

#### Kịch bản 1.1: Xem danh sách và chi tiết chiến dịch
1. Truy cập vào trang chủ **Chiến dịch** (`/`).
2. Xem danh sách các chiến dịch thiện nguyện đang tiếp nhận quyên góp.
3. Bấm vào nút **Quyên Góp & Chi Tiết** của một chiến dịch bất kỳ (ví dụ: Chiến dịch #4).
4. Quan sát các thông số:
   - Mục tiêu quyên góp (Goal).
   - Tổng tiền đã quyên góp được (Donated).
   - Tổng tiền đã giải ngân (Distributed).
   - Số tiền quỹ khả dụng còn lại trong két hợp đồng (Available Funds).
   - Thanh tiến trình % hoàn thành và hạn kết thúc.

#### Kịch bản 1.2: Quyên góp ETH trực tiếp vào Smart Contract
1. Tại khung **Cổng Quyên Góp Trực Tiếp** ở cột bên phải:
   - Bấm nút **Kết nối MetaMask**.
   - Nếu ví đang ở sai mạng (ví dụ Ethereum Mainnet), hệ thống sẽ cảnh báo màu vàng và cung cấp nút **Chuyển sang Sepolia Testnet** để tự động đổi mạng.
2. Nhập số tiền ETH muốn ủng hộ (ví dụ: `0.005` ETH hoặc bấm chọn nút nhanh `+0.005 ETH`).
3. Bấm **Xác Nhận Quyên Góp ETH**.
4. Cửa sổ MetaMask sẽ bật lên hiển thị chi tiết số ETH gửi kèm phí Gas. Bấm **Xác nhận (Confirm)**.
5. Chờ khoảng 10-15 giây để khối được đào. Hệ thống sẽ:
   - Hiển thị thông báo màu xanh: **Quyên góp thành công!**
   - Cung cấp liên kết trực tiếp để tra cứu trên **Sepolia Etherscan**.
   - Bảng **Sổ Cái Quyên Góp (Donor Ledger)** tự động cập nhật thêm địa chỉ ví của bạn và số ETH vừa đóng góp.

#### Kịch bản 1.3: Kiểm tra xử lý lỗi thông minh
- **Nhập số tiền bằng 0:** Bấm gửi ➔ Giao diện lập tức cảnh báo: *"Vui lòng nhập số ETH quyên góp lớn hơn 0"*.
- **Quyên góp vượt quá số dư trong ví:** (Ví dụ ví có 0.01 ETH nhưng nhập 0.05 ETH) ➔ Hệ thống tự động phân giải lỗi và thông báo: *"Ví của bạn không đủ số dư ETH (bao gồm phí Gas) để thực hiện giao dịch này. Vui lòng thử số tiền nhỏ hơn hoặc nạp thêm Sepolia ETH vào ví."*
- **Bấm Hủy trên MetaMask:** Khi popup MetaMask hiện lên, bấm nút **Reject (Hủy)** ➔ Hệ thống thông báo thân thiện: *"Bạn đã hủy/từ chối xác nhận giao dịch trên MetaMask."*

---

### 🔵 Vai Trò 2: Tổ Chức Từ Thiện (Organization)

#### Kịch bản 2.1: Khởi tạo chiến dịch thiện nguyện mới
1. Chuyển sang trang **Tổ Chức** (`/organization`) trên thanh menu.
2. Kết nối ví MetaMask của tổ chức.
3. Tại khung **Tạo Chiến Dịch Mới**:
   - Nhập **Tên chiến dịch** (ví dụ: *Hỗ trợ mổ tim cho trẻ em nghèo*).
   - Nhập **Mô tả chi tiết** mục đích kêu gọi.
   - Nhập **Mục tiêu quyên góp (ETH)** (ví dụ: `1.5` ETH).
   - Nhập **Thời hạn hoạt động (ngày)** (ví dụ: `30` ngày).
4. Bấm nút **Tạo Chiến Dịch** và xác nhận giao dịch trên MetaMask.
5. Sau khi giao dịch được xác nhận, Smart Contract sẽ cấp ID mới. Chiến dịch sẽ lập tức xuất hiện trong bảng **Danh Sách Chiến Dịch Của Tôi** ở phía dưới và hiển thị công khai trên Trang Chủ.

#### Kịch bản 2.2: Gửi yêu cầu phân phối quỹ (Rút tiền cứu trợ)
1. Tại khung **Yêu Cầu Phân Phối Quỹ** (bên phải):
   - Chọn chiến dịch cần rút tiền trong ô danh sách (hệ thống sẽ tự động hiển thị số dư khả dụng còn lại của từng chiến dịch).
   - Nhập **Địa chỉ ví người nhận** (địa chỉ ví của người thụ hưởng hoặc nhà thuốc/bệnh viện).
   - Nhập **Số tiền phân phối (ETH)** (ví dụ: `0.002` ETH).
   - Nhập **Mục đích sử dụng quỹ** (ví dụ: *Chi trả viện phí đợt 1*).
2. Bấm nút **Gửi Yêu Cầu Phân Phối**.
3. Xác nhận giao dịch `createDistributionRequest` trên MetaMask.
4. Sau khi hoàn tất, yêu cầu sẽ được ghi nhận vào sổ cái với trạng thái ban đầu là `requested` (Chờ duyệt).

---

### 🔴 Vai Trò 3: Quản Trị Viên Hệ Thống (Administrator)

#### Kịch bản 3.1: Kiểm tra tính bảo mật phân quyền (Admin Guard)
1. Sử dụng một ví người dùng bình thường truy cập vào menu **Administrator** (`/admin`).
2. Hệ thống sẽ hiển thị màn hình từ chối: **Truy Cập Bị Từ Chối (Access Denied)** và thông báo rõ ví của bạn không phải là ví Admin của Smart Contract. Toàn bộ các nút chức năng duyệt chi đều bị ẩn hoàn toàn.

#### Kịch bản 3.2: Phê duyệt và giải ngân chuyển tiền
1. Chuyển ví MetaMask sang ví **Administrator** (`0x61528fc1d666AD81F252b67ab047ca12862e3E8b`).
2. Truy cập vào trang `/admin`, hệ thống sẽ hiển thị huy hiệu xanh: **✓ Đã xác thực quyền Administrator**.
3. Trong bảng **Danh Sách Yêu Cầu Phân Phối Quỹ**:
   - Bước 1: Tìm yêu cầu có trạng thái `Chờ duyệt` (Requested) ➔ Bấm nút **✓ Phê duyệt** ➔ Xác nhận trên MetaMask. Trạng thái yêu cầu sẽ chuyển sang `approved` (Đã duyệt).
   - Bước 2: Bấm nút **⚡ Giải ngân ETH** ➔ Xác nhận trên MetaMask.
4. Smart Contract sẽ tự động chuyển đúng số lượng ETH từ quỹ hợp đồng sang địa chỉ ví người thụ hưởng. Trạng thái yêu cầu chuyển thành `executed` (Đã giải ngân).

---

### 📊 Vai Trò 4: Giám Sát Minh Bạch (Dashboard)
1. Bấm vào mục **Minh bạch quỹ** (`/dashboard`) trên thanh điều hướng.
2. Quan sát toàn bộ số liệu tổng hợp của hệ thống:
   - Tổng số chiến dịch đã được khởi tạo.
   - Tổng lượt quyên góp của cộng đồng.
   - Tổng số ETH đã quyên góp vào quỹ.
   - Tổng số ETH đã giải ngân ra xã hội.
3. Bảng **Lịch Sử Quyên Góp Gần Nhất** và **Lịch Sử Phân Phối & Giải Ngân** hiển thị đầy đủ địa chỉ ví rút gọn, số tiền và đường dẫn trực tiếp tới mã giao dịch trên **Sepolia Etherscan** để bất kỳ ai cũng có thể đối soát.
