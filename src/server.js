import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

// Initialize Firebase Admin SDK
import { readFileSync } from 'fs';
const serviceAccount = JSON.parse(readFileSync('./firebase-service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ateshamali0@gmail.com', // Your Gmail address
    pass: 'lnhj ngik txyb sine', // App-specific password (if 2FA is enabled)
  },
});

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Check if email is already registered
const checkIfEmailExists = async (email) => {
  try {
    await admin.auth().getUserByEmail(email);
    return true; // Email is already registered
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return false; // Email is not registered
    }
    console.error('Error checking email in Firebase:', error);
    throw new Error('Internal Server Error'); // Avoid leaking sensitive errors
  }
};

// Store OTP in Firestore
const storeOTP = async (email, otp) => {
  try {
    await db.collection('otps').doc(email).set({
      otp: otp.toString(),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error storing OTP in Firestore:', error.message);
  }
};

// Send OTP via email
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: 'ateshamali0@gmail.com',
    to: email,
    subject: 'Your OTP for Signup',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return false;
  }
};

// Endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already registered
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered. Please log in.' });
    }

    // Generate and send OTP only if email is NOT registered
    const otp = generateOTP();
    await storeOTP(email, otp);
    const isSent = await sendOTP(email, otp);

    if (isSent) {
      return res.json({ success: true, message: 'OTP sent successfully.' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
  } catch (error) {
    console.error('Error in /api/send-otp:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Endpoint to verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpDoc = await db.collection('otps').doc(email).get();
    if (!otpDoc.exists) {
      return res.json({ success: false, message: 'OTP not found.' });
    }

    const { otp: storedOTP, timestamp } = otpDoc.data();
    const currentTime = Date.now();

    if (currentTime - timestamp > 5 * 60 * 1000) {
      return res.json({ success: false, message: 'OTP expired.' });
    }

    if (storedOTP === otp.toString()) {
      return res.json({ success: true, message: 'OTP verified.' });
    } else {
      return res.json({ success: false, message: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
