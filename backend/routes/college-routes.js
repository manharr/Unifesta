import express from 'express';
import { addCollege, getColleges, getCollegeById, updateCollege, deleteCollege } from '../controllers/college-controller.js';

const collegeRouter = express.Router();

// Route to get all colleges
collegeRouter.get("/", getColleges);

// Route to get a specific college by ID
collegeRouter.get("/:id", getCollegeById);

// Route to add a new college (only accessible by admin)
collegeRouter.post("/", addCollege);

// Route to update a college (only accessible by admin)
collegeRouter.put("/:id", updateCollege);

// Route to delete a college (only accessible by admin)
collegeRouter.delete("/:id", deleteCollege);

export default collegeRouter;
