import express from 'express';
import mongoose from 'mongoose';
import Worker from '../models/Worker.js';

const router = express.Router();

// --- IN-MEMORY FALLBACK STORE ---
let memoryWorkers = [];

/**
 * @route   GET /api/workers
 */
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const workers = await Worker.find().sort({ created_at: -1 });
      return res.json(workers.map(w => ({ ...w.toObject(), id: w.worker_id }))); // Map worker_id to id for frontend
    }
    res.json(memoryWorkers);
  } catch (error) {
    res.json(memoryWorkers);
  }
});

/**
 * @route   POST /api/workers
 */
router.post('/', async (req, res) => {
  const { id, name, field, heartRate, spo2, workingHours } = req.body; // Incoming from frontend
  
  const workerData = {
    worker_id: id,
    name: name,
    field: field,
    age: 25,
    experience_years: 5,
    skill_level: 3,
    attendance_rate: 0.9,
    health_status: 'good',
    assigned_task_id: null,
    heartRate: heartRate || 75,
    spo2: spo2 || 98,
    temp: 36.6,
    workingHours: workingHours || 0,
    fatigue: 'low',
    created_at: new Date()
  };

  if (!id || !name) {
    return res.status(400).json({ error: "ID and Name are required." });
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const existingWorker = await Worker.findOne({ worker_id: id });
      if (existingWorker) {
        return res.status(400).json({ error: `Worker ID '${id}' is already registered.` });
      }

      const newWorker = new Worker(workerData);
      await newWorker.save();
      return res.status(201).json({ ...newWorker.toObject(), id: newWorker.worker_id });
    } catch (error) {
      console.error("❌ MongoDB Save Error:", error.message);
    }
  }

  // Fallback to Memory
  const existsInMemory = memoryWorkers.some(w => w.worker_id === id);
  if (existsInMemory) {
    return res.status(400).json({ error: `Worker ID '${id}' exists in temporary memory.` });
  }

  memoryWorkers.unshift(workerData);
  res.status(201).json({ ...workerData, id: workerData.worker_id });
});

/**
 * @route   PATCH /api/workers/:id
 */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await Worker.findOneAndUpdate({ worker_id: id }, req.body, { new: true });
      if (updated) return res.json({ ...updated.toObject(), id: updated.worker_id });
    } catch (e) {
      console.error("Patch DB error", e.message);
    }
  }
  
  memoryWorkers = memoryWorkers.map(w => w.worker_id === id ? { ...w, ...req.body } : w);
  res.json({ success: true, message: "Updated in memory" });
});

/**
 * @route   DELETE /api/workers/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (mongoose.connection.readyState === 1) {
    try {
      const result = await Worker.findOneAndDelete({ worker_id: id });
      if (result) return res.json({ success: true, message: "Worker deleted" });
    } catch (e) {
      console.error("Delete DB error", e.message);
    }
  }
  
  const initialLength = memoryWorkers.length;
  memoryWorkers = memoryWorkers.filter(w => w.worker_id !== id);
  
  if (memoryWorkers.length < initialLength) {
    res.json({ success: true, message: "Deleted from memory" });
  } else {
    res.status(404).json({ error: "Worker not found" });
  }
});

export default router;

