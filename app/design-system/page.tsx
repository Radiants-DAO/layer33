'use client';

import { DesignSystemTab } from '@/devtools/tabs/ComponentsTab/DesignSystemTab';
import Link from 'next/link';
import { Logo } from '@/components/icons';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black sticky top-0 bg-white z-50">
        <div className="container-large px-4 md:px-10 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 md:gap-4 hover:opacity-70 transition-opacity">
              <Logo variant="logomark" height="1.5rem" />
              <span className="font-alfacad uppercase text-sm">Design System</span>
            </Link>
            <nav className="flex items-center gap-4 md:gap-6">
              <Link href="/" className="font-alfacad uppercase text-sm hover:text-neutral-neutral-4 transition-colors">
                Home
              </Link>
              <Link href="/staking" className="font-alfacad uppercase text-sm hover:text-neutral-neutral-4 transition-colors">
                Staking
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-large px-4 md:px-10 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="font-alfacad uppercase text-2xl md:text-5xl mb-2">Component Library</h1>
          <p className="font-alfacad text-sm md:text-base text-neutral-neutral-3">
            A comprehensive guide to all UI components in the Layer33 design system.
          </p>
        </div>

        {/* Design System Content - Full Width */}
        <div className="bg-white border border-black rounded-none shadow-[4px_4px_0_0_var(--color-black)] p-4 md:p-8">
          <DesignSystemTab />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black mt-8 md:mt-16">
        <div className="container-large px-4 md:px-10 py-4 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-neutral-neutral-3">
            <div>© Copyright 2025. layer33. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-black transition-colors">Terms</Link>
              <Link href="/" className="hover:text-black transition-colors">Policy</Link>
              <Link href="/" className="hover:text-black transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
