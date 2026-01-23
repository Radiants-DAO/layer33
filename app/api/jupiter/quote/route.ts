import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inputMint = searchParams.get('inputMint');
    const outputMint = searchParams.get('outputMint');
    const amount = searchParams.get('amount');
    const taker = searchParams.get('taker');
    const slippageBps = searchParams.get('slippageBps') || '50';

    if (!inputMint || !outputMint || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: inputMint, outputMint, amount' },
        { status: 400 }
      );
    }

    if (!taker) {
      return NextResponse.json(
        { error: 'Wallet address (taker) is required for transaction generation' },
        { status: 400 }
      );
    }

    const apiKey = process.env.JUPITER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Jupiter API key not configured' },
        { status: 500 }
      );
    }

    // Use Jupiter Ultra Swap API
    const jupiterUrl = new URL('https://api.jup.ag/ultra/v1/order');
    jupiterUrl.searchParams.set('inputMint', inputMint);
    jupiterUrl.searchParams.set('outputMint', outputMint);
    jupiterUrl.searchParams.set('amount', amount);
    jupiterUrl.searchParams.set('taker', taker);
    jupiterUrl.searchParams.set('slippageBps', slippageBps);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(jupiterUrl.toString(), {
        headers: {
          'x-api-key': apiKey,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Jupiter API error:', errorText);

        // Parse error for user-friendly message
        let userMessage = 'Failed to get swap quote';
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            userMessage = errorJson.error;
          }
        } catch {
          // Use generic message
        }

        return NextResponse.json(
          { error: userMessage },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeout);
      if ((fetchError as Error).name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out' },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swap quote' },
      { status: 500 }
    );
  }
}
