import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export function generateToken(user){
    return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    secretKey,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}