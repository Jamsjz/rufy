import { NextRequest, NextResponse } from 'next/server';
import { getRhymes } from '@/lib/rhymeService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  try {
    const rhymes = await getRhymes(word);
    return NextResponse.json(rhymes);
  } catch (error) {
    console.error('Error fetching rhymes:', error);
    return NextResponse.json({ error: 'Failed to fetch rhymes' }, { status: 500 });
  }
}
