import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Mock Schema (matching models/DiseaseRecord.js)
const diseaseRecordSchema = new mongoose.Schema({
  image: String,
  isLeaf: Boolean,
  isHealthy: Boolean,
  status: String,
  disease: String,
  severity: String,
  recommendation: String,
  confidence: Number,
  date: { type: Date, default: Date.now }
});

const DiseaseRecord = mongoose.model("DiseaseRecord", diseaseRecordSchema);

async function initDB() {
  try {
    console.log("Connecting to Cluster...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected Successfully!");

    // Clear existing data (optional, but makes it "clear")
    console.log("Cleaning existing records...");
    await DiseaseRecord.deleteMany({});

    // Seed Sample Data
    const samples = [
      {
        image: "leaf_blaster_1.jpg",
        isLeaf: true,
        isHealthy: false,
        status: "Diseased",
        disease: "Bird's Eye Spot",
        severity: "Medium",
        recommendation: "Apply Carbendazim 50% WP fungicide.",
        confidence: 0.89
      },
      {
        image: "healthy_tea_1.jpg",
        isLeaf: true,
        isHealthy: true,
        status: "Healthy",
        disease: "None",
        severity: "N/A",
        recommendation: "Continue regular maintenance.",
        confidence: 0.98
      },
      {
        image: "leaf_rust_1.jpg",
        isLeaf: true,
        isHealthy: false,
        status: "Diseased",
        disease: "Grey Blight",
        severity: "High",
        recommendation: "Remove infected leaves and apply copper-based spray.",
        confidence: 0.92
      }
    ];

    console.log("Inserting sample records...");
    await DiseaseRecord.insertMany(samples);
    console.log("Database initialized with 3 sample records.");

    process.exit(0);
  } catch (err) {
    console.error("Initialization Error:", err.message);
    process.exit(1);
  }
}

initDB();
