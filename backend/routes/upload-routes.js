import express from "express";
import multer from "multer";
import path from "path";

const uploadRouter = express.Router();

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

// Upload route
uploadRouter.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

export default uploadRouter;
