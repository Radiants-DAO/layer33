'use client';

import React from 'react';
import { Section, Container, PagePadding, Footer } from '@/components/33layout';

// ============================================================================
// Helper Components
// ============================================================================

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3
        className="mb-3 border-b border-black/20 pb-2"
      >
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function PropsDisplay({ props }: { props: string }) {
  return (
    <code className="bg-black/5 px-2 py-1 rounded-sm block mt-2">
      {props}
    </code>
  );
}

function Row({ children, props }: {
  children: React.ReactNode;
  props?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
      </div>
      {props && <PropsDisplay props={props} />}
    </div>
  );
}

// ============================================================================
// Preview Content
// ============================================================================

function SectionContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 border border-black bg-[var(--color-white)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Section Variants
        </h3>
        <div className="flex flex-col gap-4">
          <div className="border border-black p-4">
            <Section variant="default" data-edit-scope="component-definition" data-component="Section">
              <p className="text-sm">Default section with pt-32 pb-32</p>
            </Section>
          </div>
          <PropsDisplay props='variant="default"' />
          
          <div className="border border-black p-4">
            <Section variant="hero" data-edit-scope="component-definition" data-component="Section" data-edit-variant="hero">
              <p className="text-sm">Hero section with min-h-[99dvh]</p>
            </Section>
          </div>
          <PropsDisplay props='variant="hero"' />
          
          <div className="border border-black p-4">
            <Section variant="cta" data-edit-scope="component-definition" data-component="Section" data-edit-variant="cta">
              <p className="text-sm text-white">CTA section with gradient background</p>
            </Section>
          </div>
          <PropsDisplay props='variant="cta"' />
          
          <div className="border border-black p-4">
            <Section variant="footer" data-edit-scope="component-definition" data-component="Section" data-edit-variant="footer">
              <p className="text-sm">Footer section</p>
            </Section>
          </div>
          <PropsDisplay props='variant="footer"' />
          
          <div className="border border-black p-4">
            <Section variant="faq" data-edit-scope="component-definition" data-component="Section" data-edit-variant="faq">
              <p className="text-sm">FAQ section with pt-40 pb-40</p>
            </Section>
          </div>
          <PropsDisplay props='variant="faq"' />
          
          <div className="border border-black p-4">
            <Section variant="backstop" data-edit-scope="component-definition" data-component="Section" data-edit-variant="backstop">
              <p className="text-sm">Backstop section</p>
            </Section>
          </div>
          <PropsDisplay props='variant="backstop"' />
        </div>
      </div>
    </div>
  );
}

function ContainerContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 border border-black bg-[var(--color-white)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Container Sizes
        </h3>
        <div className="flex flex-col gap-4">
          <div className="border border-black p-4">
            <Container size="xsmall" data-edit-scope="component-definition" data-component="Container">
              <div className="bg-neutral-neutral-1 p-4 text-center">
                <p className="text-sm">XSmall container (max-w-[32rem])</p>
              </div>
            </Container>
          </div>
          <PropsDisplay props='size="xsmall"' />
          
          <div className="border border-black p-4">
            <Container size="medium" data-edit-scope="component-definition" data-component="Container" data-edit-variant="medium">
              <div className="bg-neutral-neutral-1 p-4 text-center">
                <p className="text-sm">Medium container (max-w-[64rem])</p>
              </div>
            </Container>
          </div>
          <PropsDisplay props='size="medium"' />
          
          <div className="border border-black p-4">
            <Container size="large" data-edit-scope="component-definition" data-component="Container" data-edit-variant="large">
              <div className="bg-neutral-neutral-1 p-4 text-center">
                <p className="text-sm">Large container (max-w-[77rem])</p>
              </div>
            </Container>
          </div>
          <PropsDisplay props='size="large"' />
        </div>
      </div>
    </div>
  );
}

function PagePaddingContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 border border-black bg-[var(--color-white)] rounded flex flex-col gap-4 mb-4">
        <h3>
          PagePadding Usage
        </h3>
        <div className="flex flex-col gap-4">
          <div className="border border-black">
            <PagePadding data-edit-scope="component-definition" data-component="PagePadding">
              <div className="bg-neutral-neutral-1 p-4">
                <p className="text-sm">Content with horizontal padding (px-10)</p>
              </div>
            </PagePadding>
          </div>
          <PropsDisplay props='No props - applies px-10 block relative' />
        </div>
      </div>
    </div>
  );
}

function FooterContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 border border-black bg-[var(--color-white)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Footer Component
        </h3>
        <div className="flex flex-col gap-4">
          <div className="border border-black">
            <Footer data-edit-scope="component-definition" data-component="Footer" />
          </div>
          <PropsDisplay props='No props - shared site footer' />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Export
// ============================================================================

export default function Preview() {
  return (
    <div className="space-y-6">
      <SectionContent />
      <ContainerContent />
      <PagePaddingContent />
      <FooterContent />
    </div>
  );
}
