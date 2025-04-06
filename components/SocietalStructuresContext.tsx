'use client';

import React, { createContext, useContext, useState } from 'react';

interface SocietalStructure {
  id: string;
  name: string;
  description: string;
}

interface SocietalStructuresContextType {
  structures: SocietalStructure[];
  selectedStructures: string[];
  setSelectedStructures: (structures: string[]) => void;
}

const SocietalStructuresContext = createContext<SocietalStructuresContextType>({
  structures: [],
  selectedStructures: [],
  setSelectedStructures: () => {},
});

export const useSocietalStructures = () => useContext(SocietalStructuresContext);

export const SocietalStructuresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStructures, setSelectedStructures] = useState<string[]>([]);

  const structures: SocietalStructure[] = [
    {
      id: 'capitalism',
      name: 'Capitalism',
      description: 'Market-based economic system with private ownership',
    },
    {
      id: 'socialism',
      name: 'Socialism',
      description: 'Economic system with collective ownership and distribution',
    },
    {
      id: 'mixed',
      name: 'Mixed Economy',
      description: 'Combination of market and government intervention',
    },
  ];

  const value = {
    structures,
    selectedStructures,
    setSelectedStructures,
  };

  return (
    <SocietalStructuresContext.Provider value={value}>
      {children}
    </SocietalStructuresContext.Provider>
  );
}; 