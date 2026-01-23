'use client';

import { useState } from 'react';
import { ProjectedRewards } from './rewards/ProjectedRewards';
import { Leaderboard } from './rewards/Leaderboard';
import { RewardHistory } from './rewards/RewardHistory';

type RewardsSection = 'projected' | 'leaderboard' | 'history';

export function RewardsTab() {
  const [activeSection, setActiveSection] = useState<RewardsSection>('projected');

  return (
    <div className="stake_form w-form">
      {/* Section Navigation */}
      <div className="flex justify-center gap-2 mb-4 mix-blend-difference">
        <button
          type="button"
          onClick={() => setActiveSection('projected')}
          className={`px-4 py-2 caption uppercase transition-all ${
            activeSection === 'projected'
              ? 'bg-white text-black mix-blend-normal'
              : 'bg-transparent border border-white text-white opacity-70 hover:opacity-100'
          }`}
        >
          My Rewards
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('leaderboard')}
          className={`px-4 py-2 caption uppercase transition-all ${
            activeSection === 'leaderboard'
              ? 'bg-white text-black mix-blend-normal'
              : 'bg-transparent border border-white text-white opacity-70 hover:opacity-100'
          }`}
        >
          Leaderboard
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('history')}
          className={`px-4 py-2 caption uppercase transition-all ${
            activeSection === 'history'
              ? 'bg-white text-black mix-blend-normal'
              : 'bg-transparent border border-white text-white opacity-70 hover:opacity-100'
          }`}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeSection === 'projected' && <ProjectedRewards />}
        {activeSection === 'leaderboard' && <Leaderboard />}
        {activeSection === 'history' && <RewardHistory />}
      </div>

      {/* Info Footer */}
      <p className="caption uppercase text-center opacity-70 pt-4 mix-blend-difference text-white">
        ORE rewards distributed weekly based on indieSOL holdings
      </p>
    </div>
  );
}
