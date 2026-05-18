import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const poem = await prisma.poem.findUnique({
      where: { id },
    });

    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }

    if (poem.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(poem);
  } catch (error) {
    console.error('Error fetching poem:', error);
    return NextResponse.json({ error: 'Failed to fetch poem' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingPoem = await prisma.poem.findUnique({ where: { id } });

    if (!existingPoem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }

    if (existingPoem.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, language } = body;

    const poem = await prisma.poem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title || null }),
        ...(content !== undefined && { content }),
        ...(language !== undefined && { language }),
      },
    });

    return NextResponse.json(poem);
  } catch (error) {
    console.error('Error updating poem:', error);
    return NextResponse.json({ error: 'Failed to update poem' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingPoem = await prisma.poem.findUnique({ where: { id } });

    if (!existingPoem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }

    if (existingPoem.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.poem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting poem:', error);
    return NextResponse.json({ error: 'Failed to delete poem' }, { status: 500 });
  }
}
