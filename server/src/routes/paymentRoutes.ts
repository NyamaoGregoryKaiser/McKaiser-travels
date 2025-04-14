import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { initiateSTKPush, mpesaCallback, checkTransactionStatus } from '../controllers/paymentController';

const router = express.Router();

// Initiate STK push payment - Protected route
router.post('/mpesa/stkpush', protect, initiateSTKPush);

// M-Pesa callback URL - This needs to be publicly accessible
router.post('/mpesa/callback', mpesaCallback);

// Check transaction status - Protected route
router.get('/mpesa/status/:checkoutRequestID', protect, checkTransactionStatus);

export default router; 