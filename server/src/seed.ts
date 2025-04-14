import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Destination from './models/Destination';
import Booking from './models/Booking';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mckaiser-travels');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('Admin user created');

    // Create regular user
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log('Regular user created');

    // Create destinations
    const destinations = await Destination.insertMany([
      {
        name: 'Venice',
        description: 'Explore the beautiful canals of Venice',
        image: '/images/destination1.png',
        price: 1200,
        country: 'Italy',
        rating: 4.8,
        featured: true,
        category: 'tour'
      },
      {
        name: 'Maldives',
        description: 'Relax on the pristine beaches of Maldives',
        image: '/images/destination2.png',
        price: 2500,
        country: 'Maldives',
        rating: 4.9,
        featured: true,
        category: 'hotel'
      },
      {
        name: 'Greece',
        description: 'Discover the ancient ruins and beautiful islands of Greece',
        image: '/images/destination3.png',
        price: 1800,
        country: 'Greece',
        rating: 4.7,
        featured: true,
        category: 'tour'
      },
      {
        name: 'Santorini',
        description: 'Experience the stunning views of Santorini',
        image: '/images/destination4.png',
        price: 2000,
        country: 'Greece',
        rating: 4.9,
        featured: true,
        category: 'hotel'
      },
      {
        name: 'Paris',
        description: 'The city of love and lights',
        image: '/images/destination1.png',
        price: 1500,
        country: 'France',
        rating: 4.6,
        featured: false,
        category: 'flight'
      }
    ]);
    console.log('Destinations created');

    // Create a booking
    await Booking.create({
      user: regularUser._id,
      destination: destinations[0]._id,
      travelDate: new Date('2024-06-15'),
      numberOfTravelers: 2,
      totalPrice: destinations[0].price * 2,
      departureLocation: 'New York',
      status: 'confirmed'
    });
    console.log('Sample booking created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 