import cloudinary from "../config/cloudinary.js";
import fs from "fs"; // To delete temp files

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "uploads",
        });

        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: "Image uploaded successfully!",
            imageUrl: result.secure_url, 
        });

    } catch (err) {
        res.status(500).json({ message: "Error uploading image", error: err.message });
    }
};
