import { MobileNav } from '@/components/MobileNav';
import { menuItems } from '@/components/navConfig';
import { StakingForm } from './components/StakingForm';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { DecorationDiv } from '@/components/ui/DecorationDiv';
import { Divider } from '@/components/ui/Divider';
import { Footer } from '@/components/33layout';

export default function StakingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <MobileNav menuItems={menuItems} />

      {/* Hero Section - Staking Form */}
      <section className="section_staking-hero">
        <div className="page-padding">
          <div className="container-large w-full max-w-[77rem] mx-auto">
            <StakingForm />

            {/* Hero Text Block */}
            <div className="container-small w-full max-w-[64rem] mx-auto mt-8 md:mt-12">
              <div className="hero_text margin bg-neutral-neutral-1 text-center flex justify-center items-center relative">
                {/* Background Image */}
                <img
                  src="/images/bg.png"
                  alt=""
                  className="bg_img absolute inset-0 w-full h-full max-w-none"
                  style={{
                    zIndex: 0,
                    opacity: 0.13,
                    mixBlendMode: 'difference',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
                {/* Container XSmall */}
                <div className="container-xsmall w-full max-w-[32rem] mx-auto relative z-[1]">
                  <h1 className="heading-style-h2 text-2xl md:text-3xl lg:text-[3.75rem] font-normal leading-none text-black">
                    INDEPENDENT VALIDATORS, COLLECTIVE STRENGTH.
                  </h1>
                </div>
                {/* Decoration divs */}
                <DecorationDiv orientation="vertical" top="1rem" left="-2.5rem" className="z-[1] hidden md:block" />
                <DecorationDiv orientation="vertical" bottom="2.5rem" right="-2.5rem" className="z-[1] hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ - Matching Webflow structure */}
      <section className="section-faq">
        <div className="page-padding">
          <div className="container-small w-full max-w-[32rem] mx-auto">
            <h2 className="text-align-center text-center">FAQ</h2>
            {/* FAQ Items */}
            <div className="mt-8">
              <Accordion type="single">
                <AccordionItem value="layer33-what">
                  <AccordionTrigger>What is Layer33?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Layer33 is a collective of independent, value-contributing Solana validators working together to ensure decentralization remains real as the network scales.</p>
                      <p className="mt-4">The long-term objective is to support a healthy, sustainable independent validator class that collectively represents <strong>at least 33% of network stake</strong>.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="layer33-who">
                  <AccordionTrigger>Who is Layer33?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Layer33 is made up of 25 independent validator operators and organizations from across the Solana ecosystem.</p>
                      <p className="mt-4">They are geographically distributed, technically capable, and actively contribute to Solana beyond simply running nodes.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="layer33-support">
                  <AccordionTrigger>How does Layer33 support independent validators?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Layer33 focuses on sustainability, not validator count.</p>
                      <p className="mt-4">We support independent validators by:</p>
                      <ul className="mt-4 list-disc list-inside space-y-2">
                        <li>Improving validator economics through shared infrastructure and services</li>
                        <li>Providing access to tooling, routing, and performance optimizations</li>
                        <li>Creating alternative revenue streams beyond base staking rewards</li>
                        <li>Coordinating incentives so stake doesn&apos;t naturally concentrate with the largest operators</li>
                      </ul>
                      <p className="mt-4">The goal is simple: keep independent validators viable long-term.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stake-distribution">
                  <AccordionTrigger>How is stake distributed?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Stake is distributed across vetted Layer33 validators rather than concentrated in a single operator.</p>
                      <p className="mt-4">This improves decentralization, reduces correlated risk, and ensures voting power and block production remain distributed across many independent entities.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="staking-only">
                  <AccordionTrigger>Is Layer33 only about staking?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>No. Staking is the foundation, but it&apos;s not the full picture.</p>
                      <p className="mt-4">Layer33 also provides transaction landing, RPC and gRPC services, education, tooling, and validator-owned infrastructure that supports builders and strengthens Solana&apos;s core.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stake-concentration">
                  <AccordionTrigger>Why does stake concentration matter?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>In Solana&apos;s consensus model, stake determines influence.</p>
                      <p className="mt-4">When incentives consistently push stake toward fewer operators, control naturally concentrates. That doesn&apos;t mean Solana isn&apos;t decentralized, but it does mean incentive design matters.</p>
                      <p className="mt-4">Diverse incentives lead to diverse operators. Concentrated incentives lead to concentrated power.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="why-33">
                  <AccordionTrigger>Why 33%?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>33% is a critical threshold in Byzantine Fault Tolerant consensus systems.</p>
                      <p className="mt-4">An independent validator class holding at least one-third of stake ensures that no small group of operators can unilaterally stall or steer the network. It&apos;s a defensive line for decentralization.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="layer33-yield">
                  <AccordionTrigger>What is Layer33 yield, and can it be used in DeFi?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Layer33 yield comes from standard Solana staking rewards and can be packaged into liquid staking tokens like <strong>IndieSOL</strong>.</p>
                      <p className="mt-4">IndieSOL is designed to be composable across Solana DeFi, allowing users to earn staking yield while continuing to deploy capital elsewhere.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="support-layer33">
                  <AccordionTrigger>How can teams or users support Layer33?</AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>The simplest way to support Layer33 is by staking with Layer33 validators or holding <strong>IndieSOL</strong>.</p>
                      <p className="mt-4">Builders can also support Layer33 by using validator-owned infrastructure and aligning with decentralization-first tooling and services.</p>
                      <p className="mt-4"><strong>Support by audience:</strong></p>
                      <ul className="mt-4 list-disc list-inside space-y-2">
                        <li><strong>Retail:</strong> Want staking yield plus exposure to ecosystem airdrops? Swap to <strong>IndieSOL</strong>.</li>
                        <li><strong>Whales:</strong> Want a clean, scalable way to support decentralization without managing multiple validator positions? <strong>IndieSOL</strong>.</li>
                        <li><strong>Projects:</strong> Want to reward real network contributors instead of concentrating stake further? Add incentives to <strong>IndieSOL</strong>.</li>
                      </ul>
                      <p className="mt-4">Supporting Layer33 means supporting incentive diversity, independent validator sustainability, and long-term Solana network health.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA - Matching Webflow structure */}
      <section
        className="section_cta relative"
        style={{
          backgroundImage: 'linear-gradient(270deg, black 88%, transparent 88%)',
        }}
      >
        <div className="page-padding">
          <div className="w-full max-w-[32rem] mx-auto">
            <div className="relative">
              <img src="/images/Kemosabe-Chain-Organize.png" alt="" className="w-full" loading="lazy" />
              {/* Footer decoration - vertical blue line on left */}
              <div className="absolute top-0 bottom-0 bg-blue w-px h-full -left-4 md:-left-8" />
              {/* Footer decoration text _2 - rotated 180deg */}
              <div
                className="absolute hidden md:flex justify-between items-center uppercase text-white bg-transparent w-full h-auto"
                style={{
                  inset: 'auto 0% -2rem 0',
                  transform: 'rotate(180deg)',
                }}
              >
                <a href="#" className="text-white">layer33</a>
              </div>
              {/* Footer decoration text - rotated 90deg */}
              <div
                className="absolute hidden md:flex justify-between items-center uppercase text-white bg-transparent w-full h-auto"
                style={{
                  inset: '48% -54% auto auto',
                  transform: 'rotate(90deg)',
                }}
              >
                <a href="#" className="text-white">maintaining the 33% threshhold</a>
                <div className="flex items-center">
                  <a href="#" className="uppercase text-white">
                    33<br />
                  </a>
                  <div className="ml-2 border border-purple w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Footer */}
      <Footer />
    </div>
  );
}
