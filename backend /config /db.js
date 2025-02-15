import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.db.databaseName}`);

    } catch(error){
        console.error(`ERROR: ${error.message}`);
        process.exit(1); // 1 means exit 0 means success

    }
};
