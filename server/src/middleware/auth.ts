import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User'; // Import IUser interface

// Extend Express Request interface
interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'No user found with this id' });
    }

    // Use type assertion to avoid TypeScript errors
    req.user = user.toObject ? user.toObject() as IUser : user as unknown as IUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};