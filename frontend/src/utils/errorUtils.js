/**
 * Chuyển đổi lỗi thô từ Ethers.js / MetaMask thành thông báo tiếng Việt thân thiện với người dùng
 */
export const parseBlockchainError = (err) => {
  if (!err) return 'Lỗi không xác định';

  const errString = (err.message || err.reason || JSON.stringify(err)).toLowerCase();
  const code = err.code || '';

  // 1. Không đủ số dư
  if (code === 'INSUFFICIENT_FUNDS' || errString.includes('insufficient funds')) {
    return 'Ví của bạn không đủ số dư ETH (bao gồm phí Gas) để thực hiện giao dịch này. Vui lòng thử số tiền nhỏ hơn hoặc nạp thêm Sepolia ETH vào ví.';
  }

  // 2. Người dùng hủy giao dịch trên MetaMask
  if (
    code === 'ACTION_REJECTED' ||
    code === 4001 ||
    errString.includes('user rejected') ||
    errString.includes('user denied')
  ) {
    return 'Bạn đã hủy/từ chối xác nhận giao dịch trên MetaMask.';
  }

  // 3. Sai mạng
  if (errString.includes('wrong network') || errString.includes('chain')) {
    return 'Ví đang không thuộc mạng Sepolia Testnet. Vui lòng đổi mạng trên MetaMask.';
  }

  // 4. Contract Revert (Điều kiện hợp đồng từ chối)
  if (errString.includes('execution reverted') || code === 'CALL_EXCEPTION') {
    if (err.reason) {
      return `Hợp đồng thông minh từ chối: ${err.reason}`;
    }
    return 'Giao dịch bị Smart Contract từ chối. Vui lòng kiểm tra trạng thái chiến dịch hoặc số dư.';
  }

  // Fallback ngắn gọn nếu có reason
  if (err.reason) {
    return `Lỗi giao dịch: ${err.reason}`;
  }

  return 'Giao dịch không thành công. Vui lòng kiểm tra lại ví MetaMask và thử lại.';
};
