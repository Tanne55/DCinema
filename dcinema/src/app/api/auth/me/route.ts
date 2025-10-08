import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '../../../../controllers/AuthController';
import { extractToken } from '../../../../middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const token = extractToken(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const result = await AuthController.getCurrentUser(token);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
