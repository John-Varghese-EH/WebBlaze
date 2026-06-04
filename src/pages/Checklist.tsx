import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Checklist() {
  const [filterQuery, setFilterQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    prod: true,
    geo: true,
    survival: true,
    express: true,
  });

  const STORAGE_KEY = 'webblaze_checklist_state';
  const [completedState, setCompletedState] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<{msg: string, sub?: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCompletedState(JSON.parse(saved));
      } catch (e) {
        // ignore JSON parse error
      }
    }
    setIsLoaded(true);
  }, []);

  const saveState = (newState: Record<string, boolean>) => {
    setCompletedState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };
  
  const showToast = (msg: string, sub?: string) => {
    setToastMessage({msg, sub});
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleCat = (catId: string) => {
    setExpandedCats(prev => ({...prev, [catId]: !prev[catId]}));
  };

  const sections = [
    {
      id: "prod",
      title: "Production launch (Go-Live)",
      shortTitle: "Production",
      icon: "🚀",
      description: "Healthy deployment",
      colorClass: "border-[var(--color-brand-border-strong)] text-[var(--color-brand-text)]",
      fillClass: "bg-[var(--color-brand-text)]",
      intro: "Technical Foundation: The prerequisite. A poorly structured or blocking site for crawlers collapses even before semantic analysis. Secure infrastructure.",
      signals: [
        { id: "https", title: "SSL & HTTPS integrity", desc: "Valid certificate. No mixed content (assets loaded in HTTP).", tip: "Essential: An insecure site is immediately downgraded to trust.", tags: "ssl https securite trust" },
        { id: "seo-tags", title: "Primary Tags (Title/Meta)", desc: "Unique and descriptive title. H1 aligned with target intent. Meta description present.", tip: "Essential: Sets the entity name for indexers.", tags: "title meta seo description" },
        { id: "sitemap", title: "XML sitemap", desc: "File /sitemap.xml active and declared in the robots.txt.", tags: "xml sitemap robots search console" },
        { id: "social-og", title: "Social Vector (OpenGraph)", desc: "High resolution sharing image (1200x630) and OG tags configured.", tip: "Essential: Guarantees a professional presentation when sharing (human and AI).", tags: "og image opengraph twitter social" },
        { id: "favicon", title: "Browser Identity (Favicon)", desc: "Visual consistency ensured in mobile tabs and shortcuts.", tags: "branding favicon icon" }
      ]
    },
    {
      id: "geo",
      title: "AI/LLM readability",
      shortTitle: "AI readability",
      icon: "🤖",
      description: "Semantic clarity",
      colorClass: "border-blue-500/30 text-blue-500",
      fillClass: "bg-blue-500",
      intro: "AI understanding: From indexing to extraction. It is no longer a question of being clicked, but of being ingested, summarized and sourced by the LLMs.",
      signals: [
        { id: "llms-txt", title: "Standard llms.txt", desc: "Markdown orientation file placed at the root to guide agents.", tip: "Note: Must remain factual and summarize the main offer of the domain.", tags: "llms.txt ia bot documentation" },
        { id: "citability", title: "Fact Density (Payload)", desc: "Reduced HTML noise. Verifiable information and explicit documentary structure.", tip: "Note: LLMs prioritize pages with a high signal-to-noise ratio.", tags: "authority EEAT citability ia" },
        { id: "schema-org", title: "Authority Schemes (JSON-LD)", desc: "Tags Organization or Person active to disambiguate your business entity.", tags: "schema json-ld organization person structured data" },
        { id: "robots-ia", title: "AI Agent Access", desc: "Verification of robots.txt to avoid unintentional blocking of GPTBot or ClaudeBot.", tags: "robots ia gptbot ccbot crawl" }
      ]
    },
    {
      id: "survival",
      title: "Course & Conversion",
      shortTitle: "Conversion",
      icon: "🛒",
      description: "Zero friction",
      colorClass: "border-yellow-500/30 text-yellow-500",
      fillClass: "bg-yellow-500",
      intro: "Business Activation: Unconverted traffic is a server load. The routes must remain fluid and readable, including by independent purchasing agents.",
      signals: [
        { id: "acp-ucp", title: "Action Compatibility", desc: "HTML structure allowing interaction (standard forms, clear links without blocking JS).", tags: "acp ucp protocols e-commerce agents ia" },
        { id: "checkout-friction", title: "Tunnel Friction", desc: "Direct access to the offer without penalizing interstitial pop-ups or complex obligations.", tip: "Note: UX friction impacts machine reading as much as humans.", tags: "cart checkout bot friction" },
        { id: "product-schema", title: "Data E-commerce (Product)", desc: "Prices, currencies and stock statuses exposed natively in the JSON-LD.", tags: "product schema stock inventory price" },
        { id: "waf-bots", title: "WAF monitoring", desc: "Firewalls (Cloudflare) are configured not to ban certified indexing crawlers.", tags: "security waf bot management agentic" }
      ]
    },
    {
      id: "express",
      title: "Performance Front",
      shortTitle: "Performance",
      icon: "⚡",
      description: "TTFB & Rendering",
      colorClass: "border-[var(--color-brand-border-strong)] text-[var(--color-brand-text)]",
      fillClass: "bg-[var(--color-brand-text)]",
      intro: "Infrastructure: Heavy code consumes power and crawl time. Mechanical performance gains are the easiest to achieve.",
      signals: [
        { id: "ttfb", title: "TTFB velocity", desc: "Server first response time is optimized (active caching).", tags: "ttfb vitesse performance backend" },
        { id: "status-codes", title: "Zero Critical Error (HTTP)", desc: "No pillar page returns status 404 (Not Found) or 5xx (Server Error).", tags: "404 500 error logs health" },
        { id: "mobile-viewport", title: "Viewport rendering", desc: "The interface is strictly responsive (mobile readability validated without X overflow).", tags: "responsive mobile viewport render" }
      ]
    }
  ];

  const totalSignals = useMemo(() => sections.reduce((acc, curr) => acc + curr.signals.length, 0), []);

  const toggleItem = (id: string) => {
    saveState({...completedState, [id]: !completedState[id]});
  };

  const completedCount = Object.values(completedState).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalSignals) * 100);

  const filteredSections = useMemo(() => {
    if (!filterQuery) return sections;
    const q = filterQuery.toLowerCase();
    
    return sections.map(section => ({
      ...section,
      signals: section.signals.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.desc.toLowerCase().includes(q) || 
        s.tags.toLowerCase().includes(q)
      )
    })).filter(s => s.signals.length > 0);
  }, [filterQuery]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen selection:bg-[var(--color-brand-red)] selection:text-white pt-24 pb-32 max-w-4xl mx-auto px-6">
      {/* Toast Notification */}
      <div className={`fixed top-24 right-4 z-50 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] p-4 rounded-xl shadow-2xl transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <p className="font-mono text-sm text-[var(--color-brand-text)] font-bold">{toastMessage?.msg}</p>
        {toastMessage?.sub && <p className="font-mono text-xs text-[var(--color-brand-muted)] mt-1">{toastMessage.sub}</p>}
      </div>
      
      <div className="mb-12 border-b border-[var(--color-brand-border-strong)] pb-12">
        <h1 className="font-mono text-4xl font-black tracking-tighter mb-4 text-[var(--color-brand-text)] uppercase">The Architecture Checklist</h1>
        <p className="text-[var(--color-brand-muted)] text-lg mb-8 max-w-2xl">
          Check, export, and consolidate the technical readability of your site. A strict matrix to lock in production, SEO footprint and AI usability.
        </p>
        <div className="flex flex-wrap gap-3 font-mono text-xs font-bold">
          <span className="px-3 py-1 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] rounded-full text-[var(--color-brand-text)] hover:border-[var(--color-brand-text)] transition-colors">
            Root Files: /robots.txt /llms.txt
          </span>
          <span className="px-3 py-1 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] rounded-full text-[var(--color-brand-text)] hover:border-[var(--color-brand-text)] transition-colors">
            SEO & GEO telemetry
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {sections.map(s => (
          <div key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'})} className="cursor-pointer p-4 rounded-xl border border-[var(--color-brand-border-strong)] bg-[var(--color-brand-charcoal-light)] hover:border-[var(--color-brand-red)] transition-all group flex flex-col justify-between">
            <span className="text-2xl mb-2">{s.icon}</span>
            <div>
              <strong className="block font-mono text-sm uppercase tracking-wide text-[var(--color-brand-text)] group-hover:text-[var(--color-brand-red)] transition-colors">{s.shortTitle}</strong>
              <span className="text-xs text-[var(--color-brand-muted)]">{s.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky top-20 z-40 bg-[var(--color-brand-bg)] border border-[var(--color-brand-border-strong)] p-4 rounded-xl shadow-2xl mb-12 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="relative w-full md:w-auto flex-1 max-w-md flex items-center">
          <input 
            type="text" 
            placeholder="Filter signals (e.g. ttfb, schema, robots)..." 
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-full bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border-strong)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-brand-red)] font-mono text-sm text-[var(--color-brand-text)]"
          />
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-brand-muted)] mb-1">Compliance</div>
            <div className="font-mono font-bold text-[var(--color-brand-text)]">{completedCount} / {totalSignals}</div>
          </div>
          <div className="flex-1 w-full md:w-48">
            <div className="h-2 w-full bg-[var(--color-brand-charcoal-light)] rounded-full overflow-hidden">
               <div className="h-full bg-[var(--color-brand-red)] transition-all duration-300" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="text-[10px] text-right mt-1 font-mono text-[var(--color-brand-muted)]">{progressPct}%</div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {filteredSections.map(section => {
          const sectionCompletedCount = section.signals.filter(s => completedState[s.id]).length;
          const sectionPct = Math.round((sectionCompletedCount / section.signals.length) * 100);

          return (
            <div key={section.id} id={section.id} className="scroll-mt-48">
              <div className="mb-6 bg-gradient-to-r from-[var(--color-brand-charcoal-light)] to-transparent p-6 rounded-xl border border-[var(--color-brand-border-strong)]">
                <p className="text-sm font-medium text-[var(--color-brand-text)] italic opacity-90">{section.intro}</p>
              </div>

              <div className={`mt-8 border ${section.colorClass} rounded-2xl overflow-hidden`}>
                <div className="p-4 md:p-6 bg-[var(--color-brand-charcoal-light)] border-b border-[var(--color-brand-border-strong)] flex items-center justify-between cursor-pointer" onClick={() => toggleCat(section.id)}>
                  <div className="flex items-center gap-4">
                     <h3 className={`font-mono font-bold uppercase tracking-widest ${section.colorClass.includes('text-blue') ? 'text-blue-500' : section.colorClass.includes('text-yellow') ? 'text-yellow-500' : 'text-[var(--color-brand-text)]'}`}>{section.title}</h3>
                     <span className="px-2 py-1 bg-[var(--color-brand-bg)] rounded-md text-[10px] font-mono border border-[var(--color-brand-border-strong)] text-[var(--color-brand-muted)]">
                        {section.signals.length} Signals
                     </span>
                  </div>
                  <button className="text-xs font-mono text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)]">{expandedCats[section.id] ? 'Fold' : 'Unfold'}</button>
                </div>
                
                <div className="h-1 w-full bg-black/50">
                   <div className={`h-full ${section.fillClass} transition-all duration-300`} style={{ width: `${sectionPct}%` }} />
                </div>

                {expandedCats[section.id] && (
                  <div className="divide-y divide-[var(--color-brand-border-strong)]">
                    {section.signals.map(signal => (
                      <div key={signal.id} className={`p-4 md:p-6 flex items-start gap-4 transition-colors hover:bg-[var(--color-brand-charcoal-light)]/50 ${completedState[signal.id] ? 'opacity-50 grayscale' : ''}`}>
                         <button 
                           onClick={() => toggleItem(signal.id)}
                           className={`mt-1 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${completedState[signal.id] ? 'bg-[var(--color-brand-red)] border-[var(--color-brand-red)]' : 'border-[var(--color-brand-border-strong)] hover:border-[var(--color-brand-text)]'}`}
                         >
                           {completedState[signal.id] && <span className="text-white text-xs font-bold">✓</span>}
                         </button>
                         <div>
                            <h4 className={`font-mono text-sm font-bold uppercase tracking-wider mb-2 ${completedState[signal.id] ? 'line-through text-[var(--color-brand-muted)]' : 'text-[var(--color-brand-text)]'}`}>{signal.title}</h4>
                            <p className="text-sm text-[var(--color-brand-muted)] mb-3">{signal.desc}</p>
                            {signal.tip && (
                              <div className="inline-block px-3 py-1 bg-[var(--color-brand-bg)] border border-[var(--color-brand-border-strong)] rounded-md text-xs text-[var(--color-brand-muted)] italic font-mono mb-2">
                                💡 {signal.tip}
                              </div>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredSections.length === 0 && (
         <div className="py-20 text-center font-mono text-[var(--color-brand-muted)] uppercase tracking-widest text-sm border-2 border-dashed border-[var(--color-brand-border-strong)] rounded-2xl mt-12 bg-[var(--color-brand-charcoal-light)]">
           No signals match your filter.
         </div>
      )}

      <div className="mt-20 border border-[var(--color-brand-border-strong)] rounded-2xl bg-[var(--color-brand-charcoal-light)] p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="font-mono text-xl font-bold uppercase tracking-widest text-[var(--color-brand-text)] mb-2">Telemetric Export</h3>
            <p className="text-sm text-[var(--color-brand-muted)]">Extract the JSON to maintain state, or generate a clean Markdown log for your development tickets (Jira, GitHub).</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => {
                let md = "# WebBlaze Architecture Checklist Log\n\n";
                sections.forEach(s => {
                  md += `## ${s.title}\n`;
                  s.signals.forEach(sig => {
                    md += `- [${completedState[sig.id] ? 'x' : ' '}] **${sig.title}**: ${sig.desc}\n`;
                  });
                  md += '\n';
                });
                navigator.clipboard.writeText(md);
                showToast("Log copied", "Markdown exported.");
              }}
              className="px-4 py-2 bg-[var(--color-brand-text)] text-[var(--color-brand-bg)] font-bold rounded-lg hover:opacity-80 transition-opacity text-sm font-mono"
            >
              Copy Markdown
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(completedState));
                showToast("JSON copied", "State payload generated.");
              }}
              className="px-4 py-2 bg-[var(--color-brand-border-strong)] text-[var(--color-brand-text)] font-bold rounded-lg hover:bg-white/20 transition-colors text-sm font-mono border border-[var(--color-brand-border-strong)]"
            >
              JSON Export
            </button>
            <button 
              onClick={() => {
                const raw = prompt("Paste JSON payload:");
                if(!raw) return;
                try{
                  const parsed = JSON.parse(raw);
                  saveState(parsed);
                  showToast("Import successful", "Matrix updated.");
                }catch(e){
                  showToast("Syntax error", "Invalid JSON.");
                }
              }}
              className="px-4 py-2 bg-[var(--color-brand-border-strong)] text-[var(--color-brand-text)] font-bold rounded-lg hover:bg-white/20 transition-colors text-sm font-mono border border-[var(--color-brand-border-strong)]"
            >
              Import JSON
            </button>
            <button 
              onClick={() => {
                if(!confirm('Purge the matrix?')) return;
                saveState({});
                showToast("Purge completed");
              }}
              className="px-4 py-2 text-[var(--color-brand-red)] font-bold rounded-lg hover:bg-red-500/10 transition-colors text-sm font-mono border border-red-500/30"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Post-Deployment Iteration Section */}
      <section className="mt-16 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border-strong)] rounded-2xl p-10 text-center">
        <div className="inline-block px-3 py-1 mb-4 rounded-md text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-muted)] bg-white/5 border border-[var(--color-brand-border-strong)] font-mono">
          Iteration
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Post-deployment</h3>
        <p className="text-[var(--color-brand-muted)] max-w-2xl mx-auto mb-8 font-mono text-sm leading-relaxed">
          Validate that the architecture optimizations have been correctly taken into account by the engines via a control scan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/" className="flex flex-col items-center justify-center p-6 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] rounded-xl hover:border-[var(--color-brand-text)] transition-all group">
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform text-[var(--color-brand-red)]">🔥</span>
            <strong className="text-white text-[0.95rem] mb-1">Control Audit</strong>
            <span className="text-[var(--color-brand-muted)] text-[0.8rem]">Scan production</span>
          </Link>
          <Link to="/" className="flex flex-col items-center justify-center p-6 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] rounded-xl hover:border-[var(--color-brand-text)] transition-all group">
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform text-blue-500">📘</span>
            <strong className="text-white text-[0.95rem] mb-1">Technical Reference</strong>
            <span className="text-[var(--color-brand-muted)] text-[0.8rem]">Documentation</span>
          </Link>
          <Link to="/" className="flex flex-col items-center justify-center p-6 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] rounded-xl hover:border-[var(--color-brand-text)] transition-all group">
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform text-[var(--color-brand-green)]">📊</span>
            <strong className="text-white text-[0.95rem] mb-1">B2B reports</strong>
            <span className="text-[var(--color-brand-muted)] text-[0.8rem]">Examples of deliverables</span>
          </Link>
          <a href="#" className="flex flex-col items-center justify-center p-6 bg-yellow-500/5 border border-yellow-500/30 rounded-xl hover:border-yellow-500 transition-all group">
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform text-yellow-500">☕</span>
            <strong className="text-white text-[0.95rem] mb-1">Support the project</strong>
            <span className="text-[var(--color-brand-muted)] text-[0.8rem]">Via PayPal</span>
          </a>
        </div>
      </section>

      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl bg-[var(--color-brand-charcoal)]/95 backdrop-blur-md border border-[var(--color-brand-border-strong)] p-4 rounded-xl shadow-2xl flex items-center justify-between gap-6 transition-all duration-300 z-50 ${completedCount > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="flex items-center gap-4 min-w-[150px]">
          <div className="text-xl font-bold font-mono text-white tracking-widest">{completedCount} <span className="text-[var(--color-brand-muted)]">/ {totalSignals}</span></div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-brand-muted)] hidden md:block">
            {progressPct >= 100 ? <span className="text-[var(--color-brand-green)]">Approved</span> : progressPct >= 70 ? 'Solid Status' : 'In Progress'}
          </div>
        </div>
        <div className="flex-1 w-full flex items-center">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-[var(--color-brand-green)] transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}
             className="px-3 py-1.5 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] text-white text-xs font-mono font-bold uppercase tracking-widest rounded-md hover:border-[var(--color-brand-text)]"
           >
             Log
           </button>
           <button 
             onClick={() => {
               const newState: Record<string, boolean> = {};
               sections.forEach(s => newState[s.id] = true);
               setExpandedCats(newState);
             }}
             className="px-3 py-1.5 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] text-white text-xs font-mono font-bold uppercase tracking-widest rounded-md hover:border-[var(--color-brand-text)] hidden sm:block"
           >
             Unfold
           </button>
        </div>
      </div>

    </div>
  );
}
