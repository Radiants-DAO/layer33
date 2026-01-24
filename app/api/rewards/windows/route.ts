import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

const REWARDS_API_URL = (process.env.REWARDS_API_URL || 'https://api.layer33.com').replace(/\/$/, '');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '5';

    const response = await fetch(
      `${REWARDS_API_URL}/api/rewards/windows?limit=${limit}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reward windows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reward windows' },
      { status: 500 }
    );
  }
}
