import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Comment from '@/models/Comment';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { productId, text, userName, userImage } = await request.json();

    if (!userId || !productId || !text) {
      return NextResponse.json({ success: false, message: 'Invalid data' });
    }

    await connectDB();

    const comment = await Comment.create({
      userId,
      productId,
      text,
      userName,
      userImage,
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
