import { Request, Response } from 'express';
import axios from 'axios';
import { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// Constants for M-Pesa Daraja API
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || '';
const MPESA_SHORT_CODE = process.env.MPESA_SHORT_CODE || '';
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://example.com/api/payments/callback';

// Base URLs for different environments
const MPESA_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

interface AuthRequest extends Request {
  user?: IUser;
}

// Generate M-Pesa OAuth token
const generateAccessToken = async (): Promise<string> => {
  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating M-Pesa access token:', error);
    throw new Error('Failed to generate M-Pesa access token');
  }
};

// Initiate STK Push for M-Pesa payment
export const initiateSTKPush = async (req: AuthRequest, res: Response) => {
  try {
    const { phoneNumber, amount, bookingRef } = req.body;
    
    // Validate required fields
    if (!phoneNumber || !amount || !bookingRef) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, amount, and booking reference are required',
      });
    }
    
    // Format phone number (remove leading zero if present and ensure it starts with 254)
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = `254${formattedPhone.slice(1)}`;
    }
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = `254${formattedPhone}`;
    }
    
    // Generate access token
    const accessToken = await generateAccessToken();
    
    // Generate timestamp in the format YYYYMMDDHHmmss
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    
    // Create password (shortcode + passkey + timestamp)
    const password = Buffer.from(
      `${MPESA_SHORT_CODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    
    // Prepare STK push request payload
    const requestBody = {
      BusinessShortCode: MPESA_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: MPESA_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${MPESA_CALLBACK_URL}?bookingRef=${bookingRef}`,
      AccountReference: `McKaiser-${bookingRef}`,
      TransactionDesc: 'Tour booking payment',
    };
    
    // Make request to M-Pesa API
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Store checkout request ID for transaction confirmation
    const checkoutRequestID = response.data.CheckoutRequestID;
    
    // Return success response with checkout request ID
    return res.status(200).json({
      success: true,
      message: 'STK push initiated successfully',
      data: {
        checkoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
      },
    });
  } catch (error) {
    console.error('Error initiating STK push:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate M-Pesa payment',
      error: error.response?.data || error.message,
    });
  }
};

// M-Pesa callback handler
export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    const { Body } = req.body;
    const { bookingRef } = req.query;
    
    // Check if transaction was successful
    if (Body.stkCallback.ResultCode === 0) {
      // Transaction successful
      const transactionDetails = Body.stkCallback.CallbackMetadata.Item.reduce((acc, item) => {
        if (item.Name) {
          acc[item.Name] = item.Value;
        }
        return acc;
      }, {});
      
      // Update booking status with transaction details
      // In a real application, you would update the booking in your database
      console.log(`Payment for booking ${bookingRef} successful:`, transactionDetails);
      
      // Return success acknowledgement to M-Pesa
      return res.status(200).json({ success: true });
    } else {
      // Transaction failed
      console.error(`Payment for booking ${bookingRef} failed:`, Body.stkCallback.ResultDesc);
      
      // Return acknowledgement to M-Pesa
      return res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return res.status(500).json({ success: false });
  }
};

// Check transaction status
export const checkTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestID } = req.params;
    
    // Generate access token
    const accessToken = await generateAccessToken();
    
    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    
    // Create password
    const password = Buffer.from(
      `${MPESA_SHORT_CODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    
    // Prepare request payload
    const requestBody = {
      BusinessShortCode: MPESA_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };
    
    // Make request to M-Pesa API
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Return transaction status
    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check transaction status',
      error: error.response?.data || error.message,
    });
  }
}; 