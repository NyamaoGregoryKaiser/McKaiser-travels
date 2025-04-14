// Switch to mckaiser-travels database
db = db.getSiblingDB('mckaiser-travels');

// Create users collection with dummy data
db.users.insertMany([
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'admin',
    createdAt: new Date('2023-01-15')
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'user',
    createdAt: new Date('2023-02-20')
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'user',
    createdAt: new Date('2023-03-10')
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'user',
    createdAt: new Date('2023-03-15')
  },
  {
    name: 'Robert Johnson',
    email: 'robert@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'user',
    createdAt: new Date('2023-04-01')
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'user',
    createdAt: new Date('2023-04-15')
  },
  {
    name: 'Michael Brown',
    email: 'michael@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'user',
    createdAt: new Date('2023-05-01')
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: '$2a$10$XgXB0kGzK0CzOx1cCdZJoONSLzbWBHlAd5IfOQBTL.O.1wUVn1JXi', // 'password123'
    role: 'user',
    createdAt: new Date('2023-05-15')
  }
]);

// Create destinations collection with dummy data
db.destinations.insertMany([
  {
    name: 'Serengeti National Park',
    description: 'Experience the majesty of the African savanna with its incredible wildlife and the great wildebeest migration.',
    image: 'serengeti.jpg',
    price: 2200,
    country: 'Tanzania',
    rating: 4.9,
    featured: true,
    category: 'tour',
    createdAt: new Date('2023-01-10')
  },
  {
    name: 'Victoria Falls',
    description: 'Witness the breathtaking power of one of the world\'s largest waterfalls, known locally as "The Smoke That Thunders".',
    image: 'victoria-falls.jpg',
    price: 1800,
    country: 'Zimbabwe/Zambia',
    rating: 4.7,
    featured: true,
    category: 'tour',
    createdAt: new Date('2023-01-15')
  },
  {
    name: 'Cape Town',
    description: 'Explore the vibrant coastal city with Table Mountain as your backdrop, offering stunning views and rich cultural experiences.',
    image: 'capetown.jpg',
    price: 1700,
    country: 'South Africa',
    rating: 4.8,
    featured: true,
    category: 'flight',
    createdAt: new Date('2023-01-20')
  },
  {
    name: 'Pyramids of Giza',
    description: 'Stand in awe before the last remaining wonder of the ancient world, the magnificent pyramids and Sphinx.',
    image: 'pyramids.jpg',
    price: 2400,
    country: 'Egypt',
    rating: 4.9,
    featured: true,
    category: 'tour',
    createdAt: new Date('2023-02-01')
  },
  {
    name: 'Maasai Mara',
    description: 'Experience the iconic African safari in Kenya\'s most famous wildlife reserve, home to the Big Five.',
    image: 'maasai-mara.jpg',
    price: 2300,
    country: 'Kenya',
    rating: 4.8,
    featured: true,
    category: 'tour',
    createdAt: new Date('2023-02-10')
  },
  {
    name: 'Zanzibar',
    description: 'Relax on pristine white beaches and explore the historic Stone Town on this beautiful island paradise.',
    image: 'zanzibar.jpg',
    price: 1900,
    country: 'Tanzania',
    rating: 4.6,
    featured: false,
    category: 'hotel',
    createdAt: new Date('2023-02-20')
  },
  {
    name: 'Marrakech',
    description: 'Get lost in the vibrant souks and experience the rich cultural heritage of this ancient imperial city.',
    image: 'marrakech.jpg',
    price: 1600,
    country: 'Morocco',
    rating: 4.7,
    featured: false,
    category: 'hotel',
    createdAt: new Date('2023-03-01')
  },
  {
    name: 'Okavango Delta',
    description: 'Explore this unique inland delta, one of the world\'s premier wildlife destinations, by traditional mokoro canoe.',
    image: 'okavango.jpg',
    price: 2500,
    country: 'Botswana',
    rating: 4.9,
    featured: false,
    category: 'tour',
    createdAt: new Date('2023-03-10')
  },
  {
    name: 'Sahara Desert',
    description: 'Experience the magic of camping under the stars in the world\'s largest hot desert, riding camels across golden dunes.',
    image: 'sahara.jpg',
    price: 1800,
    country: 'Morocco',
    rating: 4.5,
    featured: false,
    category: 'tour',
    createdAt: new Date('2023-03-20')
  },
  {
    name: 'Kruger National Park',
    description: 'Embark on an unforgettable safari in South Africa\'s largest game reserve, home to an incredible diversity of wildlife.',
    image: 'kruger.jpg',
    price: 2100,
    country: 'South Africa',
    rating: 4.8,
    featured: false,
    category: 'tour',
    createdAt: new Date('2023-04-01')
  }
]);

// Get destination IDs for bookings
let destinations = db.destinations.find().toArray();
let destIds = {};
destinations.forEach(dest => {
  destIds[dest.name] = dest._id;
});

// Create bookings collection with dummy data
let bookings = [];

// Generate more realistic booking data with varied dates and statuses
const users = db.users.find().toArray();
const statuses = ['pending', 'confirmed', 'completed', 'canceled'];
const currentYear = new Date().getFullYear();

// Helper function to create a random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Create a booking for each destination and user with varied dates
destinations.forEach((dest, destIndex) => {
  users.forEach((user, userIndex) => {
    if (user.role !== 'admin') { // Don't create bookings for admin users
      // Create bookings spread throughout the year
      const monthOffset = (destIndex + userIndex) % 12;
      const bookingDate = new Date(currentYear, monthOffset, Math.floor(Math.random() * 28) + 1);
      
      // Travel date is 1-6 months in the future from booking date
      const travelDate = new Date(bookingDate);
      travelDate.setMonth(travelDate.getMonth() + Math.floor(Math.random() * 6) + 1);
      
      // Determine status based on travel date
      let status;
      const now = new Date();
      if (travelDate < now) {
        // Past travel dates are either completed or canceled
        status = Math.random() > 0.2 ? 'completed' : 'canceled';
      } else if (bookingDate > now) {
        // Future booking dates are pending
        status = 'pending';
      } else {
        // Current bookings are confirmed
        status = 'confirmed';
      }
      
      // Number of travelers between 1 and 4
      const numberOfTravelers = Math.floor(Math.random() * 4) + 1;
      
      // Calculate total price based on destination price and number of travelers
      const totalPrice = dest.price * numberOfTravelers;
      
      bookings.push({
        user: user.email,
        destination: dest._id,
        travelDate: travelDate,
        numberOfTravelers: numberOfTravelers,
        totalPrice: totalPrice,
        status: status,
        departureLocation: ['London', 'New York', 'Dubai', 'Paris', 'Tokyo'][Math.floor(Math.random() * 5)],
        createdAt: bookingDate,
        updatedAt: bookingDate
      });
    }
  });
});

// Insert all bookings
db.bookings.insertMany(bookings);

print('Database mckaiser-travels created with enhanced test data!');
print('Users created: ' + db.users.countDocuments());
print('Destinations created: ' + db.destinations.countDocuments());
print('Bookings created: ' + db.bookings.countDocuments()); 