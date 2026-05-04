import { runAIModels } from "../services/aiService.js";
import DiseaseRecord from "../models/DiseaseRecord.js";
import mongoose from "mongoose";
import { getTreatmentPlan } from "../services/treatmentEngine.js";


/**
 * Controller to handle leaf disease detection logic.
 */
export const detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;

    // Call the Python AI Pipeline
    const aiResult = await runAIModels(imagePath);

    // Generate Treatment Plan
    const treatment = getTreatmentPlan(aiResult.disease, aiResult.severity);

    // Save result to MongoDB for Pattern Analysis (with fallback)
    let record;
    try {
      record = await DiseaseRecord.create({
        image: imagePath,
        isLeaf: aiResult.is_tea_leaf,
        isHealthy: aiResult.is_healthy,
        status: aiResult.status,
        disease: aiResult.disease || "None",
        severity: aiResult.severity || "None",
        recommendation: aiResult.recommendation || "None",
        treatmentChemical: treatment.chemical,
        treatmentOrganic: treatment.organic,
        treatmentPrevention: treatment.prevention,
        confidence: aiResult.confidence || 0,
        date: new Date()
      });
    } catch (dbError) {
      console.error("Database save failed, using fallback:", dbError.message);
      // Fallback object for UI if DB is down
      record = {
        image: imagePath,
        isLeaf: aiResult.is_tea_leaf,
        isHealthy: aiResult.is_healthy,
        status: aiResult.status,
        disease: aiResult.disease || "None",
        severity: aiResult.severity || "None",
        recommendation: aiResult.recommendation || "None",
        treatmentChemical: treatment.chemical,
        treatmentOrganic: treatment.organic,
        treatmentPrevention: treatment.prevention,
        confidence: aiResult.confidence || 0,
        date: new Date(),
        _id: `temp_${Date.now()}`
      };

    }

    res.json({
      success: true,
      data: record
    });


  } catch (error) {
    console.error("Detect Disease Controller Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Controller to fetch recent history from MongoDB.
 */
export const getHistory = async (req, res) => {
  try {
    // If MongoDB is not connected, return empty history instead of hanging
    if (mongoose.connection.readyState !== 1) {
       return res.json({ success: true, data: [], message: "Database offline" });
    }

    const history = await DiseaseRecord.find().sort({ date: -1 }).limit(10);
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Fetch History Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

