# Layer33 Infrastructure Documentation

## Overview

This document covers the infrastructure for the Layer33 staking platform, including:
- VM setup and configuration
- Rewards API (lst-rewards-indexer)
- Frontend integration (layer33 Next.js site)

---

## VM Configuration

### Server Details
- **IP Address:** 134.122.34.66
- **Domain:** api.layer33.com
- **User:** indexer
- **OS:** Ubuntu (with systemd)

### Firewall (UFW)
```
Port 22  - SSH
Port 80  - HTTP (redirects to HTTPS)
Port 443 - HTTPS
```

### Nginx Configuration
- **Config file:** `/etc/nginx/sites-enabled/rewards-api`
- **Proxy:** Routes `/api/*` requests to `127.0.0.1:3001`
- **Rate limiting:** 30 requests/second per IP, burst of 50
- **TLS:** Let's Encrypt certificate via Certbot

```nginx
# Key settings
server_name api.layer33.com;
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
proxy_pass http://127.0.0.1:3001;
```

### Services Running
| Service | Port | Binding | Description |
|---------|------|---------|-------------|
| Nginx | 80, 443 | 0.0.0.0 | Reverse proxy with TLS |
| Node API | 3001 | 0.0.0.0 | lst-rewards-indexer API |
| PostgreSQL | 5432 | 127.0.0.1 | Database (localhost only) |

### SSH Access
- SSH keys stored in `~/.ssh/authorized_keys`
- To add new key: append public key to that file

---

## Rewards API (lst-rewards-indexer)

### Location
```
/home/indexer/lst-rewards-indexer
```

### Technology Stack
- Node.js with TypeScript
- PostgreSQL database
- Express.js API server

### API Endpoints

#### GET /api/leaderboard
Returns ranked list of stakers with projected rewards.

**Query params:**
- `page` (default: 1)
- `limit` (default: 25)

**Response:**
```json
{
  "currentWindow": "2026-W03",
  "totalParticipants": 56,
  "entries": [
    {
      "rank": 1,
      "wallet": "JCss...oV2x",
      "walletFull": "JCssGhJS8p438J4AiZGKaE1ARLaMbQD61dDquPUqoV2x",
      "weight": "28492975286031965.928446",
      "weightPercentage": "29.6630",
      "projectedReward": {
        "amount": "1112362769",
        "symbol": "ORE",
        "displayAmount": "1.112362769"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 56,
    "totalPages": 6
  }
}
```

#### GET /api/wallet/:address
Returns rewards data for a specific wallet.

**Response:**
```json
{
  "wallet": "JCssGhJS8p438J4AiZGKaE1ARLaMbQD61dDquPUqoV2x",
  "currentWindow": "2026-W03",
  "isEligible": true,
  "isIgnored": false,
  "weight": "28492975286031965.928446",
  "weightPercentage": "29.6630",
  "rank": 1,
  "totalHolders": 56,
  "projectedReward": {
    "amount": "1112362769",
    "symbol": "ORE",
    "decimals": 9,
    "displayAmount": "1.112362769"
  },
  "latestSnapshot": {
    "primaryTokenAmount": "44759657414",
    "eligibilityTokenAmount": "498636946967",
    "eligible": true,
    "timestamp": "2026-01-20T12:00:08.898Z"
  }
}
```

#### GET /api/wallet/:address/history
Returns historical reward distributions for a wallet.

### Key Features

#### IGNORE_WALLETS
Environment variable to exclude specific wallets from rewards.
```bash
IGNORE_WALLETS=wallet1,wallet2,wallet3
```
- Excluded at query time (data preserved in append-only fashion)
- Ignored wallets see "Your wallet is flagged as ineligible" message
- Weights recalculated without ignored wallets

#### Reward Calculation
- Weekly ORE pool: **3.75 ORE**
- Weight = indieSOL balance × time held
- Projected reward = (wallet weight / total weight) × 3.75 ORE

#### Eligibility Requirements
1. Hold at least **1 indieSOL**
2. Hold at least **0.95 compoundORE** (to account for deposit premium)

