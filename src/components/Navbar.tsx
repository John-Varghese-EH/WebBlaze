import { Flame, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

      if (theme === 'light' || (!theme && prefersLight)) {
        document.documentElement.classList.add('light');
        setIsLight(true);
      } else {
        document.documentElement.classList.remove('light');
        setIsLight(false);
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          if (e.matches) {
            document.documentElement.classList.add('light');
            setIsLight(true);
          } else {
            document.documentElement.classList.remove('light');
            setIsLight(false);
          }
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
    setIsLight(!isLight);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-[var(--color-brand-charcoal-light)] rounded-xl border border-[var(--color-brand-border-strong)] group-hover:border-[var(--color-brand-red)] transition-colors">
            <Flame className="w-6 h-6 text-[var(--color-brand-red)] animate-heartbeat" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-brand-text)] group-hover:text-[var(--color-brand-red)] transition-colors">WebBlaze</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] transition-colors"
            title="Toggle theme"
          >
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <Link to="/" className="text-sm font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] transition-colors">Audit</Link>
          <Link to="/checklist" className="text-sm font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] transition-colors">Checklist</Link>
          <button className="px-5 py-2 bg-[var(--color-brand-text)] text-[var(--color-brand-bg)] font-semibold rounded-lg hover:opacity-80 transition-opacity text-sm">
            Sign In
          </button>
        </div>

        <button 
          className="md:hidden p-2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[var(--color-brand-charcoal)] border-b border-[var(--color-brand-border)] p-6 flex flex-col gap-4 shadow-2xl">
          <Link to="/" className="text-lg font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)]" onClick={() => setIsOpen(false)}>Audit</Link>
          <Link to="/checklist" className="text-lg font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)]" onClick={() => setIsOpen(false)}>Checklist</Link>
          <button className="mt-4 w-full px-5 py-3 bg-[var(--color-brand-text)] text-[var(--color-brand-bg)] font-bold rounded-lg hover:opacity-80 transition-opacity">
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
