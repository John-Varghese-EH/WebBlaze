import { Flame, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[var(--color-brand-charcoal-light)] border-t border-[var(--color-brand-border-strong)] py-16 px-6 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-sm text-[var(--color-brand-muted)]">
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-2 text-[var(--color-brand-text)]">
            <Flame className="w-5 h-5 text-[var(--color-brand-red)]" />
            <span className="text-xl font-bold tracking-tight">WebBlaze</span>
          </div>
          <p className="leading-relaxed">
            Uncovering the weaknesses holding the web back. Perfect for developers and designers who demand high performance and brutalist aesthetics.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="https://github.com/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brand-text)] transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-[var(--color-brand-text)] transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="https://linkedin.com/in/John-Varghese" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brand-text)] transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        <div className="flex gap-16 font-mono">
          <div className="space-y-4">
            <h4 className="text-[var(--color-brand-text)] font-semibold uppercase tracking-wider text-xs">Ecosystem</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[var(--color-brand-red)] transition-colors inline-block hover:-translate-y-0.5 transform">WebPion</a></li>
              <li><a href="#" className="hover:text-[var(--color-brand-red)] transition-colors inline-block hover:-translate-y-0.5 transform">MyProID</a></li>
              <li><a href="#" className="hover:text-[var(--color-brand-red)] transition-colors inline-block hover:-translate-y-0.5 transform">Ignition AI</a></li>
              <li><a href="#" className="hover:text-[var(--color-brand-red)] transition-colors inline-block hover:-translate-y-0.5 transform">Docs</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[var(--color-brand-text)] font-semibold uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#privacy" className="hover:text-[var(--color-brand-text)] transition-colors">Privacy</a></li>
              <li><a href="#terms" className="hover:text-[var(--color-brand-text)] transition-colors">Terms</a></li>
              <li><a href="#cookies" className="hover:text-[var(--color-brand-text)] transition-colors">Cookies</a></li>
              <li><a href="https://github.com/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brand-text)] transition-colors">Open Source</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[var(--color-brand-border-strong)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-[var(--color-brand-muted)]">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>&copy; {new Date().getFullYear()} WebBlaze. All rights reserved.</p>
          <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600"></div>
          <p className="flex items-center gap-2">
            Made by <span className="text-[var(--color-brand-text)] font-bold">John Varghese (J0X)</span>
            <a href="https://github.com/John-Varghese-EH" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brand-text)] transition-colors ml-1"><Github className="w-4 h-4" /></a>
            <a href="https://linkedin.com/in/John-Varghese" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brand-text)] transition-colors"><Linkedin className="w-4 h-4" /></a>
          </p>
        </div>
        <p className="flex items-center gap-2 mt-2 md:mt-0">
          Powered by Caffeine & Pure Logic <Flame className="w-3 h-3 text-[var(--color-brand-red)]" />
        </p>
      </div>
    </footer>
  );
}
