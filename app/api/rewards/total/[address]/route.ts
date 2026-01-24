import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

const REWARDS_API_URL = (process.env.REWARDS_API_URL || 'https://api.layer33.com').replace(/\/$/, '');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${REWARDS_API_URL}/api/rewards/total/${address}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching total rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total rewards' },
      { status: 500 }
    );
  }
}
