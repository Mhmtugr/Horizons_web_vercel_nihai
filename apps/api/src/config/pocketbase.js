import 'dotenv/config';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

// Authenticate as admin
(async () => {
  try {
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );
    console.log('✅ PocketBase admin authenticated successfully');
  } catch (error) {
    console.error('❌ PocketBase admin authentication failed:', error.message);
  }
})();

// Configure CORS whitelist
const corsWhitelist = [
  'https://novaiteknoloji.com',
  'https://www.novaiteknoloji.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

// Set rate limiting (100 requests per minute)
const rateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
};

console.log('✅ PocketBase client initialized');
console.log('✅ CORS whitelist configured:', corsWhitelist);
console.log('✅ Rate limiting configured:', rateLimitConfig);

export { pb, corsWhitelist, rateLimitConfig };