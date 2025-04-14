import { Request, Response } from 'express';
import Destination from '../models/Destination';
import { deleteImage, getImageUrl } from '../utils/imageStorage';

// Define extended request interface with file
interface RequestWithFile extends Request {
  file?: any;
}

// Get all destinations
export const getDestinations = async (req: Request, res: Response) => {
  try {
    const { category, featured, limit = 10 } = req.query;
    
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured) {
      query.featured = featured === 'true';
    }
    
    const destinations = await Destination.find(query)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
      
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
};

// Get single destination
export const getDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.status(200).json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ message: 'Error fetching destination' });
  }
};

// Create destination
export const createDestination = async (req: RequestWithFile, res: Response) => {
  try {
    const { name, description, price, country, rating, featured, category } = req.body;
    
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

// Update destination
export const updateDestination = async (req: RequestWithFile, res: Response) => {
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

// Delete destination
export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
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