import jwt from 'jsonwebtoken';
import College from "../models/College.js"; 
import mongoose from 'mongoose';
import Admin from "../models/Admin.js"; 

export const addCollege = async (req, res, next) => {
    const extractedToken = req.headers.authorization.split(" ")[1];
    if (!extractedToken || extractedToken.trim() === "") {
        return res.status(404).json({ message: "Token not found" });
    }

    let adminId;
    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({ message: `${err.message}` });
        } else {
            adminId = decrypted.id;
        }
    });

    const { name, location, description } = req.body;

    if (!name || !location) {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    let newCollege;
    try {
        newCollege = new College({
            name,
            location,
            description: description || "", 
        });
        const session = await mongoose.startSession();
        session.startTransaction();
        await newCollege.save({ session });

        const adminUser = await Admin.findById(adminId);

        if (!adminUser.addedColleges) {
            adminUser.addedColleges = [];
        }

        adminUser.addedColleges.push(newCollege._id);

        await adminUser.save({ session });

        await session.commitTransaction();
        session.endSession();

    } catch (err) {
        return res.status(500).json({ message: "College creation failed", error: err.message });
    }

    if (!newCollege) {
        return res.status(500).json({ message: "College creation failed" });
    }

    return res.status(201).json({ message: "College created successfully", college: newCollege });
};


export const getColleges = async (req, res, next) => {
    let colleges;

    try {
        colleges = await College.find().populate('events'); 
    } catch (err) {
        return console.log(err);
    }

    if (!colleges || colleges.length === 0) {
        return res.status(404).json({ message: "No colleges found" });
    }

    return res.status(200).json({ colleges });
};

export const getCollegeById = async (req, res, next) => {
    const id = req.params.id;
    let college;

    try {
        college = await College.findById(id).populate('events');
    } catch (err) {
        return console.log(err);
    }

    if (!college) {
        return res.status(404).json({ message: "College not found" });
    }

    return res.status(200).json({ college });
};

export const updateCollege = async (req, res, next) => {
    try {
        // Extract token
        const extractedToken = req.headers.authorization?.split(" ")[1];

        if (!extractedToken) {
            return res.status(404).json({ message: "Token not found" });
        }

        // Verify token and get admin ID
        let adminId;
        try {
            const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
            adminId = decrypted.id;
        } catch (err) {
            return res.status(400).json({ message: `${err.message}` });
        }

        // Get college ID and update data
        const collegeId = req.params.id;
        const { name, location, description } = req.body;

        const updatedCollege = await College.findByIdAndUpdate(
            collegeId,
            { name, location, description },
            { new: true } 
        );

        if (!updatedCollege) {
            return res.status(404).json({ message: "College not found" });
        }

        return res.status(200).json({ message: "College updated successfully", college: updatedCollege });

    } catch (err) {
        console.error("Error updating college:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const deleteCollege = async (req, res, next) => {
    const extractedToken = req.headers.authorization?.split(" ")[1];  
    
    if (!extractedToken || extractedToken.trim() === "") {
        console.log("Token not found");
        return res.status(404).json({ message: "Token not found" });
    }
  
    let adminId;
    // Verify token asynchronously
    try {
        const decoded = await jwt.verify(extractedToken, process.env.SECRET_KEY);  
        adminId = decoded.id;
    } catch (err) {
        console.log("Token verification failed:", err.message);
        return res.status(400).json({ message: `Token verification failed: ${err.message}` });
    }
  
    const collegeId = req.params.id;
    console.log("Trying to delete college with ID:", collegeId);  
  
    try {
        const college = await College.findByIdAndDelete(collegeId);  
        if (!college) {
            console.log("College not found for deletion");
            return res.status(404).json({ message: "College not found" });
        }
        console.log("College deleted successfully");

        // Return success message
        return res.status(200).json({ message: "College deleted successfully" });
    } catch (err) {
        console.log("Error deleting college:", err.message);
        return res.status(500).json({ message: "Deleting college failed", error: err.message });
    }
};
