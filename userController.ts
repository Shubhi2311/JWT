
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../connection'; 

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ status: false, message: 'Username and password are required' });
    return;
  }
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = (rows as any[])[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });

    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return; 
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return; 
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if ((existingUser as any[]).length > 0) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    const insertId = (result as any).insertId;

    res.status(201).json({ message: 'User registered successfully', userId: insertId });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const jwtMiddleware =  (req: any, res: any) => {
//   res.status(200).json({ message: 'You have access to the protected route', user: req.user });
// };
