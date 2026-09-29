# Hướng Dẫn Sử Dụng (User Guide)

Chào mừng bạn đến với **Transparent Charity** - Hệ thống quyên góp từ thiện minh bạch. Ứng dụng giúp mọi dòng tiền từ lúc quyên góp đến lúc trao đi được lưu trữ vĩnh viễn trên Blockchain, không ai có thể làm giả.

## Mục lục
1. [Giới thiệu các vai trò](#1-giới-thiệu-các-vai-trò)
2. [Kết nối ví MetaMask (Bắt buộc)](#2-kết-nối-ví-metamask)
3. [Dành cho Nhà Hảo Tâm (Người quyên góp)](#3-dành-cho-nhà-hảo-tâm-người-quyên-góp)
4. [Dành cho Tổ Chức (Người tạo chiến dịch)](#4-dành-cho-tổ-chức-người-tạo-chiến-dịch)
5. [Dành cho Quản Trị Viên (Admin)](#5-dành-cho-quản-trị-viên-admin)
6. [Câu Hỏi Thường Gặp (FAQ)](#6-câu-hỏi-thường-gặp)

---

## 1. Giới thiệu các vai trò
Hệ thống có 3 nhóm người dùng chính:
- **Khách / Nhà Hảo Tâm (Donator):** Những người sử dụng ứng dụng để xem các chiến dịch và ủng hộ tiền (ETH).
- **Tổ Chức Từ Thiện (Organization):** Người chủ trì đứng ra kêu gọi vốn, có quyền tạo chiến dịch mới và làm phiếu xin rút quỹ.
- **Quản Trị Viên (Admin):** Người giám sát nền tảng, chịu trách nhiệm phê duyệt trước khi tiền được xuất khỏi quỹ để tránh lừa đảo.

---

## 2. Kết nối ví MetaMask
Vì đây là ứng dụng Web3 (DApp), bạn không cần đăng ký tài khoản qua Email/Mật khẩu. Mọi thứ được xử lý qua "Ví điện tử Web3".

- **Bước 1:** Tải và cài đặt tiện ích mở rộng **MetaMask** vào trình duyệt Chrome / Cốc Cốc / Edge của bạn.
- **Bước 2:** Tạo một địa chỉ ví mới trên MetaMask (hãy nhớ lưu lại chuỗi 12 từ khôi phục cẩn thận).
- **Bước 3:** Chuyển mạng trong ví MetaMask sang mạng thử nghiệm **Sepolia Testnet**.
- **Bước 4:** Truy cập vào trang chủ của website Transparent Charity. Ở góc trên cùng, nhấn nút **"Kết nối ví" (Connect Wallet)**.
- **Bước 5:** Bảng MetaMask hiện lên, nhấn nút **Chấp nhận / Xác nhận** để website kết nối với ví của bạn.

---

## 3. Dành cho Nhà Hảo Tâm (Người quyên góp)

### Xem và Quyên góp cho chiến dịch
**Mục đích:** Đóng góp số tiền bạn muốn cho hoàn cảnh đang khó khăn.
- **Bước 1:** Trở về Trang chủ (Home), bạn sẽ thấy danh sách các chiến dịch đang kêu gọi.
- **Bước 2:** Bấm vào một chiến dịch bất kỳ để vào trang **Chi tiết chiến dịch (Campaign Detail)**.
- **Bước 3:** Nhập số tiền bạn muốn ủng hộ (đơn vị là ETH) vào ô trống.
- **Bước 4:** Bấm **Quyên góp (Donate)**.
- **Bước 5:** Ví MetaMask sẽ hiện ra để thông báo xác nhận giao dịch. Kiểm tra kĩ số tiền và "Phí Gas" (Phí mạng lưới), sau đó bấm **Xác nhận (Confirm)**.
- **Kết quả mong đợi:** Sau 10-15 giây, khi giao dịch thành công, số tiền hiển thị trên trang của chiến dịch sẽ tăng lên tương ứng và tên ví của bạn sẽ xuất hiện trong bảng Lịch sử phía bên dưới.

---

## 4. Dành cho Tổ Chức (Người tạo chiến dịch)

### 4.1. Tạo chiến dịch mới
**Mục đích:** Mở đợt gọi vốn kêu gọi cộng đồng đóng góp.
- **Bước 1:** Trên thanh Menu, chọn mục **Tổ chức (Organization)**.
- **Bước 2:** Bấm vào nút **Tạo chiến dịch (Create Campaign)**.
- **Bước 3:** Điền các thông tin: Tiêu đề chiến dịch, Mô tả hoàn cảnh, Số tiền mục tiêu (Goal) và Thời hạn diễn ra chiến dịch (số ngày).
- **Bước 4:** Bấm xác nhận tạo và **Ký giao dịch** trên ví MetaMask.
- **Lưu ý:** Bạn cần có một ít ETH (trong mạng lưới) để trả phí khởi tạo hợp đồng. Khi hoàn tất, chiến dịch sẽ công khai ngay trên trang chủ.

### 4.2. Yêu cầu rút tiền (Phân phối quỹ)
**Mục đích:** Sau khi quỹ đã có tiền, bạn cần xin phép lấy tiền ra để trao cho người nghèo hoặc mua vật phẩm.
- **Bước 1:** Vào trang chiến dịch của bạn.
- **Bước 2:** Chọn mục **Yêu cầu phân phối (Distribution Request)**.
- **Bước 3:** Điền **Địa chỉ ví người nhận tiền** (có thể là ví nhà thầu/ví cá nhân), nhập **Số tiền cần rút** và nhập **Mục đích sử dụng** thật chi tiết.
- **Bước 4:** Xác nhận và gửi giao dịch.
- **Kết quả mong đợi:** Yêu cầu này sẽ ở trạng thái chờ duyệt (Requested). Tiền vẫn bị khoá lại cho đến khi Admin phê duyệt.

---

## 5. Dành cho Quản Trị Viên (Admin)

### Phê duyệt và Chuyển tiền (Approve & Execute)
**Mục đích:** Ngăn chặn việc tổ chức từ thiện tự ý lấy tiền bỏ trốn.
- **Bước 1:** Đăng nhập website bằng **Ví của Admin** (Địa chỉ ví đã cấu hình trong mã nguồn).
- **Bước 2:** Vào trang **Quản trị (Admin Page)**.
- **Bước 3:** Tại đây liệt kê tất cả các Phiếu yêu cầu rút tiền từ mọi tổ chức. 
- **Bước 4:** Admin kiểm tra tính hợp lý của Mục đích rút. Nếu đồng ý, bấm nút **Duyệt (Approve)** và xác nhận trên MetaMask.
- **Bước 5:** Sau khi duyệt xong, Admin hoặc Tổ chức có thể bấm **Thực thi (Execute)** để Hợp đồng thông minh tự động bắn tiền thẳng vào ví đích.

---

## 6. Câu Hỏi Thường Gặp (FAQ)

**H: Phí Gas là gì? Tại sao tôi mất phí khi quyên góp?**
Đ: Phí Gas là phí trả cho các "thợ đào" trên blockchain để họ xử lý và ghi nhận giao dịch của bạn. Website không thu khoản phí này.

**H: Tôi lỡ quyên góp nhầm số tiền lớn hơn dự định, có huỷ được không?**
Đ: Không. Tính chất của Blockchain là không thể đảo ngược. Hệ thống hiện cũng chưa hỗ trợ tính năng tự rút lại tiền (Hoàn tiền - Refund) đối với người dùng (theo logic trong contract hiện tại). Bạn nên kiểm tra kỹ popup MetaMask trước khi bấm Confirm.

**H: Tại sao tôi nạp tiền rồi mà thanh tiến độ chưa tăng lên?**
Đ: Mạng lưới Blockchain cần khoảng 10-15 giây để đóng gói giao dịch (Block mining). Bạn vui lòng chờ hoặc kiểm tra lại lịch sử giao dịch trong ví MetaMask để xem giao dịch đã báo "Success" (Thành công) hay chưa. 
