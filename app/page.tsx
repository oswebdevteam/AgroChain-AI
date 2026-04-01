const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
  { label: "Team", href: "#team" },
];

const problemCards = [
  {
    title: "No transaction history",
    copy: "Farmers move real value daily, but their trade activity is rarely captured as verifiable financial data.",
  },
  {
    title: "No credit access",
    copy: "Without trusted records, lenders cannot assess behavior, risk, or readiness for financing.",
  },
  {
    title: "No formal trust layer",
    copy: "Cross-border buyers and sellers still rely on fragmented channels that increase fraud and delivery disputes.",
  },
];

const featureTags = [
  "Safe Digital Payments",
  "Smart Escrow",
  "Blockchain Transparency",
  "AI Credit Scoring",
];

const phases = [
  {
    number: "01",
    title: "Escrow & Payments",
    bullets: [
      "Buyers initiate produce orders with secure payment rails.",
      "Funds are held in escrow until delivery is confirmed.",
      "Settlement is released automatically once trade conditions are met.",
    ],
  },
  {
    number: "02",
    title: "Blockchain Trust",
    bullets: [
      "Every completed trade generates an immutable transaction record.",
      "Escrow state and delivery confirmation become auditable references.",
      "Trade history is transparent without adding operational friction.",
    ],
  },
  {
    number: "03",
    title: "AI Financial Identity",
    bullets: [
      "The platform scores credit readiness from real trading behavior.",
      "Reliability signals help quantify trust and financing potential.",
      "Farmers build financial identity from activity, not paperwork.",
    ],
  },
  {
    number: "04",
    title: "Cross-Border Intelligence",
    bullets: [
      "Trade corridor analytics reveal settlement patterns and bottlenecks.",
      "Currency and FX visibility improve confidence in cross-border flows.",
      "Structured data supports regional scale across agricultural markets.",
    ],
  },
];

const impactCards = [
  {
    title: "Farmers",
    copy: "Gain protected payments, verified transaction history, and stronger pathways to credit access.",
  },
  {
    title: "Buyers",
    copy: "Trade with greater confidence through escrow-backed settlement and transparent delivery records.",
  },
  {
    title: "Financial Institutions",
    copy: "Use alternative transaction data to reduce uncertainty and assess agricultural trade more accurately.",
  },
  {
    title: "Ecosystem",
    copy: "Strengthen supply chains, reduce informal trade risk, and expand financial inclusion across Africa.",
  },
];

const revenueStreams = [
  "Transaction Fees",
  "Escrow Charges",
  "Credit Commission",
  "Analytics Subscription",
  "Cross-Border Trade Insights",
];

