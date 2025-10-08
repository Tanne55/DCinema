import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '../../../../controllers/AuthController';
import { extractToken } from '../../../../middleware/auth';

export async function POST(req: NextRequest) {
  try {
    const token = extractToken(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const result = await AuthController.logout(token);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
