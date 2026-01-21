import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Register
export const register = async (req, res) => {
  try {
    const { username, password /*, email */ } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // const existingEmail = await User.findOne({ email }); // uncomment if using email
    // if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      // email,               // uncomment if using email
      password: hashedPassword,
    });

    res.status(201).json({
      id: user._id,
      username: user.username,
      // email: user.email,   // uncomment if using email
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password /*, email */ } = req.body;

    const user = await User.findOne({ username });
    // const user = await User.findOne({ email }); // uncomment if using email
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      id: user._id,
      username: user.username,
      // email: user.email,   // uncomment if using email
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get current user (protected)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
