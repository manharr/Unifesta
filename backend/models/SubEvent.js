import mongoose from "mongoose";

const subEventSchema = new mongoose.Schema({
    event: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    type: { 
        type: String,
        required: true,
    },
    description: { 
        type: String,
        required: true,
    },
    registrationStatus: {
        type: String,
        enum: ["ON", "OFF"],
        default: "OFF",
    },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    details: [
        {
         
            gameTitle: {
                type: String,
                required: function() { return this.type === 'Gaming'; }, 
            },
            date: {
                type: Date,
                required: true,
            },
            time:{
              type: String,
              required: true,  
            },
            entryFee: {
                type: Number,
                default: 0, 
            },
            maxParticipants: {
                type: Number,
                default: 0, 
            },
            registeredParticipants: {
                type: Number,
                default: 0, 
            },
        },
    ],
});


export default mongoose.model("SubEvent", subEventSchema);
