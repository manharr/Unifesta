import express from 'express';
import { deleteBooking, getAllBookings, getBookingById, getBookingsByUser, newBooking } from '../controllers/booking-controller.js';

const bookingsRouter = express.Router();


bookingsRouter.post('/',newBooking);
bookingsRouter.get('/:id',getBookingById);
bookingsRouter.get('/',getAllBookings);
bookingsRouter.delete("/:id",deleteBooking);
bookingsRouter.get('/user/:userId', getBookingsByUser); 
export default bookingsRouter;