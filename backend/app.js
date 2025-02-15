import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/user-routes.js';
import adminRouter from './routes/admin-routes.js';
import eventRouter from './routes/event-routes.js';
import bookingsRouter from './routes/booking-routes.js';
import collegeRouter from './routes/college-routes.js';
import subEventRouter from './routes/subevent-routes.js';
import uploadRouter from './routes/upload-routes.js';
import PaymentRouter from './routes/payment-routes.js';
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
      origin: 'http://localhost:3000', // Replace with your frontend URL

}));

//middlewares
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/event",eventRouter);
app.use("/booking",bookingsRouter);
app.use("/college",collegeRouter);
app.use("/subevent",subEventRouter);
app.use("/api/payments", PaymentRouter); 
app.get("/", (req, res)=>{
    // res.send("server is ready!") 
});

app.use("/upload", uploadRouter);
app.use("/uploads", express.static("uploads")); 
app.listen(5000, () =>{
    connectDB();
    console.log('Server started at http://localhost:5000 hello')
})

// 