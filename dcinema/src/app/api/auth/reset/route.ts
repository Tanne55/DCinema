import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '../../../../controllers/AuthController';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, message: 'Email and new password are required' }, { status: 400 });
    }

    const result = await AuthController.resetPassword(email, newPassword);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
