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
import sponsorRouter from './routes/sponsor-routes.js';

dotenv.config();

const app = express();


app.use((req, res, next) => {
    if (process.env.MAINTENANCE_MODE === 'true') {
      return res.status(503).send('The site is under maintenance. Please try again later.');
    }
  //   console.log('Maintenance mode is OFF'); // Debugging log
    next();
  });



app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/event", eventRouter);
app.use("/booking", bookingsRouter);
app.use("/college", collegeRouter);
app.use("/subevent", subEventRouter);
app.use("/api/payments", PaymentRouter);
app.use("/upload", uploadRouter); 
app.use("/sponsor",sponsorRouter);


// Root endpoint
app.get("/", (req, res) => {
    // res.send("Server is running!");
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
