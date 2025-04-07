'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  donationAmount: number;
}

export function CheckoutForm({ donationAmount }: CheckoutFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred');
        setProcessing(false);
        return;
      }

      // Here you would typically send the paymentMethod.id to your backend
      // to create a subscription or one-time payment
      console.log('Payment method created:', paymentMethod.id);
      
      // For now, we'll just show a success message
      alert('Thank you for your donation!');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-[var(--background-light)] p-4 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: 'var(--text-primary)',
                '::placeholder': {
                  color: 'var(--text-secondary)',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-lg font-medium ${
          processing || !stripe
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-dark)]'
        } text-white`}
      >
        {processing ? 'Processing...' : `Donate $${donationAmount}/month`}
      </button>
    </form>
  );
} 