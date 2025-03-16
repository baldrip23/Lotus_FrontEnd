import { connectDB } from './mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

export async function signUp(email: string, password: string, fullName: string) {
  const db = await connectDB();
  const collection = db.collection('users');

  // Check if user exists
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const result = await collection.insertOne({
    email,
    password: hashedPassword,
    fullName,
    role: 'user',
    createdAt: new Date(),
  });

  // Create profile
  await db.collection('profiles').insertOne({
    userId: result.insertedId,
    firstName: fullName.split(' ')[0],
    lastName: fullName.split(' ').slice(1).join(' ') || fullName.split(' ')[0],
    phone: '',
    address: '',
    budget: 0,
    createdAt: new Date(),
  });

  const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: '7d' });
  return { token };
}

export async function signIn(email: string, password: string) {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
  return { token };
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = await connectDB();
    const user = await db.collection('users').findOne({ _id: decoded.userId });
    return user as User;
  } catch (error) {
    return null;
  }
}