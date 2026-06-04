import { Flame, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#30363d] py-16 px-6 mt-24 text-[0.9rem] text-[#8b949e]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
        <div className="max-w-[350px]">
          <Link to="/" className="flex items-center gap-2 mb-4 text-[1.4rem] font-black text-[var(--color-brand-red)] tracking-tight hover:opacity-80 transition-opacity">
            <Flame className="w-7 h-7" /> Web<span>Blaze</span>
          </Link>
          <p className="text-white font-bold mb-2 font-mono text-[0.85rem] uppercase tracking-widest">
            The audit that ignites your web
          </p>
          <p className="leading-relaxed mb-5 text-[0.95rem]">
            Technical analysis, SEO and AI citability. Identify the structural blockers of your site in one scan.
          </p>
          <p className="text-[#555] text-[0.8rem] leading-relaxed">
            Infrastructure: <strong>Global Edge</strong><br />
            Powered by John Varghese (J0X)
          </p>
          <p className="text-[#555] text-[0.8rem] leading-relaxed mt-4">
            <a href="mailto:hello@webblaze.com" className="text-[#8b949e] underline decoration-dashed decoration-[#30363d] hover:text-white transition-colors">
              Contact: hello@webblaze.com
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl">
          <div className="space-y-4">
            <h5 className="text-white text-[0.8rem] font-bold uppercase tracking-widest font-mono">Product</h5>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-white transition-colors">Scan a site</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Pricing & Model</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Audit examples</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Hall of Fame</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-white text-[0.8rem] font-bold uppercase tracking-widest font-mono">Resources</h5>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-white transition-colors">Technical Guide</Link></li>
              <li><Link to="/checklist" className="hover:text-white transition-colors">Prod Checklist</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">The Manifesto</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">llms.txt file</Link></li>
              <li><a href="https://github.com/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Project</a></li>
              <li><a href="https://linkedin.com/in/John-Varghese" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-white text-[0.8rem] font-bold uppercase tracking-widest font-mono">Trust</h5>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-white transition-colors">The Crew</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Responsible AI</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms (TOS)</Link></li>
              <li><a href="#" className="font-bold text-yellow-500 hover:text-yellow-400 transition-colors">☕ Support (PayPal)</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-5 border-t border-[#161b22] text-left">
        <p className="text-[0.8rem] text-[#444] uppercase tracking-widest font-bold">
          <strong>Free</strong> to use • Zero data resale • Independent for builders
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-5 border-t border-[#161b22] text-center">
        <p className="font-mono text-[0.75rem] text-[#555] flex flex-wrap items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} <strong className="text-[#8b949e]">WebBlaze</strong> 
          <span className="text-[#161b22]">|</span> 
          Protocol 2026.4 
          <span className="text-[#161b22]">|</span> 
          <span className="text-[#555]">Made by</span> <span className="text-[var(--color-brand-red)] font-bold">John Varghese</span>
        </p>
      </div>
    </footer>
  );
}
