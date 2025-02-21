import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date, 
        required: true,
    },
    endDate: {
        type: Date, 
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    college: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "College", 
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
        required: true,
    },
    images: [
        {
            type: String, 
        },
    ],
    maxParticipants: {
        type: Number, 
        default: 0,
    },
    eventStatus: {
        type: String, 
        default: "Upcoming",
    },
    isFeatured: {
        type: Boolean, 
        default: false,
    },
    bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],

    subEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubEvent" }],

    sponsors: [{ type: String }],

    coordinatorsContact: [
        {
            name: { type: String, required: true },
            phone: { type: String, required: true }
        }
    ],
    rules: [
        {
            type: String,
            required: true
        }
    ]
});

export default mongoose.model("Event", eventSchema);
