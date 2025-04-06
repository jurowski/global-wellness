export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[var(--background-dark)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl sm:tracking-tight lg:text-6xl mb-8">
          Thank You for Your Support!
        </h1>
        
        <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-8 mb-8">
          <p className="text-xl text-[var(--text-secondary)] mb-6">
            Your monthly donation will help fund clean water projects and tools for neurodivergent individuals.
          </p>
          
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)]">
              You'll receive a confirmation email with your donation details.
            </p>
            <p className="text-[var(--text-secondary)]">
              If you have any questions, please contact us at support@globalwell.org
            </p>
          </div>
        </div>

        <a
          href="/"
          className="inline-block bg-[var(--accent-primary)] text-white py-3 px-6 rounded-lg hover:bg-[var(--accent-secondary)] transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
} 