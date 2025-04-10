// components/GlobeComponent.tsx
import { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";
import { wellnessData } from "../lib/wellnessData";
import "./GlobeComponent.css";

interface CountryPoint {
  name: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  [key: string]: any;
}

interface GlobeProps {
  onMetricChange: (metric: string) => void;
}

export default function GlobeComponent({ onMetricChange }: GlobeProps) {
  const globeEl = useRef<any>(null);
  const [countries, setCountries] = useState<CountryPoint[]>([]);

  useEffect(() => {
    const entries = Object.entries(wellnessData.countries);
    const data: CountryPoint[] = entries.map(([country, values], i) => ({
      name: country,
      lat: 20 + i * 15, // TODO: Replace with real lat/lng from data
      lng: -80 + i * 20, // TODO: Replace with real lat/lng from data
      ...values,
      size: values.happiness / 10,
      color: `rgba(0, 255, 255, ${values.happiness / 100})`,
    }));
    setCountries(data);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().distance = 1600;
      globeEl.current.controls().enableZoom = false;
    }
  }, [countries]);

  return (
    <div className="h-[400px]">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={countries}
        pointLat={(d: object) => (d as CountryPoint).lat}
        pointLng={(d: object) => (d as CountryPoint).lng}
        pointAltitude={(d: object) => (d as CountryPoint).size / 10}
        pointColor={(d: object) => (d as CountryPoint).color}
        pointRadius={(d: object) => (d as CountryPoint).size * 0.4}
        onPointClick={(point: object) => {
          const countryPoint = point as CountryPoint;
          console.log('Clicked point:', countryPoint);
        }}
      />
    </div>
  );
}
