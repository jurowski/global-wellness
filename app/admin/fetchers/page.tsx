import DataFetcherStatus from '../../components/DataFetcherStatus';

export default function FetcherStatusPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Data Fetcher Management</h1>
      <DataFetcherStatus />
    </div>
  );
} 