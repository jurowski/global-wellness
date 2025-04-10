import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { StateData } from '../types/state';

interface MetricBarChartProps {
  data: StateData[];
  metrics: { id: string; label: string; color: string }[];
}

const MetricBarChart: React.FC<MetricBarChartProps> = ({ data, metrics }) => {
  const chartData = data.map(state => {
    const result: any = { 
      name: state.name,
      stateCode: state.stateCode
    };
    
    metrics.forEach(metric => {
      const metricData = state[metric.id as keyof StateData];
      if (typeof metricData === 'object' && metricData !== null) {
        result[metric.id] = (metricData as any).value || 0;
        result[`${metric.id}_isReal`] = (metricData as any).isRealData || false;
        result[`${metric.id}_data`] = metricData;
      }
    });

    return result;
  });

  const formatXAxis = (value: string, index: number) => {
    const state = chartData[index];
    // If there are more than 3 states being compared or name length > 10, use abbreviations
    return (data.length > 3 || state.name.length > 10) ? state.stateCode : state.name;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const stateData = data.find(state => state.name === label);
      const displayName = stateData ? `${stateData.name} (${stateData.stateCode})` : label;

      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm">
          <p className="font-semibold text-lg mb-2">{displayName}</p>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.id === entry.dataKey);
            const value = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
            const metricData = entry.payload[entry.dataKey + '_data'];
            const isRealData = entry.payload[`${entry.dataKey}_isReal`];

            return (
              <div key={index} className="mb-3 last:mb-0">
                <div style={{ color: entry.color }} className="font-medium">
                  {metric?.label}: {value}
                  {!isRealData && (
                    <span className="ml-2 text-yellow-400 text-sm">(Simulated Data)</span>
                  )}
                </div>
                {metricData && (
                  <div className="text-sm text-gray-300 mt-1">
                    <div>Year: {metricData.year}</div>
                    <div>Source: {metricData.source}</div>
                    {metricData.confidenceInterval && (
                      <div>Confidence Interval: ±{metricData.confidenceInterval}</div>
                    )}
                    {metricData.category && (
                      <div>Category: {metricData.category}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom label for state names that will render once per state
  const CustomStateNameLabel = ({ x, y, width, viewBox, payload, index }: any) => {
    // Only render for the first bar of each state
    const stateIndex = Math.floor(index / metrics.length);
    
    // Skip labels that aren't the first metric for each state
    if (index % metrics.length !== 0) return null;
    
    // Find all bars for this state to calculate center position
    const stateBarCount = metrics.length;
    const totalStateWidth = stateBarCount * width;
    const firstBarX = x;
    const centerX = firstBarX + (totalStateWidth / 2) - (width / 2);
    
    return (
      <text
        x={centerX}
        y={y - 60}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255, 255, 255, 0.8)"
        fontWeight="medium"
        fontSize="20"
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth="0.5"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 60, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={formatXAxis}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            domain={[0, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* State names rendered above all bars */}
          {chartData.map((entry, stateIndex) => {
            // Get the first Bar to be rendered for a state
            const firstMetric = metrics[0];
            
            // Calculate starting position for this state's group of bars
            const barWidth = 100 / (chartData.length * metrics.length);
            const stateStartPosition = stateIndex * (barWidth * metrics.length);
            
            // Calculate middle of all the bars for this state
            const stateWidth = barWidth * metrics.length;
            const stateCenterPosition = stateStartPosition + (stateWidth / 2);
            
            return (
              <text
                key={`state-name-${stateIndex}`}
                x={`${stateCenterPosition}%`}
                y={27}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255, 255, 255, 0.8)"
                fontWeight="medium"
                fontSize="20"
                stroke="rgba(0, 0, 0, 0.3)"
                strokeWidth="0.5"
              >
                {entry.name}
              </text>
            );
          })}
          
          {metrics.map((metric) => (
            <Bar
              key={metric.id}
              dataKey={metric.id}
              name={metric.label}
              fill={metric.color}
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                content: (props: any) => {
                  const { x, y, width, height, value } = props;
                  const valueText = value.toFixed(1);
                  
                  // Calculate font size based on width with 2px padding on each side
                  // Approximate width of a digit is 0.6 * fontSize
                  const availableWidth = width - 4; // 2px padding on each side
                  const characterCount = valueText.length;
                  const baseFontSize = 44; // Original font size
                  
                  // Calculate a font size that will fit the text within the width
                  // With approximately 0.6 * fontSize pixels per character
                  const calculatedFontSize = Math.min(
                    baseFontSize,
                    availableWidth / (characterCount * 0.6)
                  );
                  
                  return (
                    <text
                      x={x + width / 2}
                      y={y - 17}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(255, 255, 255, 0.5)"
                      fontWeight="bold"
                      fontSize={calculatedFontSize}
                      stroke="rgba(0, 0, 0, 0.5)"
                      strokeWidth="0.75"
                    >
                      {valueText}
                    </text>
                  );
                }
              }}
            >
              {/* Add vertical category label inside the bar */}
              <LabelList
                dataKey={metric.id}
                position="center"
                content={(props: any) => {
                  const { x, y, width, height, value } = props;
                  
                  // Only show label if there's enough height for it
                  if (height < 50) return null;
                  
                  // Calculate font size based on width with padding
                  // Start with base size and adjust if needed
                  const baseFontSize = 120; // Significantly increased from 52 to 120
                  
                  // Scale font size based on number of metrics - fewer metrics means larger text
                  const metricsScaleFactor = Math.max(1.5, 3 - (metrics.length * 0.2));
                  
                  // Additional scaling factor based on total number of states being compared
                  // When comparing 3-4 states, we'll boost the font size to make labels more readable
                  const stateCount = chartData.length; 
                  const stateScaleFactor = stateCount <= 2 ? 1.0 : 
                                          stateCount <= 4 ? 1.5 : 1.0;
                  
                  // Extra scaling for when many metrics are selected (3-5 metrics)
                  // This specifically increases font size for multi-metric comparisons by 3x
                  const multiMetricScaleFactor = (metrics.length >= 3 && metrics.length <= 5) ? 3.0 : 1.0;
                  
                  const scaledBaseFontSize = baseFontSize * metricsScaleFactor * stateScaleFactor * multiMetricScaleFactor;
                  
                  // Use 85% of the width as maximum space for text (increased from 80%)
                  const availableWidth = width * 0.85;
                  // Adjust the character width constraints to allow larger fonts to fit
                  const labelLength = metric.label.length;
                  const calculatedFontSize = Math.min(
                    scaledBaseFontSize,
                    availableWidth / (labelLength * 0.45), // Reduced from 0.5 to allow larger fonts
                    height / (labelLength * 0.6)  // Reduced from 0.65 to allow larger fonts
                  );

                  // Ensure 10px padding when there is only one column per state
                  const padding = metrics.length === 1 ? 10 : 2;
                  const adjustedWidth = width - (2 * padding);
                  const adjustedFontSize = Math.min(
                    calculatedFontSize,
                    adjustedWidth / (labelLength * 0.45)
                  );
                  
                  return (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(255, 255, 255, 0.9)"
                      fontSize={adjustedFontSize}
                      fontWeight="bold"
                      transform={`rotate(-90, ${x + width / 2}, ${y + height / 2})`}
                    >
                      {metric.label}
                    </text>
                  );
                }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricBarChart; 