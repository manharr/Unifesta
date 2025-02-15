import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    events: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event" 
    }], 
});

export default mongoose.model("College", collegeSchema);
