import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate("bookings"); // Ensure bookings are included
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

        const hashedPassword = bcrypt.hashSync(password);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        return res.status(201).json({ id: user._id, message: "User created successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
};



export const updateUser = async(req, res, next) =>{
    const id=req.params.id;

    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ message: "Invalid inputs" });
    }
    

    const hashedPassword=bcrypt.hashSync(password);
    let user;
    try {
        user = await User.findByIdAndUpdate(id, {name, email, password: hashedPassword});
    } catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({message: "Something went wrong"});
    }
    res.status(200).json({message:"Updated successfully"});
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

export const login = async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email && email.trim()==="" && !password && password.trim()===""){
        return res.status(422).json({message: "Invalid inputs"});
    } 

    let existingUser;
    try{
        existingUser = await User.findOne({email});
    } catch(err){
        return console.log(err);
    }

    if(!existingUser) {
        return res.status(404).json({message:"Unable to find user"})
    }



    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect Password"});
    }

    return res.status(200).json({
        message: "Login Successful",
        id: existingUser._id,  
    });


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