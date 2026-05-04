import express from 'express';
import { predictFatigue, autoGrievance, allocateTask, nextDayPlan } from '../controllers/fatigueController.js';

const router = express.Router();

// Predict Fatigue Level
router.post('/predict-fatigue', predictFatigue);

// AI Task Allocation Engine
router.post('/allocate-task', allocateTask);

// Trigger Auto-Grievance based on workload/fatigue
router.post('/auto-grievance', autoGrievance);

// Next Day Work Recommendation
router.post('/next-day-plan', nextDayPlan);

export default router;
