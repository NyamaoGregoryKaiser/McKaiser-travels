import express from 'express';
import { protect } from '../middleware/auth';
import { admin } from '../middleware/admin';
import * as adminController from '../controllers/adminController';
import { upload } from '../utils/imageStorage';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(protect, admin);

// Dashboard analytics
router.get('/analytics', adminController.getAnalytics);

// User management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Booking management
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id', adminController.updateBooking);
router.delete('/bookings/:id', adminController.deleteBooking);

// Destination management
router.get('/destinations', adminController.getAllDestinations);
router.post('/destinations', upload.single('image'), adminController.createDestination);
router.put('/destinations/:id', upload.single('image'), adminController.updateDestination);
router.delete('/destinations/:id', adminController.deleteDestination);

// System settings
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSettings);

export default router; 