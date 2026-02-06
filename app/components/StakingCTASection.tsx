import { DecorationGroup } from '@/components/ui/DecorationGroup';
import { Divider } from '@/components/ui/Divider';

export function StakingCTASection() {
  return (
    <section
      className="relative py-16 md:py-24 lg:py-32"
      style={{ background: `linear-gradient(-90deg, var(--color-black) 50%, var(--color-white) 50%)` }}
    >
      <div className="page-padding">
        <div className="w-full max-w-[64rem] mx-auto">
          <div className="relative bg-black text-white py-12 px-6 md:py-20 md:px-16">
            {/* Background texture */}
            <img
              src="/images/bg.png"
              alt=""
              className="absolute inset-0 w-full h-full max-w-none"
              style={{
                zIndex: 0,
                opacity: 0.06,
                mixBlendMode: 'screen',
                objectFit: 'cover'
              }}
            />

            <div className="relative z-[1]">
              {/* Section label */}
              <div className="flex justify-between items-center">
                <small className="uppercase opacity-70">liquid staking</small>
                <div className="uppercase font-semibold font-alfacad opacity-70">indieSOL</div>
              </div>
              <Divider variant="mix-blend" className="my-4 opacity-30" />

              {/* Main heading */}
              <h2 className="text-2xl md:text-[2.75rem] lg:text-[3.5rem] font-normal leading-[1.1] mt-8 mb-6">
                Support independent validators.{' '}
                <span className="text-[var(--color-green)]">Stake with Layer 33.</span>
              </h2>

              {/* Subheading */}
              <p className="text-base md:text-xl uppercase opacity-70 mb-10 max-w-[40rem]">
                Check Rewards to boost your APY up to ~112%
              </p>

              {/* CTA Button */}
              <a
                href="/staking"
                className="
                  inline-flex items-center
                  font-alfacad uppercase font-medium
                  text-base md:text-lg
                  bg-[var(--color-green)] text-black
                  border border-black
                  px-8 py-3
                  hover:shadow-[0_3px_0_0_var(--color-green)] hover:-translate-y-0.5
                  active:translate-y-0.5 active:shadow-none
                  transition-all duration-300
                "
              >
                Start Staking
              </a>
            </div>

            {/* Green accent line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-green)]" />
          </div>
        </div>
      </div>

      <DecorationGroup
        orientation="vertical"
        lineCount={3}
        bottom="-1rem"
        right="15%"
        lineGap="1rem"
        className="hidden md:block"
      />
    </section>
  );
}
