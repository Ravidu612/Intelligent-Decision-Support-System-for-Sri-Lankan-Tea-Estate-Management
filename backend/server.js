import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import cors from 'cors';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Routes
import diseaseRoutes from './routes/diseaseRoutes.js';
import fatigueRoutes from './routes/fatigueRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// 🔹 MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// =======================
// 🔹 ROUTES
// =======================

// Worker Management
app.use("/api/workers", workerRoutes);

// Leaf Disease Detection
app.use("/api/disease", diseaseRoutes);

// Fatigue Prediction
app.use("/api", fatigueRoutes);

// =======================
// 🔹 TEA GRADING API
// =======================
const upload = multer({ dest: 'uploads/' });

app.post('/api/tea/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const response = await axios.post(
      'http://127.0.0.1:8001/predict',
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(req.file.path); // cleanup

    res.json(response.data);

  } catch (error) {
    console.error("❌ Tea grading error:", error.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: 'Tea grading AI service unavailable' });
  }
});

import http from 'http';

// =======================
// 🔹 STABLE STARTUP ENGINE
// =======================

const MONGO_URI = process.env.MONGO_URI;
const LOCAL_URI = "mongodb://127.0.0.1:27017/tea_estate";

const startServer = async () => {
  // 1. Create and start HTTP server handle
  const server = http.createServer(app);
  
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.error("--------------------------------------------------");
      console.error(`❌ PORT ${PORT} IS ALREADY IN USE.`);
      console.error(`👉 Solution: Kill the process on port ${PORT} or change PORT in .env`);
      console.error("--------------------------------------------------");
      process.exit(1);
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log("--------------------------------------------------");
    console.log(`🚀 SERVER ACTIVE: http://127.0.0.1:${PORT}`);
    console.log("--------------------------------------------------");
  });

  // Keep process alive explicitly
  setInterval(() => {}, 1000000);

  // 2. Background DB Connection
  try {
    console.log("📡 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    console.log("✅ MongoDB Atlas Connected");
  } catch (err) {
    console.error("❌ Atlas Connection Failed:", err.message);
    try {
      console.log("🔄 Attempting Local MongoDB Fallback...");
      await mongoose.connect(LOCAL_URI, {
        serverSelectionTimeoutMS: 3000,
        bufferCommands: false
      });
      console.log("✅ Local MongoDB Connected");
    } catch (localErr) {
      console.warn("⚠️ ALL DB CONNECTIONS FAILED - System running in DEMO MODE (Memory)");
    }
  }

  console.log(`🛠️ Mode: ${mongoose.connection.readyState === 1 ? 'Database Sync' : 'In-Memory Only'}`);
};

startServer();