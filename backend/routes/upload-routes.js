import express from "express";
import multer from "multer";
import fs from "fs"; // For temporary file deletion
import { uploadImage } from "../controllers/upload-controller.js";
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();

// Configure Multer (Store temporarily)
const upload = multer({ dest: "uploads/" });

uploadRouter.post("/", upload.single("image"), uploadImage);

export default uploadRouter;
