'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  donationAmount: number;
}

export function CheckoutForm({ donationAmount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount * 100, // Convert to cents
        }),
      });

      const { clientSecret } = await response.json();

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donors/thank-you`,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred while processing your donation');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-[var(--accent-primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Donate $${donationAmount}/month`}
      </button>
    </form>
  );
} 