import { Router } from 'express';
import { getDestinations, getDestination, createDestination, updateDestination, deleteDestination } from '../controllers/destinationController';
import { protect } from '../middleware/auth';
import { upload } from '../utils/imageStorage';

const router = Router();

// Public routes
router.get('/', getDestinations);
router.get('/:id', getDestination);

// Protected routes - Add multer middleware for file uploads
router.post('/', protect, upload.single('image'), createDestination);
router.put('/:id', protect, upload.single('image'), updateDestination);
router.delete('/:id', protect, deleteDestination);

export default router; 