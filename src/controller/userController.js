import * as userService from '../service/userService.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching users' });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await userService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a password reset email
export const resetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create a reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the reset email
    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `To reset your password, click the following link: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset the password after verifying the reset token
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password successfully updated.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};