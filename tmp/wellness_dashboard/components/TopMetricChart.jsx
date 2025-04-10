import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { wellnessData } from "../data/wellnessData";
import "./TopMetricChart.css";

export default function TopMetricChart({ metric }) {
  const chartData = Object.entries(wellnessData.countries)
    .map(([name, values]) => ({ name, value: values[metric] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">
        Top 5 Countries by {metric.charAt(0).toUpperCase() + metric.slice(1)}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis type="number" domain={[0, 100]} stroke="#ccc" />
          <YAxis type="category" dataKey="name" stroke="#ccc" />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}