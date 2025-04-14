import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  description: string;
  image: string;
  price: number;
  country: string;
  rating: number;
  featured: boolean;
  category: 'flight' | 'hotel' | 'tour';
}

const DestinationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: ['flight', 'hotel', 'tour']
  }
}, {
  timestamps: true
});

export default mongoose.model<IDestination>('Destination', DestinationSchema); 