try {
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Campaign = require('./models/Campaign');

const sampleCampaigns = [
  {
    blockchainCampaignId: 1,
    title: 'Cứu Trợ Đồng Bào Lũ Lụt Miền Trung',
    description: 'Chương trình quyên góp hỗ trợ khẩn cấp lương thực, áo phao và vật tư y tế cho các gia đình bị ảnh hưởng nghiêm trọng bởi đợt lũ lụt vừa qua.',
    organizationWallet: '0x61528fc1d666ad81f252b67ab047ca12862e3e8b',
    goalAmount: '1000000000000000000', // 1 ETH in Wei
    totalDonated: '250000000000000000', // 0.25 ETH
    totalDistributed: '100000000000000000', // 0.1 ETH
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-10-30'),
    status: 'active',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  {
    blockchainCampaignId: 2,
    title: 'Xây Trường Cho Em Tại Vùng Cao Hà Giang',
    description: 'Dự án quyên góp xây dựng 3 phòng học khang trang, kiên cố kèm nhà vệ sinh đạt chuẩn cho trẻ em điểm trường vùng sâu vùng xa.',
    organizationWallet: '0x61528fc1d666ad81f252b67ab047ca12862e3e8b',
    goalAmount: '2000000000000000000', // 2 ETH in Wei
    totalDonated: '500000000000000000', // 0.5 ETH
    totalDistributed: '0',
    startDate: new Date('2026-09-05'),
    endDate: new Date('2026-11-15'),
    status: 'active',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  {
    blockchainCampaignId: 3,
    title: 'Mổ Tim Miễn Phí Cho Trẻ Em Bẩm Sinh',
    description: 'Quỹ phẫu thuật tim nhân đạo hỗ trợ toàn bộ chi phí khám và mổ tim cho các bệnh nhi nghèo trên toàn quốc.',
    organizationWallet: '0x61528fc1d666ad81f252b67ab047ca12862e3e8b',
    goalAmount: '500000000000000000', // 0.5 ETH
    totalDonated: '500000000000000000', // 0.5 ETH
    totalDistributed: '500000000000000000', // 0.5 ETH
    startDate: new Date('2026-08-15'),
    endDate: new Date('2026-09-20'),
    status: 'completed',
    transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
  }
];

const seed = async () => {
  await connectDB();
  
  const count = await Campaign.countDocuments();
  if (count === 0) {
    console.log('[Seed] Khởi tạo dữ liệu mẫu cho Database...');
    await Campaign.insertMany(sampleCampaigns);
    console.log('[Seed] Đã tạo thành công 3 chiến dịch mẫu vào DB!');
  } else {
    console.log(`[Seed] Database đã có ${count} chiến dịch, không cần seed.`);
  }

  process.exit(0);
};

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
