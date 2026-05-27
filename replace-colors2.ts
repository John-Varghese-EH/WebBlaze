import fs from 'fs';
const files = ['src/components/Hero.tsx', 'src/components/ScoreCard.tsx', 'src/components/HallOfFame.tsx', 'src/components/Navbar.tsx'];

for(const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/text-white/g, 'text-[var(--color-brand-text)]');
  content = content.replace(/text-gray-400/g, 'text-[var(--color-brand-muted)]');
  content = content.replace(/text-gray-300/g, 'text-[var(--color-brand-muted)]');
  content = content.replace(/text-gray-500/g, 'text-[var(--color-brand-muted)]');
  content = content.replace(/text-gray-600/g, 'text-[var(--color-brand-muted)]');
  content = content.replace(/border-white\/5/g, 'border-[var(--color-brand-border-strong)]');
  content = content.replace(/border-white\/10/g, 'border-[var(--color-brand-border-strong)]');
  content = content.replace(/border-white\/20/g, 'border-[var(--color-brand-border-strong)]');
  content = content.replace(/bg-white\/5/g, 'bg-[var(--color-brand-charcoal-light)]');
  content = content.replace(/bg-white\/10/g, 'bg-[var(--color-brand-border-strong)]');

  fs.writeFileSync(file, content);
}
console.log('Replaced colors in other components');
