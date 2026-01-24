'use client';

import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { DirectStakeTab } from './DirectStakeTab';
import { SwapTab } from './SwapTab';
import { RewardsTab } from './RewardsTab';
import { WalletButton } from './WalletButton';

export function StakingTabs() {
  return (
    <div className="staking_form">
      {/* Header with title and wallet button */}
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex flex-row items-center gap-x-2 gap-y-2">
          <div className="heading-line"></div>
          <h1 className="heading-style-h2">
            liquid <span className="heading_padding">Staking</span>
          </h1>
          <div className="heading-line"></div>
        </div>
        <WalletButton />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="direct" variant="pill">
        <TabList className="justify-center mb-6 staking-tabs-list">
          <TabTrigger value="direct">DIRECT</TabTrigger>
          <TabTrigger value="swap">SWAP</TabTrigger>
          <TabTrigger value="rewards">REWARDS</TabTrigger>
        </TabList>

        <TabContent value="direct">
          <DirectStakeTab />
        </TabContent>

        <TabContent value="swap">
          <SwapTab />
        </TabContent>

        <TabContent value="rewards">
          <RewardsTab />
        </TabContent>
      </Tabs>
    </div>
  );
}
