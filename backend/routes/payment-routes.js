import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment-controller.js';

const PaymentRouter = express.Router();

// Route to create an order with Razorpay
PaymentRouter.post('/create-order', createOrder);

// Route to verify the payment after it's made on Razorpay
PaymentRouter.post('/verify-payment', verifyPayment);

export default PaymentRouter;
