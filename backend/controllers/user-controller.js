import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate("bookings");
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
};


export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10); 

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        return res.status(201).json({ id: user._id, message: "User created successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    // console.log(`Fetching user with ID: ${id}`);

    try {
        const user = await User.findById(id).select("-password"); 
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        // console.log("User found:", user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, contactNumber } = req.body;

    if (!name || !email) {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        user.email = email;
        if (contactNumber) user.contactNumber = contactNumber;

        await user.save();

        res.status(200).json({ message: "Updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};




export const deleteUser = async(req,res,next)=>{
    const id = req.params.id;
    let user;
    try{
        user = await User.findByIdAndDelete(id);
    } catch(err){
        return console.log(err);
    }

    if(!user){
        return res.status(500).json({message:"Something went wrong"});
    }
    return res.status(200).json({message:"Deleted successfully"});
    
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "Unable to find user" });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        return res.status(200).json({
            message: "Login Successful",
            id: existingUser._id,
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
};



export const getBookingsOfUser = async(req,res,next)=>{
    const id = req.params.id;
    let bookings;
    try{
        bookings=await Bookings.find({user: id});

    } catch(err){
        return console.log(err);
    }
    if(!bookings){
        return res.status(500).json({message:"Unable to get bookings"});
    }
    return res.status(200).json({bookings}); 

};