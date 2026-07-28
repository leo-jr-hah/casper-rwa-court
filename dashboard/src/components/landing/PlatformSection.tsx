import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AssessGlyph: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <path d="M8 36 L16 24 L24 30 L32 14 L40 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="36" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16" cy="24" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="24" cy="30" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="32" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="40" cy="20" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const BorrowGlyph: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <rect x="12" y="12" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 20 L36 20" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M20 12 L20 36" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="28" cy="28" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M31 25 L34 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const InsureGlyph: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <path d="M24 6 L40 14 L40 24 C40 34 32 42 24 42 C16 42 8 34 8 24 L8 14 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M16 24 L22 30 L32 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PredictGlyph: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M24 4 L24 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M24 36 L24 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 24 L12 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M36 24 L44 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PRODUCTS = [
  {
    name: 'Assess',
    glyph: AssessGlyph,
    tagline: 'Multi-agent asset valuation',
    description: 'Two independent AI analysts value the same asset using different methodologies. A three-juror panel deliberates and votes. Every step is HMAC-signed and chained.',
    route: '/assess',
    width: '28%',
  },
  {
    name: 'Borrow',
    glyph: BorrowGlyph,
    tagline: 'Collateralized lending',
    description: 'Use an assessment as collateral. AI determines LTV ratio based on agent confidence. Real CSPR disbursement. Autonomous keeper monitors health.',
    route: '/borrow',
    width: '24%',
  },
  {
    name: 'Insure',
    glyph: InsureGlyph,
    tagline: 'AI-underwritten insurance',
    description: 'AI generates risk score, premium, and coverage terms from valuation data. Claims trigger automatic revaluation. If value has dropped, the system pays out.',
    route: '/insure',
    width: '24%',
  },
  {
    name: 'Predict',
    glyph: PredictGlyph,
    tagline: 'Event-driven oracle',
    description: 'Ask any yes/no question about future outcomes. Independent AI analysts research and forecast. Oracle resolves on-chain. Disputable through jury.',
    route: '/confidence',
    width: '24%',
  },
];

export const PlatformSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const tl = gsap.timeline({ paused: true });

    const cards = cardRefs.current.filter(Boolean);
    tl.from(cards, {
      y: 80,
      opacity: 0,
      rotation: (i: number) => (i % 2 === 0 ? -1.5 : 1.5),
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.debug('[PlatformSection] IntersectionObserver fired, isIntersecting:', entry.isIntersecting);
        if (entry.isIntersecting) {
          console.debug('[PlatformSection] Playing timeline');
          tl.play();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="platform" className="lp-section">
      <div className="lp-section__inner">
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'rgba(12, 45, 72, 0.35)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '32px'
        }}>02 - THE PLATFORM</span>

        <h2 className="lp-headline">
          Four products. One analytical engine.
        </h2>

        <p className="lp-subheadline">
          Every product runs on the same multi-agent valuation and deliberation
          infrastructure. The process is identical across all four: agents analyze,
          a jury deliberates, the verdict is recorded on Casper.
        </p>

        <div className="platform-grid">
          {PRODUCTS.map((product, i) => (
            <Link
              key={product.name}
              to={product.route}
              ref={(el) => { cardRefs.current[i] = el as unknown as HTMLDivElement; }}
              className="platform-card"
            >
              <div className="platform-card__bg-glow" />
              {React.createElement(product.glyph, { className: "platform-card__glyph" })}
              <div className="platform-card__content">
                <span className="platform-card__tagline">PRODUCT: {product.name}</span>
                <span className="platform-card__name">{product.tagline}</span>
                <p className="platform-card__description">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
