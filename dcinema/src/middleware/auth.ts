import { NextRequest, NextResponse } from 'next/server';
import { User } from '../models/User';

export function withAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, message: 'No token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Verify token
      const decoded = User.verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        );
      }

      // Get user from database
      const user = await User.findById(decoded.id);
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        );
      }

      // Call the original handler with the authenticated user
      return handler(req, User.toJSON(user));
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
