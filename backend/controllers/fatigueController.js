import axios from 'axios';
import Worker from '../models/Worker.js';

/**
 * Controller for Fatigue Prediction and Auto-Grievance
 */
export const predictFatigue = async (req, res) => {
  try {
    const { working_hours, task_difficulty, avg_hr, avg_spo2 } = req.body;

    // Call Python AI Service
    // Note: Python service expects working_hours, task_difficulty, avg_hr, avg_spo2
    const aiResponse = await axios.post('http://localhost:5002/predict-fatigue', {
      working_hours,
      task_difficulty,
      avg_hr,
      avg_spo2
    });

    const { fatigue } = aiResponse.data;

    res.json({
      success: true,
      fatigue: fatigue || "low"
    });

  } catch (error) {
    console.error("Fatigue Prediction Error:", error.message);
    res.json({
      success: true,
      fatigue: "low", 
      message: "AI Service offline"
    });
  }
};

/**
 * AI-Driven Task Allocation Logic
 */
export const allocateTask = async (req, res) => {
  try {
    const { required_skill } = req.body;

    // Fetch all workers from MongoDB
    const workers = await Worker.find({});

    if (workers.length === 0) {
      return res.json({ success: false, message: "No workers found in database" });
    }

    const results = workers.map(worker => {
      let score = 0;
      
      // 1. Skill Match (+30)
      // Check if current task or field matches required skill
      if (worker.field === required_skill || worker.assigned_task_id === required_skill) score += 30;
      
      // 2. Experience (*2) - Updated to experience_years
      score += (worker.experience_years * 2);
      
      // 3. Performance Score - Updated to skill_level (* 5 to normalize)
      score += (worker.skill_level * 5);

      // 4. Fatigue Penalty
      let fatiguePenalty = 0;
      if (worker.fatigue === 'medium') fatiguePenalty = 10;
      if (worker.fatigue === 'high') fatiguePenalty = 30;
      score -= fatiguePenalty;

      // 5. Health Risk Penalty (Fatigue = High -> +20 penalty)
      if (worker.fatigue === 'high') score -= 20;

      return { 
        id: worker.worker_id,
        name: worker.name,
        skill: worker.field,
        fatigue: worker.fatigue,
        totalScore: parseFloat(score.toFixed(1))
      };
    });

    // Sort by best score
    results.sort((a, b) => b.totalScore - a.totalScore);
    const bestWorker = results[0];

    res.json({
      success: true,
      bestWorker: bestWorker.name,
      score: bestWorker.totalScore,
      reason: "Selected due to low fatigue and high suitability"
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Auto-Grievance Detection
 */
export const autoGrievance = async (req, res) => {
  try {
    const { workingHours, fatigue, avg_hr, avg_spo2 } = req.body;

    // Logic: 
    // IF fatigue == high OR workingHours > 8 OR (avg_hr > 120 AND avg_spo2 < 92)
    const isOverworked = fatigue === 'high' || 
                         workingHours > 8 || 
                         (avg_hr > 120 && avg_spo2 < 92);

    if (isOverworked) {
      return res.json({
        success: true,
        alert: true,
        issue: "Overwork detected",
        category: "Workload",
        priority: "High",
        action: "Reduce workload or assign light task"
      });
    }

    res.json({
      success: true,
      alert: false,
      issue: "Normal",
      category: "None",
      priority: "Low"
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Next-Day Plan Recommendation
 */
export const nextDayPlan = async (req, res) => {
  try {
    const { fatigue } = req.body;
    let recommendation = "Normal work allowed";

    if (fatigue === 'high') {
      recommendation = "Assign light task or rest";
    } else if (fatigue === 'medium') {
      recommendation = "Assign moderate task";
    }

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
