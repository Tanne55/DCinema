import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../lib/database';

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IUserInput {
  email: string;
  password: string;
  name: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export class User {
  // Create a new user
  static async create(userData: IUserInput): Promise<IUser> {
    // Check if user already exists
    const existingUser = this.findByEmailSync(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Insert user into database
    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(userData.email, hashedPassword, userData.name);
    
    // Get the created user
    const newUser = this.findByIdSync(result.lastInsertRowid as number);
    if (!newUser) {
      throw new Error('Failed to create user');
    }

    return newUser;
  }

  // Find user by email (sync version for internal use)
  private static findByEmailSync(email: string): IUser | null {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as IUser | undefined;
    return user || null;
  }

  // Find user by email
  static async findByEmail(email: string): Promise<IUser | null> {
    return this.findByEmailSync(email);
  }

  // Find user by ID (sync version for internal use)
  private static findByIdSync(id: number): IUser | null {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as IUser | undefined;
    return user || null;
  }

  // Find user by ID
  static async findById(id: number): Promise<IUser | null> {
    return this.findByIdSync(id);
  }

  // Verify password
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generate JWT token
  static generateToken(user: IUser): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      secret,
      { expiresIn: '7d' }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  // Return user without password
  static toJSON(user: IUser): Omit<IUser, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get all users (for demo purposes)
  static getAllUsers(): Omit<IUser, 'password'>[] {
    const stmt = db.prepare('SELECT * FROM users');
    const users = stmt.all() as IUser[];
    return users.map(user => this.toJSON(user));
  }

  // Update password by email (hashes password)
  static async updatePasswordByEmail(email: string, newPassword: string): Promise<boolean> {
    const hashed = await bcrypt.hash(newPassword, 12);
    const stmt = db.prepare("UPDATE users SET password = ?, updated_at = datetime('now') WHERE email = ?");
    const result = stmt.run(hashed, email);
    return result.changes > 0;
  }
}
