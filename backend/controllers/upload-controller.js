export const uploadImage = async (req, res) => {
    try {
        res.status(201).json({ message: "Image uploaded successfully!", imageUrl: `/uploads/${req.file.filename}` });
    } catch (err) {
        res.status(500).json({ message: "Error uploading image", error: err.message });
    }
};
