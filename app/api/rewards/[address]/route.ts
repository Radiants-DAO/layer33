import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 30; // Cache for 30 seconds

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
      `${REWARDS_API_URL}/api/wallet/${address}`,
      { next: { revalidate: 30 } }
    );

    if (response.status === 404) {
      // Wallet not found - return empty data
      return NextResponse.json({
        wallet: address,
        currentWindow: null,
        isEligible: false,
        isIgnored: false,
        weight: '0',
        weightPercentage: '0',
        rank: 0,
        totalHolders: 0,
        projectedReward: {
          amount: '0',
          symbol: 'ORE',
          decimals: 9,
          displayAmount: '0.000000000',
        },
        latestSnapshot: null,
      });
    }

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching wallet rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet rewards' },
      { status: 500 }
    );
  }
}
