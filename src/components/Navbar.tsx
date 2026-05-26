import { Flame, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        setIsLight(true);
      }
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-brand-charcoal-light)] rounded-xl border border-white/10">
            <Flame className="w-6 h-6 text-[var(--color-brand-red)] animate-heartbeat" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">WebBlaze</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Toggle theme"
          >
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <a href="#hero" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Audit</a>
          <a href="#hall-of-fame" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Hall of Fame</a>
          <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</a>
          <button className="px-5 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Sign In
          </button>
        </div>

        <button 
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[var(--color-brand-charcoal)] border-b border-white/5 p-6 flex flex-col gap-4 shadow-2xl">
          <a href="#hero" className="text-lg font-medium text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Audit</a>
          <a href="#hall-of-fame" className="text-lg font-medium text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Hall of Fame</a>
          <a href="#pricing" className="text-lg font-medium text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Pricing</a>
          <button className="mt-4 w-full px-5 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
