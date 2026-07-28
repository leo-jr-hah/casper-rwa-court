import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PIPELINE_STEPS = [
  { label: 'Asset Submitted', detail: 'x402 payment + wallet signature' },
  { label: 'Agents Analyze', detail: 'Two independent valuations' },
  { label: 'Jury Deliberates', detail: 'HMAC-signed receipt chain' },
  { label: 'Verdict Recorded', detail: 'Consensus stored on-chain' },
  { label: 'Receipt Anchored', detail: 'Hash commitment anchored to Casper' },
];

const TechPipeline: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepWidth = 100 / PIPELINE_STEPS.length;

  useGSAP(() => {
    const tlSvg = gsap.timeline({ paused: true });
    const path = svgRef.current?.querySelector('.pipeline-path');
    if (path) {
      const length = 900;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      tlSvg.to(path, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' });
    }
    const tlSteps = gsap.timeline({ paused: true });
    tlSteps.from(stepRefs.current.filter(Boolean), { y: 20, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { tlSvg.play(); setTimeout(() => tlSteps.play(), 200); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (svgRef.current) observer.observe(svgRef.current);
  });

  return (
    <div className="pipeline-wrap">
      <svg ref={svgRef} className="pipeline-svg" viewBox="0 0 1000 80" preserveAspectRatio="none">
        <path className="pipeline-path" d="M 50 40 L 950 40" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2" strokeLinecap="round" />
        {PIPELINE_STEPS.map((_, i) => {
          const x = 50 + (i * (900 / (PIPELINE_STEPS.length - 1)));
          return <circle key={i} cx={x} cy="40" r="6" fill="var(--navy-950)" stroke="var(--accent)" strokeWidth="2" />;
        })}
      </svg>
      <div className="pipeline-steps" style={{ width: '100%' }}>
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.label} ref={(el) => { stepRefs.current[i] = el; }} className="pipeline-step" style={{ width: `${stepWidth}%` }}>
            <span className="pipeline-step-label">{step.label}</span>
            <span className="pipeline-step-detail">{step.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PILLARS = [
  {
    num: '01',
    title: 'Multi-Agent Deliberation',
    body: 'Independent AI agents - each with a distinct analytical philosophy - analyze the same asset in parallel. A three-juror panel deliberates and votes. No single agent controls the outcome.',
    highlight: null,
  },
  {
    num: '02',
    title: 'On-Chain Audit Trail',
    body: 'Every deliberation step produces an HMAC-SHA256 signed receipt. Each receipt references the previous, forming a tamper-evident linked list. The chain is verified end-to-end using timing-safe comparison.',
    highlight: 'timing-safe comparison',
  },
  {
    num: '03',
    title: 'x402 Micropayments',
    body: 'Every API call is gated by on-chain payment verification. Users pay per action in CSPR - no accounts, no subscriptions, no API keys. Deploy hashes are verified against CSPR.cloud before execution.',
    highlight: null,
  },
  {
    num: '04',
    title: 'Smart Contracts',
    body: 'Three deployed Odra contracts on Casper: VotingContract (jury voting), ReputationRegistry (agent trust tiers), VerdictOracle (verdict storage and dispute resolution). Rust/WASM. Live on testnet.',
    highlight: 'Rust/WASM',
  },
];

const DETAILS = [
  { label: 'LLM Pipeline', value: 'Groq Llama 3.3 70B -> deterministic heuristic fallback. Every fallback flagged in UI.' },
  { label: 'Data Sources', value: 'RentCast, Met Museum API, CoinGecko, FRED / Federal Reserve' },
  { label: 'Trust Framework', value: 'Five-dimension scoring. Bronze -> Silver -> Gold -> Platinum tiers.' },
  { label: 'Persistence', value: 'Supabase PostgreSQL (production). Dual-write local JSON (dev). Schema-versioned.' },
];

export const TechnologySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Pillars: each enters from alternating directions
    pillarRefs.current.filter(Boolean).forEach((pillar, i) => {
      if (!pillar) return;
      const tl = gsap.timeline({ paused: true });

      tl.from(pillar, {
        y: 40,
        opacity: 0,
        x: i % 2 === 0 ? -20 : 20,
        duration: 0.7,
        ease: 'power2.out',
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            tl.play();
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(pillar);
      
      // We can't return multiple cleanup functions from a loop easily,
      // but useGSAP cleans up animations automatically. The observer might leak slightly
      // if unmounted before triggering, so it's best practice to store them.
    });

    // Details block: fade in as a unit
    const tlDetails = gsap.timeline({
      scrollTrigger: {
        trigger: detailsRef.current,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
    tlDetails.from(detailsRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="technology" className="lp-section">
      <div className="lp-section__inner">
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'var(--accent-dim)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '32px'
        }}>03 - THE TECHNOLOGY</span>
        
        <h2 className="lp-headline">Built for irreversible truths.</h2>
        <p className="lp-subheadline">
          Traditional valuation relies on subjective proxies. Verdicto uses a 
          multi-layered cryptographic pipeline to ensure every state change is 
          attested, verified, and permanent.
        </p>

        <div className="technology-pipeline-wrap">
          <TechPipeline />
        </div>

        <div className="tech-pillars-grid">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.num}
              ref={(el) => { pillarRefs.current[i] = el; }}
              className="tech-pillar"
            >
              <span className="tech-pillar__num">{pillar.num}</span>
              <h3 className="tech-pillar__name">{pillar.title}</h3>
              <p className="tech-pillar__description">
                {pillar.highlight ? (
                  <>
                    {pillar.body.split(pillar.highlight)[0]}
                    <span className="tech-pillar__highlight" style={{ color: 'var(--accent)' }}>{pillar.highlight}</span>
                    {pillar.body.split(pillar.highlight)[1]}
                  </>
                ) : pillar.body}
              </p>
            </div>
          ))}
        </div>

        <div ref={detailsRef} className="technology-details">
          <span className="technology-details-label">System Details</span>
          <div className="technology-details-grid">
            {DETAILS.map((d) => (
              <div key={d.label} className="technology-detail-item">
                <span className="technology-detail-label">{d.label}</span>
                <span className="technology-detail-value">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
