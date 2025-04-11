import React, { useEffect, useRef } from 'react';
import { getCountryCoordinates } from '../utils/countryCoordinates';
import Globe from 'react-globe.gl';

interface MiniGlobeProps {
  selectedCountries: string[];
}

const MiniGlobe: React.FC<MiniGlobeProps> = ({ selectedCountries }) => {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    console.log('Selected countries for MiniGlobe:', selectedCountries);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.pointOfView({ altitude: 2 }, 1000);
    }
  }, [selectedCountries]);

  const markers = selectedCountries.map(country => {
    const coordinates = getCountryCoordinates(country);
    if (!coordinates) return null;
    const { lat, long } = coordinates;
    return { lat, lng: long, size: 0.5, color: '#ff5722' };
  }).filter(marker => marker !== null) as object[];

  return (
    <div className="mini-globe">
      <Globe
        ref={globeRef}
        width={25}
        height={25}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        pointsData={markers}
        pointAltitude="size"
        pointColor="color"
      />
    </div>
  );
};

export default MiniGlobe; 