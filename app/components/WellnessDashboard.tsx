import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import TopMetricChart from "./TopMetricChart";
import "./WellnessDashboard.css";

// Dynamically import GlobeComponent with ssr: false
const GlobeComponentWithNoSSR = dynamic(
  () => import('./GlobeComponent'),
  { ssr: false }
);

export default function WellnessDashboard() {
  const [currentMetric, setCurrentMetric] = useState("happiness");

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <GlobeComponentWithNoSSR onMetricChange={setCurrentMetric} />
        </div>
        <div className="dashboard-panel">
          <TopMetricChart metric={currentMetric} />
        </div>
      </div>
    </div>
  );
}