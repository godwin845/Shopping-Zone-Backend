import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user'; // Assuming you have an interface IUser for User model
import { IUser } from '../interfaces/interfaces';

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const users = await User.find();
    return users; 
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<{ message: string; token: string }> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already registered.');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  // Optionally generate JWT on registration
  const token = jwt.sign({ userId: newUser._id, email: newUser.email }, 'dhckwhnyehwfowe', { expiresIn: '1h' });

  return { message: 'User registered successfully.', token };
};

export const loginUser = async (email: string, password: string): Promise<{ message: string; token: string }> => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password.');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password.');

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, email: user.email }, 'dhckwhnyehwfowe', { expiresIn: '1h' });

  return { message: 'Login successful.', token };
};