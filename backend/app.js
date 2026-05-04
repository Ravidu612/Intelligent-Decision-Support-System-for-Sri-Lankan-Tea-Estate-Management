import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ✅ ROOT ROUTE (IMPORTANT FIX)
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Routes
app.use("/api/disease", diseaseRoutes);

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/tea_estate";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB established.");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    console.warn("Continuing without MongoDB. Some features may be limited.");
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Main Backend running on port ${PORT}`);
});