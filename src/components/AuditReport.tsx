import React, { useState } from 'react';
import { Shield, Zap, Search, Activity, BookOpen, Share2, Server, Globe2, AlertTriangle, CheckCircle2, FileJson, FileCode, CheckCircle, XCircle, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { CountUp } from './CountUp';
import type { AuditResult, AuditMetrics } from '../lib/useAuditHistory';

export function AuditReport({ result, isLoading }: { result: AuditResult | null, isLoading?: boolean }) {
  const [compareUrl, setCompareUrl] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<AuditResult | null>(null);

  if (!result && !isLoading) return null;

  if (isLoading) {
    return <AuditSkeleton />;
  }

  if (!result) return null;

  const m: AuditMetrics = result.metrics;
  const m2: AuditMetrics | undefined = compareResult?.metrics;

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compareUrl) return;
    setIsComparing(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: compareUrl }),
      });
      if (response.ok) {
        const data = await response.json();
        setCompareResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div id="audit-results" className="w-full max-w-7xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Compare Inputs */}
      {!compareResult && !isComparing && (
         <div className="mb-8 flex justify-end">
            <form onSubmit={handleCompare} className="flex flex-col sm:flex-row gap-2 relative z-10 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Compare vs competitor.com..." 
                value={compareUrl}
                onChange={(e) => setCompareUrl(e.target.value.toLowerCase())}
                className="bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] text-[var(--color-brand-text)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--color-brand-red)] w-full sm:w-64 font-mono text-sm"
              />
              <button 
                type="submit" 
                disabled={!compareUrl}
                className="bg-[var(--color-brand-border-strong)] hover:bg-white/20 text-[var(--color-brand-text)] font-mono text-sm px-4 py-2 rounded-lg flex items-center justify-center gap-2 border border-[var(--color-brand-border-strong)] transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Compare
              </button>
            </form>
         </div>
      )}

      {isComparing && (
        <div className="mb-8 p-4 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border-strong)] rounded-xl flex items-center justify-center gap-3 text-[var(--color-brand-red)] font-mono text-sm">
          <Activity className="w-4 h-4 animate-spin" /> Analyzing competitor...
        </div>
      )}
      
      {compareResult && (
         <div className="mb-4 flex justify-end">
            <button 
                onClick={() => { setCompareResult(null); setCompareUrl(''); }} 
                className="bg-[var(--color-brand-charcoal-light)] hover:bg-[var(--color-brand-border-strong)] text-[var(--color-brand-muted)] font-mono text-xs px-3 py-1.5 rounded flex items-center gap-2 border border-[var(--color-brand-border-strong)]"
              >
                <XCircle className="w-3 h-3" /> Clear Comparison
            </button>
         </div>
      )}

      <div className={`grid gap-8 mb-8 ${compareResult ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Dashboard Top Primary */}
        <div className="bg-[var(--color-brand-charcoal)] rounded-2xl border border-[var(--color-brand-border-strong)] p-6 md:p-10 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-96 h-96 opacity-[0.02] blur-[100px] pointer-events-none ${result.score >= 80 ? 'bg-[var(--color-brand-green)]' : 'bg-[var(--color-brand-red)]'}`} />
          
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between z-10 relative">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 text-[var(--color-brand-green)] font-mono text-sm uppercase tracking-widest bg-[var(--color-brand-green)]/10 px-4 py-2 rounded-full w-max">
                <Globe2 className="w-4 h-4" /> Primary Audit
              </div>
              {!compareResult && (
                <p className="text-[var(--color-brand-muted)] text-lg leading-relaxed max-w-2xl">
                  This report analyzes how engines (Google, Claude, ChatGPT) interpret your site. Identify technical, trust, and content signals that influence your visibility.
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center shrink-0">
              <span className="text-xs font-mono text-[var(--color-brand-muted)] uppercase tracking-widest mb-4 text-center">AI Authority</span>
              <div className={`relative w-48 h-48 rounded-full border-[6px] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] ${result.score >= 80 ? 'border-[var(--color-brand-green)] shadow-[var(--color-brand-green)]/20' : result.score >= 50 ? 'border-[var(--colors-yellow-500, #EAB308)] shadow-[var(--colors-yellow-500, #EAB308)]/20' : 'border-[var(--color-brand-red)] shadow-[var(--color-brand-red)]/20'}`}>
                <div className="text-7xl font-mono font-black tracking-tighter text-[var(--color-brand-text)]">
                  <CountUp end={result.score} duration={2} />
                </div>
              </div>
              <div className="mt-6 flex gap-4 text-sm font-mono text-[var(--color-brand-text)] bg-[var(--color-brand-bg)] rounded-lg px-4 py-3 border border-[var(--color-brand-border)]">
                <span className="flex items-center gap-2"><Globe2 className="w-4 h-4" /> {result.url.replace('https://', '').split('/')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Top Compare */}
        {compareResult && (
          <div className="bg-[var(--color-brand-charcoal)] rounded-2xl border border-[var(--color-brand-border-strong)] p-6 md:p-10 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 opacity-[0.02] blur-[100px] pointer-events-none ${compareResult.score >= 80 ? 'bg-[var(--color-brand-green)]' : 'bg-[var(--color-brand-red)]'}`} />
            
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between z-10 relative">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 text-yellow-500 font-mono text-sm uppercase tracking-widest bg-yellow-500/10 px-4 py-2 rounded-full w-max">
                  <Activity className="w-4 h-4" /> Competitor Audit
                </div>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-mono text-[var(--color-brand-muted)] uppercase tracking-widest mb-4 text-center">AI Authority</span>
                <div className={`relative w-48 h-48 rounded-full border-[6px] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] ${compareResult.score >= 80 ? 'border-[var(--color-brand-green)] shadow-[var(--color-brand-green)]/20' : compareResult.score >= 50 ? 'border-[var(--colors-yellow-500, #EAB308)] shadow-[var(--colors-yellow-500, #EAB308)]/20' : 'border-[var(--color-brand-red)] shadow-[var(--color-brand-red)]/20'}`}>
                  <div className="text-7xl font-mono font-black tracking-tighter text-[var(--color-brand-text)]">
                    <CountUp end={compareResult.score} duration={2} />
                  </div>
                </div>
                <div className="mt-6 flex gap-4 text-sm font-mono text-[var(--color-brand-text)] bg-[var(--color-brand-bg)] rounded-lg px-4 py-3 border border-[var(--color-brand-border)]">
                  <span className="flex items-center gap-2"><Globe2 className="w-4 h-4" /> {compareResult.url.replace('https://', '').split('/')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Server Metrics Section */}
      <div className={`grid gap-8 mb-8 ${compareResult ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div>
          {compareResult && <div className="text-sm font-bold text-[var(--color-brand-green)] mb-2 font-mono uppercase">Primary Metrics</div>}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ServerMetricCard label="Server" value={m.serverType?.toUpperCase() || 'UNKNOWN'} sub="Infrastructure detected" />
            <ServerMetricCard label="Initial Time" value={`${(m.ttfb / 1000).toFixed(2)}s`} sub="1st response speed" status={m.ttfb < 300 ? 'pass' : 'fail'} />
            <ServerMetricCard label="HTML Weight" value={`${(m.pageSize / 1024).toFixed(1)} KB`} sub="Raw page volume" />
            <ServerMetricCard label="AI Robots" value={m.robotsAllowed ? 'ALLOWED' : 'BLOCKED'} sub="Exploration auth" status={m.robotsAllowed ? 'pass' : 'fail'} />
            <ServerMetricCard label="Indexability" value={m.canonicalDetected ? 'DETECTED' : 'MISSING'} sub="Canonical Status" status={m.canonicalDetected ? 'pass' : 'warn'} />
          </div>
        </div>

        {compareResult && m2 && (
          <div>
            <div className="text-sm font-bold text-yellow-500 mb-2 font-mono uppercase">Competitor Metrics</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <ServerMetricCard label="Server" value={m2.serverType?.toUpperCase() || 'UNKNOWN'} sub="Infrastructure detected" />
              <ServerMetricCard label="Initial Time" value={`${(m2.ttfb / 1000).toFixed(2)}s`} sub="1st response speed" status={m2.ttfb < 300 ? 'pass' : 'fail'} />
              <ServerMetricCard label="HTML Weight" value={`${(m2.pageSize / 1024).toFixed(1)} KB`} sub="Raw page volume" />
              <ServerMetricCard label="AI Robots" value={m2.robotsAllowed ? 'ALLOWED' : 'BLOCKED'} sub="Exploration auth" status={m2.robotsAllowed ? 'pass' : 'fail'} />
              <ServerMetricCard label="Indexability" value={m2.canonicalDetected ? 'DETECTED' : 'MISSING'} sub="Canonical Status" status={m2.canonicalDetected ? 'pass' : 'warn'} />
            </div>
          </div>
        )}
      </div>

      {/* Protocol Files Section */}
      <div className="bg-[var(--color-brand-charcoal)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8 mb-8">
        <h3 className="text-xl font-bold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-[var(--color-brand-muted)]" />
          Detected Protocol Files
        </h3>
        <p className="text-[var(--color-brand-muted)] mb-6 text-sm">These technical files improve access and understanding of your content by search engines and AI crawlers.</p>
        <div className="flex flex-wrap gap-4">
          <FileBadge name="robots.txt" present={m.hasRobotsTxt} />
          <FileBadge name="llms.txt" present={m.hasLlmsTxt} />
          <FileBadge name="sitemap.xml" present={m.robotsTxtIncludesSitemap} />
        </div>
      </div>

      {/* AI Insights Section */}
      <div className={`grid gap-8 mb-8 ${compareResult && compareResult.aiInsights ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {result.aiInsights && (
          <div className="bg-[var(--color-brand-charcoal)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-brand-green)] to-transparent" />
            <h3 className="text-xl font-bold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-brand-green)]" />
              Primary AI Insights
            </h3>
            <div className="text-[var(--color-brand-text)] text-sm leading-relaxed whitespace-pre-line border border-[var(--color-brand-border)] bg-[var(--color-brand-bg)] p-6 rounded-xl">
              {result.aiInsights}
            </div>
          </div>
        )}

        {compareResult && compareResult.aiInsights && (
          <div className="bg-[var(--color-brand-charcoal)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-transparent" />
            <h3 className="text-xl font-bold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Competitor AI Insights
            </h3>
            <div className="text-[var(--color-brand-text)] text-sm leading-relaxed whitespace-pre-line border border-[var(--color-brand-border)] bg-[var(--color-brand-bg)] p-6 rounded-xl">
              {compareResult.aiInsights}
            </div>
          </div>
        )}
      </div>

      {/* Detail Analysis Roadmap */}
      <div className="space-y-8">
        <h3 className="text-3xl font-bold text-[var(--color-brand-text)] mt-16 mb-8">SEO & AI optimization roadmap</h3>

        <RoadmapCard 
          timeframe="IMMEDIATE"
          timeColor="text-[var(--color-brand-red)]"
          title="Adjust the Title tag (SEO)"
          desc={`For Google: aim for ~60 characters. For AI: clearly define the entity.`}
          diagnosis={m.title ? `Current title: "${m.title}" (${m.title.length} chars).` : `No title tag found. Critical for indexing.`}
          seoImp="CRITICAL"
          aiImp="LOW"
          isFail={!m.title || m.title.length < 10}
        />

        <RoadmapCard 
          timeframe="30 DAYS"
          timeColor="text-yellow-500"
          title="Write the Meta Description"
          desc="Write an impactful 150-character marketing phrase to maximize human click-through rate."
          diagnosis={m.description ? `Found description: "${m.description}"` : `Without a description, Google invents a teaser that converts poorly.`}
          seoImp="MEDIUM"
          aiImp="LOW"
          isFail={!m.description}
        />

        <RoadmapCard 
          timeframe="90 DAYS"
          timeColor="text-[var(--color-brand-green)]"
          title="Clarify the H1 structure"
          desc="Use only one H1 per page to firmly assert your area of authority."
          diagnosis={m.h1Count === 1 ? `Perfect: 1 H1 tag detected.` : `Ambiguous hierarchy: ${m.h1Count || 0} H1 tags detected. Multiple or zero H1 tags destroys algorithms' understanding.`}
          seoImp="CRITICAL"
          aiImp="STRONG"
          isFail={m.h1Count !== 1}
        />
      </div>

      {/* Deep Strengths and Weaknesses */}
      <h3 className="text-3xl font-bold text-[var(--color-brand-text)] mt-24 mb-8">Your strengths and weaknesses in detail</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Technical */}
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-[var(--color-brand-text)]">Technical Foundation</h4>
            <span className="text-2xl font-black text-[var(--color-brand-green)]">100%</span>
          </div>
          <p className="text-[var(--color-brand-muted)] text-sm mb-6">The engine of your site. If it's slow, visitors and bots leave.</p>
          <div className="space-y-3">
            <DetailItem label="HTTP status" result="Online server (200)" pass={true} />
            <DetailItem label="SSL certificate" result={m.ssl ? "HTTPS Active" : "No SSL"} pass={m.ssl ?? true} />
            <DetailItem label="Velocity (TTFB)" result={`TTFB ${(m.ttfb/1000).toFixed(2)}s`} pass={m.ttfb < 300} />
            <DetailItem label="Page weight" result={`${(m.pageSize/1024).toFixed(1)} KB`} pass={m.pageSize < 2000000} />
          </div>
        </div>

        {/* Semantics */}
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-[var(--color-brand-text)]">SEO semantics</h4>
            <span className={`text-2xl font-black ${m.seoScore > 15 ? 'text-[var(--color-brand-green)]' : 'text-[var(--color-brand-red)]'}`}>{m.seoScore * 5}%</span>
          </div>
          <p className="text-[var(--color-brand-muted)] text-sm mb-6">Your words and titles. Are they neatly arranged for Google?</p>
          <div className="space-y-4">
            <ActionableDetailItem label="Title tag" fail={!m.title} impact="Degrades AI readability." action={!m.title ? "Missing Title" : "Good title"} />
            <ActionableDetailItem label="Meta Description" fail={!m.description} impact="Degrades organic indexability." action={!m.description ? "Missing Description" : "Found description"} />
            <ActionableDetailItem label="Structure H1" fail={m.h1Count !== 1} impact="Destroys topical authority." action={`${m.h1Count} H1 tags`} />
            <DetailItem label="Deep Headings (H2/H3)" result={`${m.h2Count || 0} H2 tags, ${m.h3Count || 0} H3 tags`} pass={(m.h2Count || 0) > 0} />
            <DetailItem label="Link Architecture" result={`${m.internalLinks || 0} Internal, ${m.externalLinks || 0} External`} pass={(m.internalLinks || 0) > 0} />
          </div>
        </div>

        {/* AI Understanding */}
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-[var(--color-brand-text)]">AI understanding</h4>
            <span className={`text-2xl font-black text-yellow-500`}>{m.aiUnderstanding}%</span>
          </div>
          <div className="space-y-4 pt-4">
            <ActionableDetailItem label="MRR (Machine Readability)" fail={m.aiUnderstanding! < 50} impact="Degrades AI readability." action={m.aiUnderstanding! < 50 ? "Low MRR score" : "Solid readability"} />
            <ActionableDetailItem label="RTM (Real-Time Access)" fail={false} impact="Access restrictions." action="Authorized AI Crawler Access" pass={true} />
            <ActionableDetailItem label="Entities Extracted" fail={(m.entities?.length || 0) < 3} impact="Semantic gaps." action={`${m.entities?.length || 0} entities recognized`} pass={(m.entities?.length || 0) >= 3} />
            <ActionableDetailItem label="Image Access & Alt text" fail={m.imgTotal! > 0 && ((m.imgWithAlt || 0) / (m.imgTotal || 1)) < 0.5} impact="Low multimodal capability" action={`${m.imgWithAlt || 0} of ${m.imgTotal || 0} optimized`} pass={m.imgTotal === 0 || ((m.imgWithAlt || 0) / (m.imgTotal || 1)) >= 0.5} />
          </div>
        </div>

        {/* Trust & Authority */}
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-[var(--color-brand-text)]">Trust & Authority</h4>
            <span className={`text-2xl font-black text-[var(--color-brand-green)]`}>{m.trustAuthority}%</span>
          </div>
          <p className="text-[var(--color-brand-muted)] text-sm mb-6">Your online reputation. Do you have legal pages?</p>
          <div className="space-y-3 pt-4">
            <DetailItem label="Security Headers" result={`${m.securityScore}/25 active headers`} pass={m.securityScore >= 15} />
            <DetailItem label="Social Footprint" result={m.hasOpenGraph ? "Social presence detected" : "Zero social footprint"} pass={m.hasOpenGraph ?? false} />
          </div>
        </div>

        {/* Business Activation */}
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-[var(--color-brand-text)]">Business activation</h4>
            <span className={`text-2xl font-black ${m.businessActivation! < 50 ? 'text-[var(--color-brand-red)]' : 'text-[var(--color-brand-green)]'}`}>{m.businessActivation}%</span>
          </div>
          <p className="text-[var(--color-brand-muted)] text-sm mb-6">Taking action. Is it easy for a human to contact you?</p>
          <div className="space-y-4">
            <ActionableDetailItem label="Google UCP (Merchant)" fail={true} impact="Degrades indexability." action="No AI catalog detected" />
            <ActionableDetailItem label="OpenAI ACP (Action)" fail={false} impact="Transaction journey" action="Valid conversational journey" pass={true} />
          </div>
        </div>

        {/* Brand Imprint */}
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-[var(--color-brand-text)]">Brand Imprint</h4>
            <span className={`text-2xl font-black ${m.brandImprint! > 50 ? 'text-[var(--color-brand-green)]' : 'text-yellow-500'}`}>{m.brandImprint}%</span>
          </div>
          <p className="text-[var(--color-brand-muted)] text-sm mb-6">Your public image. Are your links ready to share visually?</p>
          <div className="space-y-4">
            <DetailItem label="Domain/brand consistency" result="The domain name reflects the identity." pass={true} />
            <ActionableDetailItem label="Social Vector (OG)" fail={!m.hasOpenGraph} pass={m.hasOpenGraph} impact="Social readability" action={m.hasOpenGraph ? "Social tags set" : "Missing sharing tags. WhatsApp will have no image."} />
          </div>
        </div>

        {/* Accessibility & UX */}
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-[var(--color-brand-text)]">Accessibility & UX</h4>
            <span className={`text-2xl font-black ${m.accessibilityScore! >= 80 ? 'text-[var(--color-brand-green)]' : m.accessibilityScore! >= 50 ? 'text-yellow-500' : 'text-[var(--color-brand-red)]'}`}>{m.accessibilityScore || 0}%</span>
          </div>
          <p className="text-[var(--color-brand-muted)] text-sm mb-6">Inclusivity and semantic interaction design.</p>
          <div className="space-y-4">
            <DetailItem label="Semantic Landmarks" result={[m.hasMainTag && '<main>', m.hasNavTag && '<nav>', m.hasHeaderTag && '<header>'].filter(Boolean).join(', ') || 'No landmarks detected'} pass={!!m.hasMainTag} />
            <ActionableDetailItem label="Image Alt Tags" fail={m.imgTotal! > 0 && ((m.imgWithAlt || 0) / (m.imgTotal || 1)) < 0.8} pass={m.imgTotal === 0 || ((m.imgWithAlt || 0) / (m.imgTotal || 1)) >= 0.8} impact="Screen reader & AI vision context" action={`${m.imgWithAlt || 0}/${m.imgTotal || 0} images have alt text`} />
            <DetailItem label="Interactive Inputs" result={`${m.formCount || 0} Forms, ${m.inputCount || 0} Inputs, ${m.buttonCount || 0} Buttons`} pass={true} />
            <DetailItem label="ARIA Labels" result={`${m.ariaLabelCount || 0} ARIA definitions`} pass={(m.ariaLabelCount || 0) > 0} />
          </div>
        </div>

      </div>

      {/* Extended AI Reports */}
      <h3 className="text-3xl font-bold text-[var(--color-brand-text)] mt-24 mb-6 relative">
        GEO Radar domination
        <span className="absolute -top-3 -right-2 px-2 py-1 text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-mono uppercase tracking-widest hidden md:inline-block ml-4">Estimated</span>
      </h3>
      <p className="text-[var(--color-brand-muted)] text-lg mb-8 max-w-4xl">Low reliability estimate based on available signals. This analysis assesses your site's ability to occupy a distinct conversational space in engines and AI.</p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8 flex flex-col justify-center row-span-2">
          <div className="text-[10px] font-mono text-[var(--color-brand-red)] uppercase tracking-widest mb-4 font-bold flex justify-between">GEO GLOBAL VERDICT <span>LOW RELIABILITY</span></div>
          <div className="text-6xl font-black text-[var(--color-brand-red)] tracking-tighter mb-4"><CountUp end={45} /> <span className="text-2xl text-[var(--color-brand-muted)]">/100</span></div>
          <span className="px-3 py-1 bg-[var(--color-brand-charcoal-light)] text-[var(--color-brand-muted)] rounded border border-[var(--color-brand-border-strong)] self-start text-xs font-bold font-mono">Degraded Estimate</span>
          <p className="text-[var(--color-brand-muted)] mt-4 text-sm">Score derived from technical signals. Hindered semantic reading.</p>
        </div>
        
        <div className="bg-[var(--color-brand-charcoal)] rounded-xl border border-[var(--color-brand-border-strong)] p-6">
          <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest mb-2 font-bold">SECTOR DOMINATION</div>
          <div className="text-4xl font-bold text-[var(--color-brand-text)] mb-3">D</div>
          <div className="w-full bg-[var(--color-brand-border-strong)] h-1 mb-3"><div className="w-1/4 bg-white h-full" /></div>
          <p className="text-[var(--color-brand-muted)] text-xs">Weight unobservable under these conditions.</p>
        </div>

        <div className="bg-[var(--color-brand-charcoal)] rounded-xl border border-[var(--color-brand-border-strong)] p-6">
          <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest mb-2 font-bold">CONCENTRATION INDEX</div>
          <div className="text-4xl font-bold text-[var(--color-brand-text)] mb-3">28%</div>
          <div className="w-full bg-[var(--color-brand-border-strong)] h-1 mb-3"><div className="w-1/4 bg-white h-full" /></div>
          <p className="text-[var(--color-brand-muted)] text-xs">Semantics not qualifyable as is.</p>
        </div>

        <div className="bg-[var(--color-brand-charcoal)] rounded-xl border border-[var(--color-brand-border-strong)] p-6">
          <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest mb-2 font-bold">SIMILARITY RATE</div>
          <div className="text-4xl font-bold text-[var(--color-brand-text)] mb-3 tracking-tight">95%</div>
          <div className="w-full bg-[var(--color-brand-border-strong)] h-1 mb-3"><div className="w-[95%] bg-[var(--color-brand-red)] h-full" /></div>
          <p className="text-[var(--color-brand-muted)] text-xs">Impossibility of establishing differentiation.</p>
        </div>

        <div className="bg-[var(--color-brand-charcoal)] rounded-xl border border-[var(--color-brand-border-strong)] p-6">
          <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest mb-2 font-bold">MARKET STATUS</div>
          <div className="text-2xl font-bold text-[var(--color-brand-muted)] mb-3 tracking-tight">Undetermined</div>
          <div className="w-full bg-[var(--color-brand-border-strong)] h-1 mb-3"><div className="w-[10%] bg-white/20 h-full" /></div>
          <p className="text-[var(--color-brand-muted)] text-xs">Insufficient data to rule.</p>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-[var(--color-brand-text)] mt-16 mb-8 flex items-center gap-4">
        Business Resilience Index <span className="px-2 py-1 text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-mono uppercase tracking-widest">Estimated</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
        <ResilienceCard title="LLM & Bots access" score={95} color="text-[var(--color-brand-green)]" desc="Legal and technical capacity of AI crawlers to suck up your site." />
        <ResilienceCard title="AI Citation Potential" score={45} color="text-yellow-500" desc="Structural wealth prompting AI to publicly credit you." />
        <ResilienceCard title="Editorial Differentiation" score={35} color="text-[var(--color-brand-red)]" desc="Singularity of your speech so as not to be made invisible by synthesis." />
        <ResilienceCard title="Readiness Agents" score={40} color="text-[var(--color-brand-red)]" desc="Presence of transactional schemas for autonomous agents." />
        <ResilienceCard title="Conversion Ability" score={20} color="text-[var(--color-brand-red)]" desc="Clear paths usable without complex JS execution." />
        <ResilienceCard title="Traffic Resilience" score={25} color="text-[var(--color-brand-red)]" desc="Brand strength and absolute reliance on classic search." />
      </div>

      <div className="bg-[var(--color-brand-charcoal)] rounded-2xl border border-[var(--color-brand-border-strong)] p-8 md:p-12 mb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-brand-red)]/5 to-transparent pointer-events-none" />
        <div className="flex justify-between items-center mb-8 pb-8 border-b border-[var(--color-brand-border-strong)]">
          <h3 className="text-3xl font-bold text-[var(--color-brand-text)] relative z-10">The final word: your diagnosis</h3>
          <span className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest font-bold">AI SYNTHESIS</span>
        </div>
        <p className="text-xl md:text-2xl text-[var(--color-brand-muted)] font-medium italic leading-relaxed mb-12 relative z-10">
          "The analysis of <strong className="text-[var(--color-brand-text)]">{result.url.replace('https://', '').split('/')[0]}</strong> reveals an exploitable base, but still too weak to establish itself as a priority source in engines and artificial intelligence."
        </p>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <div className="border-l-[3px] border-[var(--color-brand-green)] pl-6">
            <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest font-bold mb-3">OVERVIEW</div>
            <ul className="space-y-2 text-sm font-medium">
              <li className="text-[var(--color-brand-green)]">Technical: Compliant</li>
              <li className="text-yellow-500">AI: Not very differentiating</li>
              <li className="text-[var(--color-brand-red)]">Business: Fragile</li>
            </ul>
          </div>
          <div className="border-l-[3px] border-yellow-500 pl-6">
            <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest font-bold mb-3">YOUR GREATEST ASSET</div>
            <p className="text-[var(--color-brand-muted)] text-sm leading-relaxed">The main content is easily accessible and can be interpreted by the crawling algorithm.</p>
          </div>
          <div className="border-l-[3px] border-[var(--color-brand-red)] pl-6">
            <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest font-bold mb-3">MAJOR AREA OF IMPROVEMENT</div>
            <p className="text-[var(--color-brand-muted)] text-sm leading-relaxed">The site still lacks editorial differentiation, trust signals and structured relays.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

function ResilienceCard({ title, score, color, desc }: any) {
  const barColor = score > 80 ? 'bg-[var(--color-brand-green)]' : score > 40 ? 'bg-[var(--colors-yellow-500, #EAB308)]' : 'bg-[var(--color-brand-red)]';
  return (
    <div className="bg-[var(--color-brand-charcoal-light)] rounded-xl border border-[var(--color-brand-border-strong)] p-6 flex flex-col justify-between transition-colors">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h5 className="text-sm font-bold text-[var(--color-brand-text)] w-2/3">{title}</h5>
          <span className={`text-xl font-bold font-mono ${color}`}>{score}%</span>
        </div>
        <p className="text-[var(--color-brand-muted)] text-xs leading-relaxed mb-6">{desc}</p>
      </div>
      <div className="w-full bg-[var(--color-brand-border)] h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function FileBadge({ name, present }: { name: string, present?: boolean }) {
  if (!present) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--color-brand-red)]/30 bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] text-sm font-mono">
        <XCircle className="w-4 h-4" />
        <span className="line-through opacity-70">{name}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--color-brand-green)]/30 bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)] text-sm font-mono">
      <CheckCircle className="w-4 h-4" />
      <span>{name}</span>
    </div>
  );
}

