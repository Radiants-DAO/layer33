import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { getStakePoolAccount } from '@solana/spl-stake-pool';

export const revalidate = 60; // Cache for 60 seconds

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const INDIE_SOL_POOL = '74dxJToX8wgJAueLQNVhSbbQkNd9qeVp6m9mts6M7cUb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeIndie = searchParams.get('indie') === 'true';

    // Fetch SOL price from Jupiter
    const solPriceResponse = await fetch(
      `https://lite-api.jup.ag/price/v3?ids=${SOL_MINT}`,
      { next: { revalidate: 60 } }
    );

    if (!solPriceResponse.ok) {
      throw new Error('Failed to fetch SOL price');
    }

    const solPriceData = await solPriceResponse.json();
    const solPrice = parseFloat(solPriceData.data?.[SOL_MINT]?.price || '0').toFixed(2);

    const result: {
      solPrice: string;
      indiePrice?: string;
      indiePriceSol?: string;
    } = { solPrice };

    // If indie price requested, calculate from stake pool
    if (includeIndie) {
      try {
        const rpcUrl =
          process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
          (process.env.HELIUS_API_KEY
            ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
            : 'https://api.mainnet-beta.solana.com');

        const connection = new Connection(rpcUrl, 'confirmed');
        const poolPubkey = new PublicKey(INDIE_SOL_POOL);

        const stakePool = await getStakePoolAccount(connection, poolPubkey);

        const totalLamports = Number(stakePool.account.data.totalLamports);
        const poolTokenSupply = Number(stakePool.account.data.poolTokenSupply);

        if (poolTokenSupply > 0) {
          // Calculate indieSOL price in SOL (lamports per indieSOL token)
          const indiePriceSol = (totalLamports / poolTokenSupply).toFixed(9);
          const indiePrice = (parseFloat(indiePriceSol) * parseFloat(solPrice)).toFixed(2);

          result.indiePriceSol = indiePriceSol;
          result.indiePrice = indiePrice;
        }
      } catch (poolError) {
        console.error('Error fetching stake pool data:', poolError);
        // Return SOL price even if indie price fails
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching price data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
}
