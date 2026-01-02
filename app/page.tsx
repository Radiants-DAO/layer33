import { MobileNav } from '@/components/MobileNav';
import { menuItems } from '@/components/navConfig';
import { Button } from '@/components/ui/Button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { DecorationDiv } from '@/components/ui/DecorationDiv';
import { DecorationGroup } from '@/components/ui/DecorationGroup';
import { Divider } from '@/components/ui/Divider';
import { Footer } from '@/components/33layout';
import { DashboardsSection } from '@/app/components/DashboardsSection';
import { ValidatorsSection } from '@/app/components/validators';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[var(--color-bg-primary)]">
      <MobileNav menuItems={menuItems} />
      {/* Hero Section - Matching Webflow structure */}
      <div 
        className="relative min-h-[99dvh] pb-12"
        style={{ background: `linear-gradient(-90deg, var(--color-black) 50%, var(--color-white) 50%)` }}
      >
        {/* Page Padding Container */}
        <div className="page-padding">
          {/* Video Container Section - Matching Webflow .hero_number */}
          <div 
            className="flex items-center justify-center min-h-[95dvh] relative"
            style={{ filter: 'contrast(200%) brightness(200%)' }}
          >
            {/* Video Container - Matching Webflow structure */}
            <div className="bb-video-container absolute relative inline-block">
              <div className="bb-video-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <svg 
                  viewBox="0 0 693 306" 
                  xmlns="http://www.w3.org/2000/svg" 
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                >
                  <defs>
                    <clipPath id="bbMask" clipPathUnits="objectBoundingBox" 
                              transform="scale(0.001443, 0.003268)">
                      <path d="M505.887 305.647C477.452 305.647 454.515 304.119 437.074 301.062C419.634 298.006 406.301 292.975 397.076 285.971C387.85 278.967 381.594 269.67 378.309 258.081C375.149 246.364 373.569 231.91 373.569 214.717H409.966C409.966 227.452 410.851 237.704 412.62 245.473C414.516 253.241 418.623 259.227 424.942 263.43C431.261 267.505 440.992 270.307 454.135 271.835C467.279 273.236 485.161 273.936 507.783 273.936H558.587C581.209 273.936 599.091 273.236 612.235 271.835C625.378 270.307 635.109 267.505 641.428 263.43C647.747 259.227 651.791 253.241 653.56 245.473C655.456 237.704 656.404 227.452 656.404 214.717C656.404 203.383 655.519 194.277 653.75 187.4C651.981 180.523 648 175.301 641.807 171.735C635.615 168.17 626.01 165.814 612.993 164.667C599.976 163.394 582.157 162.757 559.535 162.757H503.044V132.001H567.118C587.844 132.001 604.21 131.365 616.216 130.091C628.221 128.817 637.068 126.525 642.755 123.214C648.568 119.775 652.296 114.872 653.939 108.505C655.582 102.01 656.404 93.6044 656.404 83.2888C656.404 71.0629 655.203 61.4478 652.802 54.4434C650.527 47.439 645.914 42.3449 638.964 39.161C632.013 35.9772 621.713 33.9396 608.064 33.0481C594.542 32.1566 576.47 31.7109 553.848 31.7109H512.522C489.9 31.7109 471.765 32.1566 458.116 33.0481C444.594 33.9396 434.357 35.9772 427.406 39.161C420.456 42.3449 415.78 47.439 413.378 54.4434C411.104 61.4478 409.966 71.0629 409.966 83.2888H373.569C373.569 66.6056 375.402 52.8515 379.067 42.0265C382.858 31.2015 389.619 22.7325 399.35 16.6196C409.208 10.5066 423.11 6.24029 441.055 3.82059C459.001 1.27353 482.191 0 510.627 0H555.744C584.179 0 607.369 1.27353 625.315 3.82059C643.26 6.24029 657.099 10.5066 666.83 16.6196C676.687 22.7325 683.449 31.2015 687.114 42.0265C690.905 52.8515 692.801 66.6056 692.801 83.2888C692.801 103.029 689.073 118.12 681.616 128.563C674.286 139.006 664.808 145.31 653.181 147.475C664.934 149.894 674.476 156.58 681.806 167.533C689.136 178.485 692.801 194.213 692.801 214.717C692.801 231.91 691.158 246.364 687.872 258.081C684.712 269.67 678.52 278.967 669.294 285.971C660.069 292.975 646.736 298.006 629.296 301.062C611.855 304.119 588.918 305.647 560.483 305.647H505.887Z"/>
                      <path d="M132.318 305.647C103.883 305.647 80.9457 304.119 63.5055 301.062C46.0653 298.006 32.7324 292.975 23.5068 285.971C14.2812 278.967 8.0255 269.67 4.73967 258.081C1.58022 246.364 0.000488281 231.91 0.000488281 214.717H36.3974C36.3974 227.452 37.2821 237.704 39.0514 245.473C40.947 253.241 45.0543 259.227 51.3732 263.43C57.6921 267.505 67.4233 270.307 80.5666 271.835C93.7099 273.236 111.592 273.936 134.214 273.936H185.018C207.64 273.936 225.522 273.236 238.666 271.835C251.809 270.307 261.54 267.505 267.859 263.43C274.178 259.227 278.222 253.241 279.991 245.473C281.887 237.704 282.835 227.452 282.835 214.717C282.835 203.383 281.95 194.277 280.181 187.4C278.412 180.523 274.431 175.301 268.238 171.735C262.046 168.17 252.441 165.814 239.424 164.667C226.407 163.394 208.588 162.757 185.966 162.757H129.475V132.001H193.549C214.275 132.001 230.641 131.365 242.647 130.091C254.653 128.817 263.499 126.525 269.186 123.214C274.999 119.775 278.728 114.872 280.371 108.505C282.013 102.01 282.835 93.6044 282.835 83.2888C282.835 71.0629 281.634 61.4478 279.233 54.4434C276.958 47.439 272.346 42.3449 265.395 39.161C258.444 35.9772 248.144 33.9396 234.495 33.0481C220.973 32.1566 202.901 31.7109 180.279 31.7109H138.953C116.332 31.7109 98.1964 32.1566 84.5475 33.0481C71.025 33.9396 60.7884 35.9772 53.8376 39.161C46.8868 42.3449 42.2108 47.439 39.8096 54.4434C37.5348 61.4478 36.3974 71.0629 36.3974 83.2888H0.000488281C0.000488281 66.6056 1.83297 52.8515 5.49794 42.0265C9.28929 31.2015 16.0505 22.7325 25.7816 16.6196C35.6391 10.5066 49.5407 6.24029 67.4865 3.82059C85.4322 1.27353 108.623 0 137.058 0H182.175C210.61 0 233.8 1.27353 251.746 3.82059C269.692 6.24029 283.53 10.5066 293.261 16.6196C303.119 22.7325 309.88 31.2015 313.545 42.0265C317.336 52.8515 319.232 66.6056 319.232 83.2888C319.232 103.029 315.504 118.12 308.047 128.563C300.717 139.006 291.239 145.31 279.612 147.475C291.365 149.894 300.907 156.58 308.237 167.533C315.567 178.485 319.232 194.213 319.232 214.717C319.232 231.91 317.589 246.364 314.303 258.081C311.144 269.67 304.951 278.967 295.726 285.971C286.5 292.975 273.167 298.006 255.727 301.062C238.287 304.119 215.349 305.647 186.914 305.647H132.318Z"/>
                    </clipPath>
                  </defs>
                </svg>
                
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  src="https://cdn.midjourney.com/video/09952e9f-cefc-4461-bf0d-db59f6cf67d3/0.mp4"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ clipPath: 'url(#bbMask)', WebkitClipPath: 'url(#bbMask)' }}
                />
              </div>
            </div>
          </div>

          {/* Text Content Section - Matching Webflow container-large > hero_text structure */}
          <div className="w-full max-w-[77rem] mx-auto relative">
            <div className="bg-neutral-neutral-1 text-center flex justify-center items-center relative py-12 px-6 md:py-24 md:px-20">
              {/* Background Image - Matching Webflow .bg_img */}
              <img 
                src="/images/bg.png" 
                alt="" 
                className="absolute inset-0 w-full h-full max-w-none"
                style={{
                  zIndex: 0,
                  opacity: 0.13,
                  mixBlendMode: 'difference',
                  objectFit: 'cover'
                }}
              />
              {/* Container XSmall - Matching Webflow structure */}
              <div className="w-full max-w-[32rem] mx-auto relative z-[1]">
                <h1 className="text-2xl md:text-3xl lg:text-[3.75rem] font-normal leading-none flex text-black" style={{ gap: '0.25rem' }}>
                  Independent validators, Collective strength.
                </h1>
              </div>
              {/* Decoration divs - Matching Webflow .decoration_div */}
              <DecorationDiv orientation="vertical" top="1rem" left="-2.5rem" className="z-[1] hidden md:block" />
              <DecorationDiv orientation="vertical" bottom="2.5rem" right="-2.5rem" className="z-[1] hidden md:block" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Fluff - Matching Webflow structure */}
      <section 
        className="relative py-16 md:py-24 lg:py-32 pr-0 md:pr-[12%] bg-black md:bg-[linear-gradient(90deg,rgba(0,0,0,1)_88%,rgba(255,255,255,0)_88%)]"
      >
        {/* Page Padding Container */}
        <div className="page-padding">
          {/* Container Medium */}
          <div className="w-full max-w-[64rem] mx-auto">
            {/* Quote */}
            <div className="bg-black text-white uppercase text-xl md:text-[2rem] font-light leading-[1.25]">
              <div>
                Concentrated stake means concentrated data access, transaction reordering capability, and MEV extraction at scale. The 33% threshold isn&apos;t arbitrary—it&apos;s the minimum distribution required to prevent institutional control of the network layer.
              </div>
            </div>
          </div>
        </div>

        {/* Grey Square Decoration */}
        <div 
          className="absolute -z-10 aspect-square w-[10rem] md:w-[20rem] bottom-[-2rem] md:bottom-[-4rem] right-[5%]"
          style={{ 
            backgroundImage: `linear-gradient(rgba(200, 200, 200, 0.95), rgba(200, 200, 200, 0.95)), url(/images/bg.png)`,
            backgroundPosition: '0 0, 0 0',
            backgroundSize: 'auto, auto'
          }}
        />

        {/* Decoration Wrap - Smaller (left side) */}
        <DecorationGroup
          orientation="vertical"
          lineCount={3}
          top="-2.5rem"
          left="10%"
          lineGap="1rem"
          className="text-[0.75rem] hidden md:block"
        />

        {/* Decoration Wrap (right side) */}
        <DecorationGroup
          orientation="vertical"
          lineCount={3}
          top="-2.5rem"
          right="20%"
          lineGap="1rem"
          className="hidden md:block"
        />
      </section>

      {/* Section Validators - Live data from Layer33 network */}
      <ValidatorsSection />

      {/* Dashboards Section */}
      <DashboardsSection />

      {/* Section Services - Matching Webflow structure */}
      <section id="services">
        <div className="page-padding">
          <div className="w-full max-w-[77rem] mx-auto">
            <div className="bg-black text-white py-12 px-6 md:py-24 md:px-16 relative">
              <h2 className="text-center">Our services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 md:mt-20">
                {/* RPC Services */}
                <div className="flex flex-col gap-2 justify-between items-stretch p-8 pt-8 rounded-none outline outline-1 outline-transparent hover:rounded-[1px] hover:translate-y-[-0.5rem] hover:outline-neutral-neutral-3 transition-all duration-500 ease-in-out relative overflow-hidden group">
                  {/* Gradient glow that fades in on hover - green, less intense */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 ease-in-out pointer-events-none z-0" />
                  <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <small className="text-green">RPC Services</small>
                    </div>
                    <Divider className="my-4" />
                    <h3>RPC</h3>
                    <p>Layer33 partners with Staking Facilities and Triton to deliver fast, affordable RPC and gRPC services. Our coalition of independent validators carries 18M SOL in combined stake weight and is distributed across the globe, ensuring resilience and performance.<br /><br />If you&apos;re looking for reliable, cost-effective data services that also strengthen Solana&apos;s decentralization, you&apos;re in the right place.</p>
                  </div>
                  <div className="relative z-10">
                    <Button variant="primary" href="#" iconName="rpc-services">
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* SWQoS */}
                <div className="flex flex-col gap-2 justify-between items-stretch p-8 pt-8 rounded-none outline outline-1 outline-transparent hover:rounded-[1px] hover:translate-y-[-0.5rem] hover:outline-neutral-neutral-3 transition-all duration-500 ease-in-out relative overflow-hidden group">
                  {/* Gradient glow that fades in on hover - blue, less intense */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 ease-in-out pointer-events-none z-0" />
                  <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <small className="text-blue">SWQoS</small>
                    </div>
                    <Divider className="my-4" />
                    <h3>SWQoS</h3>
                    <p>Layer33 partners with bloXroute, Astralane, and Triton to provide Stake-Weighted Quality of Service (SWQoS) routing—the most reliable path to consistent Solana transaction landing.<br /><br />Using Yellowstone Shield through Triton, you can allowlist Layer33 validators to guarantee your transactions route through decentralized, high-integrity infrastructure.<br /><br />Both bloXroute and Astralane have fully integrated the Layer33 validator set, meaning any use of their services directly supports our coalition.</p>
                  </div>
                  <div className="relative z-10">
                    <Button variant="primary" href="#" iconName="block-arrows-basic-arrows-right">
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Staking with Layer 33 */}
                <div className="md:col-span-2 flex flex-col gap-2 border border-black bg-purple text-black justify-between items-stretch p-8 pt-8 relative overflow-hidden group transition-all duration-500 ease-in-out">
                  {/* Gradient overlay that fades in on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none z-0" />
                  <div className="relative z-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <small>Staking with Layer 33</small>
                      <div className="flex">
                        <img src="/assets/icons/staking.svg" alt="" className="w-[19px] h-[20px]" />
                      </div>
                    </div>
                    <Divider className="my-4" />
                    <p>Delegate SOL to the Layer33 stake pool and support 25 independent validators committed to network decentralization.</p>
                    <Divider className="my-4" />
                  </div>
                  <Button variant="primary" href="/staking" iconName="staking">
                    Stake now
                  </Button>
                  </div>
                </div>
              </div>
              
              {/* Decoration Divs - Horizontal */}
              <DecorationDiv orientation="horizontal" top="-2rem" right="-5rem" width="10rem" className="hidden md:block" />
              <DecorationDiv orientation="horizontal" bottom="-2rem" right="-5rem" width="10rem" className="hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Section Backstop - Matching Webflow structure */}
      <section className="section_home-backstop">
        <div className="page-padding">
          <div className="w-full max-w-[64rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[6.25rem] place-items-center">
              <div className="relative w-full aspect-square bg-black flex justify-center items-center">
                <img src="/images/bg.png" alt="" className="w-full h-full object-cover" />
                {/* Decoration divs - Matching Webflow .decoration_div.horizontal */}
                <DecorationDiv orientation="horizontal" top="15%" left={0} transform="translateX(-50%)" />
                <DecorationDiv orientation="horizontal" top="25%" left={0} transform="translateX(-50%)" />
                <DecorationDiv orientation="horizontal" top="20%" left={0} transform="translateX(-50%)" />
                <DecorationDiv orientation="horizontal" bottom="15%" left={0} transform="translateX(-50%)" />
                <DecorationDiv orientation="horizontal" bottom="12.5%" left={0} transform="translateX(-50%)" />
                <DecorationDiv orientation="horizontal" bottom="10%" left={0} transform="translateX(-50%)" />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <small>critical mission</small>
                  <div className="uppercase font-semibold font-alfacad">01</div>
                </div>
                <Divider variant="mix-blend" className="my-4" />
                <h2>The Backstop</h2>
                <p>Solana&apos;s security depends on distributed stake.<br /><br />As institutional capital concentrates network control, independent validators become critical infrastructure.<br /><br />Layer 33 ensures decentralization at scale.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ - Matching Webflow structure */}
      <section className="section-faq">
        <div className="page-padding">
          <div className="w-full max-w-[32rem] mx-auto">
            <h2 className="text-center">FAQ</h2>
            {/* FAQ Items */}
            <div className="mt-8">
              <Accordion type="single">
                <AccordionItem value="layer33-what">
                  <AccordionTrigger>
                    What is Layer33?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Layer33 is a collective of independent, value-contributing Solana validators working together to ensure decentralization remains real as the network scales.</p>
                      <p className="mt-4">The long-term objective is to support a healthy, sustainable independent validator class that collectively represents <strong>at least 33% of network stake</strong>.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="layer33-who">
                  <AccordionTrigger>
                    Who is Layer33?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Layer33 is made up of 25 independent validator operators and organizations from across the Solana ecosystem.</p>
                      <p className="mt-4">They are geographically distributed, technically capable, and actively contribute to Solana beyond simply running nodes.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="layer33-support">
                  <AccordionTrigger>
                    How does Layer33 support independent validators?
                  </AccordionTrigger>
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
                  <AccordionTrigger>
                    How is stake distributed?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Stake is distributed across vetted Layer33 validators rather than concentrated in a single operator.</p>
                      <p className="mt-4">This improves decentralization, reduces correlated risk, and ensures voting power and block production remain distributed across many independent entities.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="staking-only">
                  <AccordionTrigger>
                    Is Layer33 only about staking?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>No. Staking is the foundation, but it&apos;s not the full picture.</p>
                      <p className="mt-4">Layer33 also provides transaction landing, RPC and gRPC services, education, tooling, and validator-owned infrastructure that supports builders and strengthens Solana&apos;s core.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stake-concentration">
                  <AccordionTrigger>
                    Why does stake concentration matter?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>In Solana&apos;s consensus model, stake determines influence.</p>
                      <p className="mt-4">When incentives consistently push stake toward fewer operators, control naturally concentrates. That doesn&apos;t mean Solana isn&apos;t decentralized, but it does mean incentive design matters.</p>
                      <p className="mt-4">Diverse incentives lead to diverse operators. Concentrated incentives lead to concentrated power.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="why-33">
                  <AccordionTrigger>
                    Why 33%?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>33% is a critical threshold in Byzantine Fault Tolerant consensus systems.</p>
                      <p className="mt-4">An independent validator class holding at least one-third of stake ensures that no small group of operators can unilaterally stall or steer the network. It&apos;s a defensive line for decentralization.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="layer33-yield">
                  <AccordionTrigger>
                    What is Layer33 yield, and can it be used in DeFi?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-0">
                      <p>Layer33 yield comes from standard Solana staking rewards and can be packaged into liquid staking tokens like <strong>IndieSOL</strong>.</p>
                      <p className="mt-4">IndieSOL is designed to be composable across Solana DeFi, allowing users to earn staking yield while continuing to deploy capital elsewhere.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="support-layer33">
                  <AccordionTrigger>
                    How can teams or users support Layer33?
                  </AccordionTrigger>
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

      {/* Section Mission - Matching Webflow structure */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="page-padding">
          <div className="w-full max-w-[77rem] mx-auto">
            <div className="flex justify-between items-center gap-4">
              <div className="text-xl md:text-[2.5rem] font-medium">Layer33</div>
              <div className="uppercase font-semibold font-alfacad">04</div>
            </div>
            <Divider variant="mix-blend" className="my-4" />
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8">
              <h2 className="max-w-[6ch]">Where purposeful capital goes to work</h2>
              <div className="text-left md:text-right">Distributed stake to validators who build.<br />Performance and contribution over speculation.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA - Matching Webflow structure */}
      <section 
        className="section_cta relative"
        style={{ 
          backgroundImage: `linear-gradient(270deg, var(--color-black) 88%, transparent 88%)`
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
                  transform: 'rotate(180deg)'
                }}
              >
                <a href="#" className="text-white">layer33</a>
              </div>
              {/* Footer decoration text - rotated 90deg */}
              <div 
                className="absolute hidden md:flex justify-between items-center uppercase text-white bg-transparent w-full h-auto"
                style={{
                  inset: '48% -54% auto auto',
                  transform: 'rotate(90deg)'
                }}
              >
                <a href="#" className="text-white">maintaining the 33% threshhold</a>
                <div className="flex items-center">
                  <a href="#" className="uppercase text-white">33<br /></a>
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
