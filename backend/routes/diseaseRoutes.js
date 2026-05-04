import express from "express";
import multer from "multer";
import path from "path";
import { detectDisease, getHistory } from "../controllers/diseaseController.js";

const router = express.Router();

// ✅ FETCH RECENT HISTORY
router.get("/history", getHistory);

router.get("/", (req, res) => {

  res.json({ message: "Disease API working ✅" });
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST route (your main AI)
router.post("/", upload.single("image"), detectDisease);

export default router;