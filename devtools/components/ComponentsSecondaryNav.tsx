'use client';

import { Tabs, TabList, TabTrigger } from '@/components/ui/Tabs';
import { AddTabButton } from '../tabs/ComponentsTab/AddTabButton';

interface ComponentsSecondaryNavProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
  onAddFolder: (folderName: string) => void;
}

export function ComponentsSecondaryNav({
  activeSubTab,
  onSubTabChange,
  tabs,
  onAddFolder,
}: ComponentsSecondaryNavProps) {
  return (
    <div className="flex items-center gap-1 bg-white border-t border-black overflow-x-auto">
      <Tabs value={activeSubTab} onValueChange={onSubTabChange} variant="pill" className="flex">
        <TabList>
          {tabs.map((tab) => (
            <TabTrigger key={tab.id} value={tab.id} className="font-space-mono text-xs">
              {tab.label}
            </TabTrigger>
          ))}
        </TabList>
      </Tabs>
      <AddTabButton
        onAdd={(folderName) => {
          onAddFolder(folderName);
          // Also trigger via ComponentsTab's handler if available
          if (window.__componentsTabAddFolder) {
            window.__componentsTabAddFolder(folderName);
          }
        }}
      />
    </div>
  );
}

