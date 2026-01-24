import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour (historical data)

const REWARDS_API_URL = (process.env.REWARDS_API_URL || 'https://api.layer33.com').replace(/\/$/, '');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ windowId: string }> }
) {
  try {
    const { windowId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '25';

    if (!windowId) {
      return NextResponse.json(
        { error: 'Window ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${REWARDS_API_URL}/api/rewards/window/${windowId}?page=${page}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );

    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Window not found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching window payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch window payouts' },
      { status: 500 }
    );
  }
}