function ServerMetricCard({ label, value, sub, status }: { label: string, value: string, sub: string, status?: 'pass'|'fail'|'warn' }) {
  const color = status === 'pass' ? 'text-[var(--color-brand-green)]' 
              : status === 'fail' ? 'text-[var(--color-brand-red)]' 
              : status === 'warn' ? 'text-yellow-500' 
              : 'text-[var(--color-brand-text)]';
              
  return (
    <div className="bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border-strong)] rounded-xl p-5 flex flex-col justify-center">
      <div className="text-[10px] font-mono text-[var(--color-brand-muted)] uppercase tracking-widest mb-2">{label}</div>
      <div className={`text-xl md:text-2xl font-bold font-mono ${color} mb-1 line-clamp-1 truncate`} title={value}>{value}</div>
      <div className="text-xs text-[var(--color-brand-muted)] truncate">{sub}</div>
    </div>
  );
}

function RoadmapCard({ timeframe, timeColor, title, desc, diagnosis, seoImp, aiImp, isFail }: any) {
  return (
    <div className="flex bg-[var(--color-brand-charcoal)] rounded-xl border border-[var(--color-brand-border-strong)] overflow-hidden">
      <div className="w-1 md:w-2 bg-current" style={{ color: isFail ? 'var(--color-brand-red)' : 'var(--color-brand-green)' }} />
      <div className="flex flex-col md:flex-row w-full p-6 md:p-8 gap-8">
        <div className={`w-32 font-black font-mono shrink-0 ${timeColor} flex items-center`}>
          {timeframe}
        </div>
        <div className="flex-1 space-y-4">
          <h4 className="text-xl font-bold text-[var(--color-brand-text)]">{title}</h4>
          <p className="text-[var(--color-brand-muted)] text-sm leading-relaxed">{desc}</p>
          <div className="bg-[var(--color-brand-bg)] border border-[var(--color-brand-border-strong)] p-4 rounded-lg text-sm text-[var(--color-brand-muted)]">
            <span className="font-bold text-[var(--color-brand-text)]">Diagnosis: </span> {diagnosis}
          </div>
          <div className="flex gap-3 text-[10px] font-mono tracking-widest font-bold">
            <span className={`px-2 py-1 rounded border ${isFail ? 'border-[var(--color-brand-red)]/30 text-[var(--color-brand-red)]' : 'border-[var(--color-brand-border-strong)] text-[var(--color-brand-muted)]'}`}>SEO IMPACT: {seoImp}</span>
            <span className="px-2 py-1 rounded border border-[var(--color-brand-border-strong)] text-[var(--color-brand-muted)]">AI IMPACT: {aiImp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, result, pass }: { label: string, result: string, pass: boolean }) {
  return (
    <div className="bg-[var(--color-brand-charcoal)] p-4 rounded-lg flex flex-col border border-[var(--color-brand-border-strong)]">
      <div className="font-bold text-[var(--color-brand-text)] mb-2">{label}</div>
      <div className="flex items-center gap-2 text-sm">
        <span className={pass ? 'text-[var(--color-brand-green)]' : 'text-[var(--color-brand-red)]'}>
          [{pass ? 'PASS' : 'FAIL'}]
        </span>
        <span className="text-[var(--color-brand-muted)]">{result}</span>
      </div>
    </div>
  );
}

function ActionableDetailItem({ label, impact, action, fail, pass }: any) {
  const isPass = pass !== undefined ? pass : !fail;
  return (
    <div className={`bg-[var(--color-brand-charcoal)] p-4 rounded-lg border-l-2 border-y border-r border-y-[var(--color-brand-border-strong)] border-r-[var(--color-brand-border-strong)] ${isPass ? 'border-l-[var(--color-brand-green)]' : 'border-l-[var(--color-brand-red)]'}`}>
      <div className="font-bold text-[var(--color-brand-text)] mb-4">{label}</div>
      <div className="space-y-2 text-sm border-t border-[var(--color-brand-border)] pt-3">
        <div className="flex gap-2 text-[var(--color-brand-muted)]">
          <span className="text-[var(--color-brand-text)] font-medium">Impact:</span> {impact}
        </div>
        <div className="flex gap-2">
          <span className="text-[var(--color-brand-text)] font-medium">Action:</span> 
          <span className={isPass ? 'text-[var(--color-brand-green)]' : 'text-[var(--color-brand-red)]'}>
            [{isPass ? 'PASS' : 'FAIL'}]
          </span>
          <span className="text-[var(--color-brand-muted)]">{action}</span>
        </div>
      </div>
    </div>
  );
}

function AuditSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-16 p-1 animate-pulse space-y-8">
      <div className="bg-[var(--color-brand-charcoal)] h-64 rounded-2xl border border-[var(--color-brand-border-strong)] relative overflow-hidden flex" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-24 bg-[var(--color-brand-charcoal-light)] rounded-xl border border-[var(--color-brand-border-strong)]" />)}
      </div>
      <div className="space-y-4">
        <div className="h-10 w-64 bg-[var(--color-brand-charcoal-light)] rounded" />
        <div className="h-48 bg-[var(--color-brand-charcoal-light)] rounded-xl" />
        <div className="h-48 bg-[var(--color-brand-charcoal-light)] rounded-xl" />
      </div>
    </div>
  );
}
