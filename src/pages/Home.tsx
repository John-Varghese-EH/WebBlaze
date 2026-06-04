import { Hero } from '../components/Hero';
import { HallOfFame } from '../components/HallOfFame';
import { AuditHistory } from '../components/AuditHistory';

export function Home() {
  return (
    <>
      <main>
        <Hero />
        <HallOfFame />
      </main>
      <AuditHistory />
    </>
  );
}
