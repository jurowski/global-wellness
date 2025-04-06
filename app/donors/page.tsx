'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/stripe-js/react';
import { CheckoutForm } from '@/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function DonorsPage() {
  const [donationAmount, setDonationAmount] = useState(10);

  return (
    <div className="min-h-screen bg-[var(--background-dark)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl sm:tracking-tight lg:text-6xl">
            Support Global Wellness
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-[var(--text-secondary)]">
            Your monthly donation helps fund clean water projects and tools for neurodivergent individuals.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Where Your Donation Goes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-[var(--background-light)] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Water.org Projects</h3>
              <p className="text-[var(--text-secondary)]">
                Your donation helps provide access to clean water and sanitation in communities around the world.
              </p>
            </div>
            
            <div className="bg-[var(--background-light)] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Lighthouse Apps</h3>
              <p className="text-[var(--text-secondary)]">
                Supporting the development of tools that help neurodivergent individuals thrive in their daily lives.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Monthly Donation Amount</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDonationAmount(10)}
                className={`px-4 py-2 rounded-lg ${
                  donationAmount === 10
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--background-light)] text-[var(--text-primary)]'
                }`}
              >
                $10
              </button>
              <button
                onClick={() => setDonationAmount(25)}
                className={`px-4 py-2 rounded-lg ${
                  donationAmount === 25
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--background-light)] text-[var(--text-primary)]'
                }`}
              >
                $25
              </button>
              <button
                onClick={() => setDonationAmount(50)}
                className={`px-4 py-2 rounded-lg ${
                  donationAmount === 50
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--background-light)] text-[var(--text-primary)]'
                }`}
              >
                $50
              </button>
              <div className="flex items-center">
                <span className="text-[var(--text-primary)] mr-2">$</span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-20 px-2 py-2 rounded-lg bg-[var(--background-light)] text-[var(--text-primary)]"
                  min="1"
                />
              </div>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm donationAmount={donationAmount} />
          </Elements>
        </div>

        <div className="text-center text-[var(--text-secondary)]">
          <p className="mb-4">Your donation is tax-deductible to the extent allowed by law.</p>
          <p>Questions? Contact us at support@globalwell.org</p>
        </div>
      </div>
    </div>
  );
} 