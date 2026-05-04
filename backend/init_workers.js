import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from './models/Worker.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tea_estate";

const initDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB for initialization.");

    // Create a dummy worker to initialize the collection
    const dummy = {
      id: 'INIT_001',
      name: 'System Initializer',
      field: 'Management',
      status: 'Healthy',
      workingHours: 0
    };

    await Worker.findOneAndUpdate({ id: dummy.id }, dummy, { upsert: true, new: true });
    console.log("✅ Worker collection initialized successfully.");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Initialization Failed:", err.message);
    process.exit(1);
  }
};

initDB();
