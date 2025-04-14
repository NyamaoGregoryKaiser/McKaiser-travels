import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import Destination from '../models/Destination';
import mongoose from 'mongoose';
import { deleteImage, getImageUrl } from '../utils/imageStorage';

interface AuthRequest extends Request {
  user?: any;
}

// Dashboard analytics
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total bookings count
    const totalBookings = await Booking.countDocuments();
    
    // Get bookings by status
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const canceledBookings = await Booking.countDocuments({ status: 'canceled' });
    
    // Calculate total revenue
    const bookings = await Booking.find({});
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const avgBookingValue = totalRevenue / (totalBookings || 1); // Avoid division by zero
    
    // Get most popular destination
    const destinationCounts = await Booking.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const mostPopularDestination = destinationCounts.length > 0 ? 
      await Destination.findById(destinationCounts[0]._id) : 
      null;
    
    // Get monthly bookings for the current year
    const currentYear = new Date().getFullYear();
    const monthlyBookings = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      const count = await Booking.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      
      monthlyBookings.push(count);
    }
    
    res.status(200).json({
      totalUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      canceledBookings,
      totalRevenue,
      avgBookingValue,
      mostPopularDestination: mostPopularDestination ? {
        id: mostPopularDestination._id,
        name: mostPopularDestination.name,
        bookings: destinationCounts[0].count
      } : null,
      monthlyBookings
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};

// User management
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user'
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, role, password } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password;
    
    const updatedUser = await user.save();
    
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Booking management
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find().populate('destination');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { status, travelDate, numberOfTravelers, totalPrice } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update booking fields
    if (status) booking.status = status;
    if (travelDate) booking.travelDate = travelDate;
    if (numberOfTravelers) booking.numberOfTravelers = numberOfTravelers;
    if (totalPrice) booking.totalPrice = totalPrice;
    
    booking.updatedAt = new Date();
    
    const updatedBooking = await booking.save();
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    await booking.deleteOne();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking' });
  }
};

// Destination management
export const getAllDestinations = async (req: AuthRequest, res: Response) => {
  try {
    const destinations = await Destination.find();
    
    // Calculate the number of bookings for each destination
    const destinationsWithBookings = await Promise.all(
      destinations.map(async (destination) => {
        const bookingsCount = await Booking.countDocuments({ destination: destination._id });
        
        return {
          _id: destination._id,
          name: destination.name,
          description: destination.description,
          country: destination.country,
          price: destination.price,
          image: destination.image,
          featured: destination.featured,
          rating: destination.rating,
          category: destination.category,
          bookings: bookingsCount
        };
      })
    );
    
    res.status(200).json(destinationsWithBookings);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
};

export const createDestination = async (req: AuthRequest & { file?: any }, res: Response) => {
  try {
    const { name, description, price, country, rating, featured, category } = req.body;
    
    // Validate required fields
    if (!name || !description || !country || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Handle image upload
    let imagePath = '';
    if (req.file) {
      // Get just the filename without path
      const filename = req.file.filename;
      imagePath = getImageUrl(filename);
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const destination = await Destination.create({
      name,
      description,
      image: imagePath,
      price: parseFloat(price),
      country,
      rating: parseFloat(rating || '0'),
      featured: featured === 'true',
      category
    });
    
    res.status(201).json(destination);
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ message: 'Error creating destination' });
  }
};

export const updateDestination = async (req: AuthRequest & { file?: any }, res: Response) => {
  try {
    const { name, description, price, country, rating, featured, category } = req.body;
    
    // Find the destination to update
    const existingDestination = await Destination.findById(req.params.id);
    if (!existingDestination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Update image if provided
    let imagePath = existingDestination.image;
    if (req.file) {
      // If there's an old image, delete it
      if (existingDestination.image) {
        // Extract filename from image URL
        const oldFilename = existingDestination.image.split('/').pop();
        if (oldFilename) {
          deleteImage(oldFilename);
        }
      }
      
      // Set the new image path
      imagePath = getImageUrl(req.file.filename);
    }
    
    const updatedData = {
      name: name || existingDestination.name,
      description: description || existingDestination.description,
      image: imagePath,
      price: price ? parseFloat(price) : existingDestination.price,
      country: country || existingDestination.country,
      rating: rating ? parseFloat(rating) : existingDestination.rating,
      featured: featured !== undefined ? featured === 'true' : existingDestination.featured,
      category: category || existingDestination.category
    };
    
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    
    res.status(200).json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ message: 'Error updating destination' });
  }
};

export const deleteDestination = async (req: AuthRequest, res: Response) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Check if destination has any bookings
    const bookings = await Booking.countDocuments({ destination: destination._id });
    if (bookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete destination with existing bookings. Update bookings first or mark destination as inactive instead.' 
      });
    }
    
    // Delete the associated image
    if (destination.image) {
      const filename = destination.image.split('/').pop();
      if (filename) {
        deleteImage(filename);
      }
    }
    
    // Delete the destination
    await destination.deleteOne();
    
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ message: 'Error deleting destination' });
  }
};

// System settings
export const getSystemSettings = async (req: AuthRequest, res: Response) => {
  try {
    // In a real application, this would fetch from a settings collection
    // For now, we'll return default settings
    res.status(200).json({
      siteName: 'McKaiser Travels',
      contactEmail: 'info@mckaiser-travels.com',
      currency: 'USD',
      maintenanceMode: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system settings' });
  }
};

export const updateSystemSettings = async (req: AuthRequest, res: Response) => {
  try {
    // In a real application, this would update a settings collection
    // For now, we'll just return the updated settings
    const { siteName, contactEmail, currency, maintenanceMode } = req.body;
    
    res.status(200).json({
      siteName,
      contactEmail,
      currency,
      maintenanceMode
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating system settings' });
  }
}; 