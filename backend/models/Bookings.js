import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    registeredOn: {
        type: Date,
        default: Date.now, 
    },
    subEvent: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "SubEvent",
        required: true,
    },
    additionalInfo: {
        type: String, 
    },
    paymentStatus: {
        type: String, 
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
    ticketNumber: {
        type: String, 
        unique: true,
    },

    college: {
        type: String,  
        required: true,
    },
    contact: {
        type: String,  
        required: true,
    },
});

bookingSchema.pre("save", function (next) {
    if (!this.ticketNumber) {
        this.ticketNumber = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    next();
});

export default mongoose.model("Booking", bookingSchema);
