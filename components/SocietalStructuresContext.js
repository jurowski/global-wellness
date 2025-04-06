import { createContext, useContext, useState } from 'react';

const SocietalStructuresContext = createContext();

export function SocietalStructuresProvider({ children }) {
  const [selectedCountries, setSelectedCountries] = useState(['USA', 'Finland', 'Japan', 'Germany', 'Costa Rica']);
  const [selectedMetrics, setSelectedMetrics] = useState(['happiness', 'healthcare', 'education', 'work_life']);

  return (
    <SocietalStructuresContext.Provider
      value={{
        selectedCountries,
        setSelectedCountries,
        selectedMetrics,
        setSelectedMetrics
      }}
    >
      {children}
    </SocietalStructuresContext.Provider>
  );
}

export function useSocietalStructures() {
  const context = useContext(SocietalStructuresContext);
  if (!context) {
    throw new Error('useSocietalStructures must be used within a SocietalStructuresProvider');
  }
  return context;
}

export default SocietalStructuresContext; 