import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WellnessInsights({ data, metrics }) {
  if (!data || !data.metrics) return null;

  // Transform historical data for the chart
  const getHistoricalData = (metricId) => {
    if (!data.historicalData || !data.historicalData[metricId]) return [];
    
    const years = [2010, 2015, 2020];
    return years.map(year => {
      const yearData = { year };
      data.countries.forEach(country => {
        if (data.historicalData[metricId][country] && data.historicalData[metricId][country][year]) {
          yearData[country] = data.historicalData[metricId][country][year];
        }
      });
      return yearData;
    });
  };

  // Get colors for each country
  const getCountryColor = (country) => {
    const colors = {
      'USA': '#1f77b4',
      'Finland': '#ff7f0e',
      'Japan': '#2ca02c',
      'Germany': '#d62728',
      'Costa Rica': '#9467bd',
      'Sweden': '#8c564b',
      'Norway': '#e377c2',
      'Denmark': '#7f7f7f',
      'Canada': '#bcbd22',
      'New Zealand': '#17becf',
      'Iceland': '#aec7e8',
      'Netherlands': '#ffbb78',
      'Switzerland': '#98df8a',
      'Australia': '#ff9896',
      'Singapore': '#c5b0d5'
    };
    return colors[country] || '#000000';
  };

  return (
    <div className="space-y-8">
      {Object.entries(data.metrics).map(([metricId, countryValues]) => {
        const metric = metrics.find(m => m.id === metricId);
        if (!metric) return null;

        const historicalData = getHistoricalData(metricId);

        return (
          <div key={metricId} className="card p-6">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{metric.name}</h3>
            <p className="text-[var(--text-secondary)] mb-6">{metric.description}</p>
            
            {/* Current Values Table */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-[var(--text-primary)] mb-4">Current Values</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--border-color)]">
                  <thead className="bg-[var(--background-light)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Quality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {Object.entries(countryValues).map(([country, value]) => (
                      <tr key={country} className="hover:bg-[var(--background-light)] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">{country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">{value.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-[var(--background-light)] rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-[var(--text-secondary)]">
                              {(metric.dataQuality.reliability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historical Trend Chart */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-[var(--text-primary)] mb-4">Historical Trend (2010-2020)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    {data.countries.map(country => (
                      <Line
                        key={country}
                        type="monotone"
                        dataKey={country}
                        stroke={getCountryColor(country)}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[var(--background-light)] p-4 rounded-lg">
              <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">Data Quality Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Source:</span> {metric.source}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Citation:</span> {metric.citation}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Sample Size:</span> {metric.dataQuality.sampleSize}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Update Frequency:</span> {metric.dataQuality.updateFrequency}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Confidence Interval:</span> ±{metric.dataQuality.confidenceInterval}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Methodology:</span> {metric.dataQuality.methodology}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 