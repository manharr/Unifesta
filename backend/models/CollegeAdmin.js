import mongoose from "mongoose";

const collegeAdminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    college: {
        type: mongoose.Types.ObjectId,
        ref: "College", 
        required: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin", 
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("CollegeAdmin", collegeAdminSchema);
