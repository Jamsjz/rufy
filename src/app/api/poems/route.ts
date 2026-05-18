import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const poems = await prisma.poem.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, language = 'en' } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const poem = await prisma.poem.create({
      data: {
        title: title || null,
        content,
        language,
        userId: session.userId,
      },
    });

    return NextResponse.json(poem, { status: 201 });
  } catch (error) {
    console.error('Error creating poem:', error);
    return NextResponse.json({ error: 'Failed to create poem' }, { status: 500 });
  }
}
