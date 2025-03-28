import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
    },
    contactNumber: {
        type: String, 
        default: null,
    },
    bookings:[{type: mongoose.Types.ObjectId, ref:"Booking"}],
});

export default mongoose.model("User",userSchema);

