import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

const REWARDS_API_URL = process.env.REWARDS_API_URL || 'http://134.122.34.66';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '25';

    const response = await fetch(
      `${REWARDS_API_URL}/api/leaderboard?page=${page}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
