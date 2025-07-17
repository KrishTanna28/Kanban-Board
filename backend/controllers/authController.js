import { User } from '../models/users.js';
import { generateToken } from '../utils/generateTokens.js';

export async function register(req, res) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ username, email });
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();
        const token = generateToken(user._id);
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error registering user' });
    }
};

export async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error logging in user' });
    }
};

export async function getUsers(req, res) {
    try {
        const users = await User.find().select('-password');
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching users' });
    }
}