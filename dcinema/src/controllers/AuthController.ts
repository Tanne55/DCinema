import { User, IUserInput, ILoginInput } from '../models/User';

export interface IAuthResponse {
  success: boolean;
  message: string;
  user?: Omit<import('../models/User').IUser, 'password'>;
  token?: string;
}

export class AuthController {
  // Register a new user
  static async register(userData: IUserInput): Promise<IAuthResponse> {
    try {
      // Validate input
      if (!userData.email || !userData.password || !userData.name) {
        return {
          success: false,
          message: 'Email, password, and name are required'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          message: 'Invalid email format'
        };
      }

      // Validate password strength
      if (userData.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      // Create user
      const user = await User.create(userData);
      const token = User.generateToken(user);

      return {
        success: true,
        message: 'User registered successfully',
        user: User.toJSON(user),
        token
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  // Login user
  static async login(loginData: ILoginInput): Promise<IAuthResponse> {
    try {
      // Validate input
      if (!loginData.email || !loginData.password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      // Find user by email
      const user = await User.findByEmail(loginData.email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await User.verifyPassword(loginData.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate token
      const token = User.generateToken(user);

      return {
        success: true,
        message: 'Login successful',
        user: User.toJSON(user),
        token
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  // Get current user from token
  static async getCurrentUser(token: string): Promise<IAuthResponse> {
    try {
      if (!token) {
        return {
          success: false,
          message: 'No token provided'
        };
      }

      // Verify token
      const decoded = User.verifyToken(token);
      if (!decoded) {
        return {
          success: false,
          message: 'Invalid token'
        };
      }

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User found',
        user: User.toJSON(user)
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user'
      };
    }
  }

  // Logout (for future implementation with token blacklist)
  static async logout(token: string): Promise<IAuthResponse> {
    // In a real application, you would add the token to a blacklist
    // For now, we'll just return success since we're using stateless JWT
    return {
      success: true,
      message: 'Logout successful'
    };
  }
}
