import express from 'express';
import { addCollege, getColleges, getCollegeById, updateCollege, deleteCollege } from '../controllers/college-controller.js';

const collegeRouter = express.Router();

collegeRouter.get("/", getColleges);

collegeRouter.get("/:id", getCollegeById);

collegeRouter.post("/", addCollege);

collegeRouter.put("/:id", updateCollege);

collegeRouter.delete("/:id", deleteCollege);

export default collegeRouter;
