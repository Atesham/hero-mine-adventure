import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // Load .env file at the very beginning

// Initialize Firebase Admin SDK
import { readFileSync } from 'fs';
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors({
  origin: 'http://localhost:8080', // Replace with your frontend URL
  credentials: true,
}));
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
    console.log("Fetching user from Firebase:", email);
    await admin.auth().getUserByEmail(email);
    return true; // Email is already registered
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log("Email is not registered:", email);
      return false; // Email is not registered
    }
    console.error('Error checking email in Firebase:', error);
    throw new Error('Internal Server Error'); // Avoid leaking sensitive errors
  }
};

// Store OTP in Firestore
const storeOTP = async (email, otp) => {
  try {
    console.log("Storing OTP in Firestore:", email, otp);
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
    console.log("Sending OTP via email:", email, otp);
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return false;
  }
};


app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  console.log("Received request body:", req.body); // Log the request body

  if (!email) {
    console.log("Email is missing in the request body.");
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    console.log("Checking if email exists in Firebase:", email);
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      console.log("Email is already registered:", email);
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already registered. Please log in.', 
      });
    }

    console.log("Generating OTP for email:", email);
    const otp = generateOTP();
    console.log("Storing OTP in Firestore:", otp);
    await storeOTP(email, otp);

    console.log("Sending OTP via email:", otp);
    const isSent = await sendOTP(email, otp);

    if (isSent) {
      console.log("OTP sent successfully.");
      res.json({ success: true, message: 'OTP sent successfully.' });
    } else {
      console.log("Failed to send OTP.");
      res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
  } catch (error) {
    console.error('Error in /api/send-otp:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
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
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import admin from 'firebase-admin';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config(); // Load .env file at the very beginning

// // Initialize Firebase Admin SDK
// import { readFileSync } from 'fs';
// import { debug } from 'console';
// import { convertCompilerOptionsFromJson } from 'typescript';
// const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();
// const app = express();

// const allowedOrigins = [
//   'http://localhost:8080',
//   'https://hero-mine-adventure.vercel.app'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// app.options('*', cors()); // Preflight

// // Nodemailer configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'ateshamali0@gmail.com', // Your Gmail address
//     pass: 'lnhj ngik txyb sine', // App-specific password (if 2FA is enabled)
//   },
// });

// // Generate a 6-digit OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// // Check if email is already registered
// const checkIfEmailExists = async (email) => {
//   try {
//     console.log("Fetching user from Firebase:", email);
//     await admin.auth().getUserByEmail(email);
//     return true; // Email is already registered
//   } catch (error) {
//     if (error.code === 'auth/user-not-found') {
//       console.log("Email is not registered:", email);
//       return false; // Email is not registered
//     }
//     console.error('Error checking email in Firebase:', error);
//     throw new Error('Internal Server Error'); // Avoid leaking sensitive errors
//   }
// };

// // Store OTP in Firestore
// const storeOTP = async (email, otp) => {
//   try {
//     console.log("Storing OTP in Firestore:", email, otp);
//     await db.collection('otps').doc(email).set({
//       otp: otp.toString(),
//       timestamp: Date.now(),
//     });
//   } catch (error) {
//     console.error('Error storing OTP in Firestore:', error.message);
//   }
// };
// // Send OTP via email
// const sendOTP = async (email, otp) => {
//   const mailOptions = {
//     from: 'ateshamali0@gmail.com',
//     to: email,
//     subject: 'Your OTP for Signup',
//     text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
//   };

//   try {
//     console.log("Sending OTP via email:", email, otp);
//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Error sending OTP:', error.message);
//     return false;
//   }
// };


// app.post('/api/send-otp', async (req, res) => {
//   const { email } = req.body;

//   console.log("Received request body:", req.body); // Log the request body

//   if (!email) {
//     console.log("Email is missing in the request body.");
//     return res.status(400).json({ success: false, message: 'Email is required.' });
//   }

//   try {
//     console.log("Checking if email exists in Firebase:", email);
//     const emailExists = await checkIfEmailExists(email);
//     if (emailExists) {
//       console.log("Email is already registered:", email);
//       return res.status(400).json({ 
//         success: false, 
//         message: 'This email is already registered. Please log in.', 
//       });
//     }

//     console.log("Generating OTP for email:", email);
//     const otp = generateOTP();
//     console.log("Storing OTP in Firestore:", otp);
//     await storeOTP(email, otp);

//     console.log("Sending OTP via email:", otp);
//     const isSent = await sendOTP(email, otp);

//     if (isSent) {
//       console.log("OTP sent successfully.");
//       res.json({ success: true, message: 'OTP sent successfully.' });
//     } else {
//       console.log("Failed to send OTP.");
//       res.status(500).json({ success: false, message: 'Failed to send OTP.' });
//     }
//   } catch (error) {
//     console.error('Error in /api/send-otp:', error.message);
//     res.status(500).json({ success: false, message: 'Internal server error.' });
//   }
// });


// // Endpoint to verify OTP
// // Update the verify-otp endpoint to delete OTP after successful verification
// app.post('/api/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     console.log(`Verifying OTP for email: ${email}`);
    
//     // Get the OTP document from Firestore
//     const otpDoc = await db.collection('otps').doc(email).get();
    
//     if (!otpDoc.exists) {
//       console.log('OTP not found for email:', email);
//       return res.status(404).json({ success: false, message: 'OTP not found.' });
//     }

//     const { otp: storedOTP, timestamp } = otpDoc.data();
//     const currentTime = Date.now();

//     // Check if OTP is expired (5 minutes)
//     if (currentTime - timestamp > 5 * 60 * 1000) {
//       console.log('OTP expired for email:', email);
//       return res.status(400).json({ success: false, message: 'OTP expired.' });
//     }

//     // Verify the OTP
//     if (storedOTP === otp.toString()) {
//       console.log('OTP verified successfully for email:', email);
      
//       // Delete the OTP from Firestore after successful verification
//       try {
//         await db.collection('otps').doc(email).delete();
//         console.log('OTP deleted successfully for email:', email);
//         return res.json({ success: true, message: 'OTP verified.' });
//       } catch (deleteError) {
//         console.error('Error deleting OTP:', deleteError.message);
//         // Even if deletion fails, still return success since verification passed
//         return res.json({ 
//           success: true, 
//           message: 'OTP verified (but failed to delete OTP record).' 
//         });
//       }
      
//     } else {
//       console.log('Invalid OTP provided for email:', email);
//       return res.status(400).json({ success: false, message: 'Invalid OTP.' });
//     }
//   } catch (error) {
//     console.error('Error verifying OTP:', error.message);
//     res.status(500).json({ success: false, message: 'Internal server error.' });
//   }
// });

// // Add a separate endpoint to delete OTP if needed
// app.post('/api/delete-otp', async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ success: false, message: 'Email is required.' });
//   }

//   try {
//     console.log(`Attempting to delete OTP for email: ${email}`);
//     await db.collection('otps').doc(email).delete();
//     console.log('OTP deleted successfully for email:', email);
//     return res.json({ success: true, message: 'OTP deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting OTP:', error.message);
//     return res.status(500).json({ 
//       success: false, 
//       message: 'Failed to delete OTP.',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

