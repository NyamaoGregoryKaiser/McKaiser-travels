import { Router } from 'express';
import { getUserBookings, getBooking, createBooking, updateBookingStatus, cancelBooking } from '../controllers/bookingController';
import { protect } from '../middleware/auth';

const router = Router();

// All booking routes are protected
router.use(protect);

router.get('/', getUserBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

export default router; 