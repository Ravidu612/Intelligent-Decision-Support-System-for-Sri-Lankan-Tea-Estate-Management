import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

/**
 * Connects to the Python AI service for leaf diagnosis.
 * @param {string} imagePath - Path to the uploaded image.
 * @returns {Promise<object>} - AI analysis result.
 */
export const runAIModels = async (imagePath) => {
  try {
    const formData = new FormData();
    // Path might be relative, ensure it works
    const absolutePath = path.resolve(imagePath);
    formData.append("image", fs.createReadStream(absolutePath));

    const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return res.data;
  } catch (error) {
    console.error("AI Service Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to connect to AI Service. Ensure the Flask API is running on port 8000.");
  }
};
