import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Create a separate interface for the user document structure
export interface IUserDocument {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

// Create interface that extends Document for the model type
export interface IUser extends IUserDocument, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);