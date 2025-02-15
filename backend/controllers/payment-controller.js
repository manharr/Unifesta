import Payment from "../models/Payment.js"; 
import Razorpay from 'razorpay';
import crypto from 'crypto';
const createOrder = async (req, res) => {
    const { amount, currency } = req.body;

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100,  // Razorpay expects the amount in paise
        currency: currency,
        receipt: crypto.randomBytes(10).toString('hex'),
    };

    try {
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: 'Error creating Razorpay order' });
    }
};

export { createOrder };
const verifyPayment = (req, res) => {
    const { paymentId, orderId, signature } = req.body;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === signature) {
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
};

export { verifyPayment };