### Jobs/Scripts
| Script | Purpose |
|--------|---------|
| `normalize-reward-shares.ts` | Create reward config for a window |
| `compute-reward-payouts.ts` | Calculate payouts from config |
| `export-reward-csv.ts` | Export CSV for distribution |

---

## Frontend (layer33 Next.js Site)

### Location
```
/home/jerk/projects/layer33/layer33
```

### Technology Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Solana wallet adapter

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_HELIUS_API_KEY=<helius-api-key>
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=<key>
JUPITER_API_KEY=<jupiter-api-key>
REWARDS_API_URL=http://134.122.34.66  # or https://api.layer33.com
```

### Staking Page Structure

```
app/staking/
├── page.tsx                    # Main staking page
└── components/
    ├── StakingTabs.tsx         # Tab container (Direct/Swap/Rewards)
    ├── DirectStakeTab.tsx      # Direct stake pool form
    ├── SwapTab.tsx             # Jupiter swap form
    ├── RewardsTab.tsx          # Rewards dashboard
    ├── WalletButton.tsx        # Wallet connect button
    └── rewards/
        ├── ProjectedRewards.tsx  # User's projected ORE reward
        ├── Leaderboard.tsx       # Top stakers table
        └── RewardHistory.tsx     # Past distributions
```

### API Routes (Proxies to VM)

| Route | Proxies To |
|-------|------------|
| `/api/rewards/[address]` | `REWARDS_API_URL/api/wallet/:address` |
| `/api/rewards/[address]/history` | `REWARDS_API_URL/api/wallet/:address/history` |
| `/api/leaderboard` | `REWARDS_API_URL/api/leaderboard` |
| `/api/jupiter/quote` | Jupiter Ultra Swap API |
| `/api/sol-price` | Fetches SOL/indieSOL prices |

### Key Token Addresses
```typescript
// lib/constants.ts
INDIESOL_MINT = 'L33mHftsNpaj39z1omnGbGbuA5eKqSsbmr91rjTod48'
INDIE_SOL_POOL = '74dxJToX8wgJAueLQNVhSbbQkNd9qeVp6m9mts6M7cUb'
COMPOUND_ORE_MINT = '4bSvbMtsJA9S9Azm4hF7K3bpftsnRd24BmAmMdN2FSzW'
```

### Design System
- **Split background:** Black on left, white on right
- **Text visibility:** Uses `mix-blend-difference` with white text
- **Active tabs:** White background, black text with `mix-blend-mode: normal`
- **Accent color:** Green (#27FF93 / `var(--color-green)`)
- **Font:** Alfacad (pixel/retro style), uppercase

---

## Deployment

### VM (API)
```bash
# SSH into VM
ssh indexer@134.122.34.66

# Navigate to project
cd ~/lst-rewards-indexer

# Pull latest changes
git pull

# Install dependencies
npm install

# Restart service
sudo systemctl restart lst-rewards-api
```

### Frontend
The frontend can be deployed to Vercel or similar. Ensure environment variables are set.

```bash
# Build
npm run build

# Or deploy to Vercel
vercel --prod
```

---

## Useful Commands

### VM Health Checks
```bash
# Check firewall
sudo ufw status

# Check Nginx
sudo nginx -t
systemctl status nginx

# Check API
systemctl status lst-rewards-api
curl https://api.layer33.com/api/leaderboard?limit=1

# Check TLS certificate
sudo certbot certificates

# Check certificate renewal
sudo certbot renew --dry-run
```

### Database
```bash
# Connect to PostgreSQL
psql -U indexer -d lst_rewards

# Check snapshot counts
SELECT COUNT(*) FROM snapshots;
```

---

## Git Repositories

| Repo | Purpose |
|------|---------|
| `Radiants-DAO/layer33` | Main frontend repo |
| `jerkterror/l33site` | Private fork/backup |
| lst-rewards-indexer (on VM) | Rewards API |

---

## Contact / Access

- **Domain DNS:** Managed externally (request A records as needed)
- **VM Access:** SSH key-based authentication
- **Cloudflare:** Not currently used (direct to VM with Nginx TLS)
