/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LegalModals } from './components/LegalModals';
import { Home } from './pages/Home';
import { Checklist } from './pages/Checklist';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen selection:bg-[var(--color-brand-red)] selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <LegalModals />
      </div>
    </BrowserRouter>
  );
}

