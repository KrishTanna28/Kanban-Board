import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export async function auth(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, secretKey);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }catch(err){
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
}