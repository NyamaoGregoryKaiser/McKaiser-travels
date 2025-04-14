import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  destination: mongoose.Types.ObjectId;
  travelDate: Date;
  numberOfTravelers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  departureLocation: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  numberOfTravelers: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'canceled', 'completed'],
    default: 'pending'
  },
  departureLocation: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema); 