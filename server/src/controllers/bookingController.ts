import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Destination from '../models/Destination';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get user bookings
export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user?._id })
      .populate('destination')
      .sort({ createdAt: -1 });
      
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Get single booking
export const getBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('destination');
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to user or is admin
    if (booking.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this booking' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

// Create booking
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { destinationId, travelDate, numberOfTravelers, departureLocation, specialRequests } = req.body;
    
    // Find destination
    const destination = await Destination.findById(destinationId);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Calculate total price
    const totalPrice = destination.price * numberOfTravelers;
    
    // Create booking
    const booking = await Booking.create({
      user: req.user?._id,
      destination: destinationId,
      travelDate,
      numberOfTravelers,
      totalPrice,
      departureLocation,
      specialRequests,
      status: 'pending'
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Update booking status
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'canceled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to user or is admin
    if (booking.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }
    
    // Update status
    booking.status = status;
    await booking.save();
    
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
};

// Cancel booking
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to user
    if (booking.user.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already canceled or completed
    if (booking.status === 'canceled') {
      return res.status(400).json({ message: 'Booking is already canceled' });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }
    
    // Update status to canceled
    booking.status = 'canceled';
    await booking.save();
    
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking' });
  }
}; 