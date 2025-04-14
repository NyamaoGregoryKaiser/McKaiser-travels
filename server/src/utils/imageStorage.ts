import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, uploadDir);
  },
  filename: function(req: Request, file: Express.Multer.File, cb: Function) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: fileFilter
});

// Function to get public URL for an image
export const getImageUrl = (filename: string): string => {
  if (!filename) return '';
  return `/uploads/${filename}`;
};

// Function to delete an image
export const deleteImage = (filename: string): void => {
  if (!filename) return;
  
  const filePath = path.join(uploadDir, filename);
  
  // Check if file exists before attempting to delete
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};