const mongoose = require('mongoose');

const connectDB = async (retries = 2, delay = 2000) => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/transparent_charity';
  const localUri = 'mongodb://127.0.0.1:27017/transparent_charity';

  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 4000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });
      console.log(`[MongoDB] Ket noi thanh cong: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`[MongoDB] Loi ket noi (lan ${i + 1}/${retries}): ${error.message}`);
      if (i < retries - 1) {
        console.log(`[MongoDB] Thu lai sau ${delay / 1000} giay...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Fallback sang Local MongoDB neu Atlas bị loi IP Whitelist/SSL
  if (primaryUri !== localUri) {
    console.warn('[MongoDB] MongoDB Atlas khong ket noi duoc. Dang tu dong chuyen sang Local MongoDB...');
    try {
      const conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[MongoDB] Ket noi Local MongoDB thanh cong: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.error('[MongoDB] Ket noi Local MongoDB cung that bai:', localErr.message);
    }
  }

  console.error('[MongoDB] Ket noi that bai. Server van chay nhung DB khong kha dung.');
};

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Loi ket noi:', err.message);
});

module.exports = connectDB;
