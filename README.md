# McKaiser Travels

A full-stack travel booking application built with Next.js, Express, and MongoDB.

## Project Structure

This project consists of two main parts:

- **Frontend**: Next.js application with TypeScript and Tailwind CSS
- **Backend**: Express.js API with TypeScript and MongoDB

## Features

- User authentication (register, login)
- Search for flights, hotels, and tours
- Booking management
- Popular destinations showcase
- Adventure activities
- Newsletter subscription
- Responsive design

## Tech Stack

- **Frontend**:
  - Next.js (React framework)
  - TypeScript
  - Tailwind CSS
  - Zustand (State management)
  - Axios (API client)

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - MongoDB with Mongoose
  - JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mckaiser-travels
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Build and start the server:
```bash
# For development
npm run dev

# For production
npm run build
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- **POST /api/users/register** - Register a new user
- **POST /api/users/login** - Login user
- **GET /api/users/me** - Get current user profile (protected)

### Destinations
- **GET /api/destinations** - Get all destinations
- **GET /api/destinations/:id** - Get a single destination
- **POST /api/destinations** - Create a new destination (protected)
- **PUT /api/destinations/:id** - Update a destination (protected)
- **DELETE /api/destinations/:id** - Delete a destination (protected)

### Bookings
- **GET /api/bookings** - Get user's bookings (protected)
- **GET /api/bookings/:id** - Get a single booking (protected)
- **POST /api/bookings** - Create a new booking (protected)
- **PUT /api/bookings/:id/status** - Update booking status (protected)
- **PUT /api/bookings/:id/cancel** - Cancel a booking (protected)

## How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Credits

- Developer: Nyamao Kaiser