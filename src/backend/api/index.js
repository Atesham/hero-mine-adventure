import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  )
});

// CORS Configuration
app.use(cors({
  origin: [
    'https://hero-mine-adventure.vercel.app',
    'http://localhost:3000' // For local testing
  ],
  credentials: true
}));

// Your API Endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    // Your OTP sending logic here
    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export for Vercel
export default app;