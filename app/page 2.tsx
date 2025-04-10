'use client';

import WellnessData from './components/WellnessData';
import CountryComparison from './components/CountryComparison';

export default function Home() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold mb-8">Global Wellness Countries</h1>
        <CountryComparison />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8">Wellness Data Explorer</h2>
        <WellnessData />
      </section>
    </div>
  );
} 