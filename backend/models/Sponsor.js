import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        // required: false,
    },
    image: {
        type: String, 
        required: true,
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event",
        required: true, 
    },
});

export default mongoose.model("Sponsor", sponsorSchema);
