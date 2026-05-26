/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HallOfFame } from './components/HallOfFame';
import { Footer } from './components/Footer';
import { AuditHistory } from './components/AuditHistory';

export default function App() {
  return (
    <div className="min-h-screen selection:bg-[var(--color-brand-red)] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <HallOfFame />
      </main>
      <AuditHistory />
      <Footer />
    </div>
  );
}