const socials = [
  { label: "X", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SimpleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 12h16M12 4v16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

import { LandingNav } from '@/components/layout/LandingNav';

export default function Home() {
  return (
    <main className="bg-(--color-forest) text-(--color-cream)">
      <LandingNav />

      <section className="hero-shell section-reveal relative isolate overflow-hidden">
        <div className="noise-layer pointer-events-none absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(250,250,245,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,245,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(240,192,64,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(46,204,113,0.22),transparent_42%)]" />

        <div className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col items-center justify-center px-6 py-16 text-center lg:px-10 lg:py-20">
          <div className="section-reveal flex w-full max-w-6xl flex-col items-center gap-8">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-(--color-gold)/45 bg-(--color-gold)/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-(--color-gold)">
              <span className="live-dot h-2.5 w-2.5 rounded-full bg-(--color-mint)" />
              Farmers Point
            </div>

            <div className="space-y-6">
              <p className="mx-auto max-w-xl text-sm uppercase tracking-[0.32em] text-white/62">
                Building Trust, Intelligence, and Financial Identity for Africa&apos;s Agricultural Trade.
              </p>
              <div className="hero-editorial relative mx-auto mt-2 w-full max-w-6xl">
                <div className="hero-collage-card absolute left-[1%] top-[60%] z-10 hidden w-52 -rotate-[5deg] rounded-[1.6rem] border border-white/18 bg-[linear-gradient(135deg,rgba(250,250,245,0.96),rgba(233,245,226,0.92))] p-4 text-left shadow-[0_30px_90px_rgba(0,0,0,0.26)] lg:block">
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-(--color-forest)/55">Escrow Lock</p>
                  <div className="mt-4 rounded-[1.2rem] bg-[linear-gradient(135deg,var(--color-mint),#86efac)] p-4 text-(--color-ink)">
                    <p className="text-2xl font-display uppercase tracking-[-0.05em]">Protected</p>
                    <p className="mt-2 text-sm leading-5 text-(--color-ink)/74">Payment secured until delivery confirmation.</p>
                  </div>
                </div>

                {/* <div className="hero-collage-icon absolute left-[7%] top-[58%] z-20 hidden h-28 w-28 -rotate-[16deg] items-center justify-center rounded-[1.6rem] border border-(--color-gold)/32 bg-(--color-gold) text-(--color-forest) shadow-[0_20px_60px_rgba(0,0,0,0.24)] lg:flex">
                  <span className="font-display text-4xl">$</span>
                </div> */}

                <div className="hero-collage-icon absolute right-[1%] top-[50%] z-20 hidden h-34 w-34 rotate-[14deg] items-center justify-center rounded-full border-[6px] border-[#6c1d48] bg-[#e070cf] text-[#4f1239] shadow-[0_20px_60px_rgba(0,0,0,0.24)] lg:flex">
                  <span className="font-display text-5xl">☺</span>
                </div>

                <div className="hero-collage-card absolute right-[1%] top-[44%] z-10 hidden w-56 rotate-[4deg] rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-4 text-left backdrop-blur-sm shadow-[0_30px_90px_rgba(0,0,0,0.26)] lg:block">
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/54">AI Identity</p>
                  <p className="mt-4 font-display text-5xl uppercase tracking-[-0.05em] text-(--color-mint)">82</p>
                  <p className="mt-2 text-sm leading-5 text-white/70">Credit readiness built from clean settlements and verified trade behavior.</p>
                </div>

                <h1 className="font-display relative z-0 mx-auto max-w-6xl text-[4.25rem] uppercase leading-[0.86] tracking-[-0.08em] text-(--color-mint) sm:text-[5.6rem] lg:text-[8rem] xl:text-[10rem]">
                  Turn Trade
                  <br />
                  Into Trust
                </h1>
              </div>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-white/76">
                AgroChain AI transforms agricultural trade into a secure financial infrastructure layer with payments,
                escrow, blockchain-backed transparency, and AI-powered financial identity.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-(--color-mint) px-7 py-4 text-sm font-semibold text-(--color-ink) transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(46,204,113,0.28)]"
              >
                Explore the Platform
                <ArrowUpRight />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/22 px-7 py-4 text-sm font-semibold text-(--color-cream) transition duration-300 hover:-translate-y-1 hover:border-(--color-gold) hover:text-(--color-gold)"
              >
                Watch Demo
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-reveal border-t border-white/8 bg-(--color-ink) px-6 py-24 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
          <div className="max-w-4xl">
            <p className="font-display text-4xl uppercase leading-tight tracking-[-0.04em] text-(--color-gold) sm:text-5xl lg:text-6xl">
              Millions of farmers move real value every day, yet remain financially invisible.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {problemCards.map((card) => (
              <article
                key={card.title}
                className="lift-card rounded-[1.75rem] border border-(--color-gold)/35 bg-(--color-forest) p-6"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-gold)/12 text-(--color-gold)">
                  <SimpleIcon />
                </div>
                <h2 className="font-display text-2xl uppercase tracking-[-0.03em] text-(--color-cream)">
                  {card.title}
                </h2>
                <p className="mt-4 max-w-sm text-base leading-7 text-white/70">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section-reveal bg-(--color-cream) px-6 py-24 text-(--color-forest) lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-gold-deep)]">The Solution</p>
            <h2 className="font-display text-5xl uppercase leading-[0.96] tracking-[-0.05em] sm:text-6xl">
              A financial infrastructure layer for agricultural trade.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-(--color-forest)/74">
              AgroChain AI does not stop at discovery or logistics. It turns each transaction into trusted,
              trackable, and credit-useful financial data that can power inclusion at scale.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureTags.map((feature) => (
              <div
                key={feature}
                className="rounded-[1.5rem] border border-(--color-forest)/10 bg-white px-5 py-6 shadow-[0_18px_50px_rgba(13,59,30,0.08)]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-mint)/14 text-(--color-forest)">
                    <SimpleIcon />
                  </span>
                  <span className="text-lg font-semibold">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-reveal overflow-hidden bg-(--color-forest) px-6 py-24 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-(--color-gold)">Phased Rollout</p>
              <h2 className="font-display mt-4 text-5xl uppercase leading-[0.96] tracking-[-0.05em] text-(--color-cream) sm:text-6xl">
                Secure trade infrastructure that grows into financial intelligence.
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-white/66">
              Each phase compounds value: first trust, then transparency, then financial identity, then regional trade intelligence.
            </p>
          </div>

          <div className="flex snap-x gap-5 overflow-x-auto pb-4 hide-scrollbar">
            {phases.map((phase) => (
              <article
                key={phase.number}
                className="lift-card min-w-[19rem] snap-start rounded-[1.75rem] border border-white/10 bg-(--color-ink)/72 p-6 sm:min-w-[22rem] lg:min-w-[24rem]"
              >
                <p className="text-sm font-semibold tracking-[0.3em] text-(--color-gold)">{phase.number}</p>
                <h3 className="mt-4 font-display text-3xl uppercase tracking-[-0.04em] text-(--color-cream)">
                  {phase.title}
                </h3>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-white/72">
                  {phase.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 flex-none rounded-full bg-(--color-mint)" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="section-reveal bg-(--color-cream) px-6 py-24 text-(--color-forest) lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-gold-deep)]">Impact</p>
              <h2 className="font-display mt-4 text-5xl uppercase leading-[0.96] tracking-[-0.05em] sm:text-6xl">
                Financial identity for every stakeholder in the value chain.
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-(--color-forest)/74">
              The platform creates trust for farmers, buyers, lenders, and the wider ecosystem without relying on legacy paperwork.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {impactCards.map((card, index) => (
              <article
                key={card.title}
                className={`rounded-[1.75rem] p-8 ${
                  index % 2 === 0
                    ? "bg-(--color-forest) text-(--color-cream)"
                    : "border border-(--color-forest)/10 bg-white text-(--color-forest)"
                }`}
              >
                <p
                  className={`text-sm uppercase tracking-[0.3em] ${
                    index % 2 === 0 ? "text-(--color-gold)" : "text-[var(--color-gold-deep)]"
                  }`}
                >
                  Stakeholder
                </p>
                <h3 className="mt-5 font-display text-4xl uppercase tracking-[-0.04em]">{card.title}</h3>
                <p className={`mt-5 max-w-md text-base leading-7 ${index % 2 === 0 ? "text-white/74" : "text-(--color-forest)/74"}`}>
                  {card.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-reveal border-y border-white/8 bg-(--color-ink) px-6 py-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-5xl uppercase tracking-[-0.05em] text-(--color-cream) sm:text-6xl">
              Built to scale.
            </h2>
            <p className="max-w-lg text-base leading-7 text-white/66">
              Revenue grows with transaction volume, escrow usage, financing enablement, and premium market intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {revenueStreams.map((stream) => (
              <div
                key={stream}
                className="rounded-full border border-(--color-gold)/45 px-5 py-3 text-sm uppercase tracking-[0.16em] text-(--color-gold)"
              >
                {stream}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/8 bg-(--color-forest) py-8">
        <div className="marquee-track flex min-w-max items-center gap-10 whitespace-nowrap font-display text-4xl uppercase tracking-[-0.05em] text-(--color-mint) sm:text-5xl lg:text-6xl">
          <span>Turn agricultural trade into trusted financial infrastructure</span>
          <span className="text-(--color-gold)">✦</span>
          <span>Turn agricultural trade into trusted financial infrastructure</span>
          <span className="text-(--color-gold)">✦</span>
        </div>
      </section>

      <footer id="team" className="section-reveal bg-(--color-ink) px-6 py-16 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_0.55fr_0.95fr]">
          <div className="space-y-5">
            <a href="#" className="font-display text-2xl uppercase tracking-[0.14em] text-(--color-mint)">
              AgroChain AI
            </a>
            <p className="max-w-md text-base leading-7 text-white/66">
              Building trust, intelligence, and financial identity for Africa&apos;s agricultural trade.
            </p>
            <div className="flex gap-3">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-4 text-sm text-white/74 transition hover:border-(--color-gold) hover:text-(--color-gold)"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.26em] text-white/42">Navigate</p>
            <div className="flex flex-col gap-3 text-base text-white/72">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="transition hover:text-(--color-cream)">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div id="waitlist" className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-(--color-gold)">Join the waitlist</p>
            <h3 className="mt-4 font-display text-3xl uppercase tracking-[-0.04em] text-(--color-cream)">
              Get platform updates before launch.
            </h3>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-13 w-full rounded-full border border-white/10 bg-(--color-forest) px-5 text-sm text-(--color-cream) outline-none placeholder:text-white/34 focus:border-(--color-mint)"
              />
              <button
                type="submit"
                className="inline-flex h-13 items-center justify-center rounded-full bg-(--color-mint) px-6 text-sm font-semibold text-(--color-ink) transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(46,204,113,0.24)]"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/48 md:flex-row md:items-center md:justify-between">
          <p>Built with love by Team OSWEB</p>
          <p>Powered by Interswitch</p>
        </div>
      </footer>
    </main>
  );
}
