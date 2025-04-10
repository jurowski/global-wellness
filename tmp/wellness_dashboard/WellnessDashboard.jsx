import GlobeComponent from "./components/GlobeComponent";
import TopMetricChart from "./components/TopMetricChart";
import { useState } from "react";
import "./WellnessDashboard.css";

export default function WellnessDashboard() {
  const [currentMetric, setCurrentMetric] = useState("happiness");

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <GlobeComponent onMetricChange={setCurrentMetric} />
        </div>
        <div className="dashboard-panel">
          <TopMetricChart metric={currentMetric} />
        </div>
      </div>
    </div>
  );
}