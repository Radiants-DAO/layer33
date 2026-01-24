import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

const REWARDS_API_URL = (process.env.REWARDS_API_URL || 'https://api.layer33.com').replace(/\/$/, '');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${REWARDS_API_URL}/api/wallet/${address}/history?page=${page}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reward history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reward history' },
      { status: 500 }
    );
  }
}
