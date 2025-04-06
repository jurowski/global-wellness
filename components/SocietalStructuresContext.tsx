'use client';

import React, { createContext, useContext, useState } from 'react';

interface SocietalStructure {
  id: string;
  name: string;
  description: string;
  impact: string;
  sources: string[];
}

interface SocietalStructuresContextType {
  structures: SocietalStructure[];
  selectedStructures: string[];
  setSelectedStructures: (structures: string[]) => void;
}

const defaultStructures: SocietalStructure[] = [
  {
    id: 'education_system',
    name: 'Education System',
    description: 'The formal and informal systems of learning and knowledge transfer',
    impact: 'Directly influences cognitive development, social mobility, and economic opportunities',
    sources: [
      'UNESCO Global Education Monitoring Report',
      'OECD Education at a Glance',
    ],
  },
  {
    id: 'healthcare_access',
    name: 'Healthcare Access',
    description: 'The availability and accessibility of medical care and health services',
    impact: 'Affects physical and mental well-being, life expectancy, and quality of life',
    sources: [
      'WHO Global Health Observatory',
      'World Bank Health Statistics',
    ],
  },
  {
    id: 'social_support',
    name: 'Social Support Systems',
    description: 'Networks and institutions providing community and individual support',
    impact: 'Influences mental health, resilience, and social cohesion',
    sources: [
      'World Happiness Report',
      'OECD Better Life Index',
    ],
  },
  {
    id: 'work_life_balance',
    name: 'Work-Life Balance',
    description: 'The relationship between professional and personal life',
    impact: 'Affects stress levels, family relationships, and overall life satisfaction',
    sources: [
      'ILO Working Conditions Reports',
      'OECD Work-Life Balance Index',
    ],
  },
];

const SocietalStructuresContext = createContext<SocietalStructuresContextType | undefined>(undefined);

interface SocietalStructuresProviderProps {
  children: React.ReactNode;
}

export function SocietalStructuresProvider({ children }: SocietalStructuresProviderProps) {
  const [selectedStructures, setSelectedStructures] = useState([]);

  const value = {
    structures: defaultStructures,
    selectedStructures,
    setSelectedStructures,
  };

  return (
    <SocietalStructuresContext.Provider value={value}>
      {children}
    </SocietalStructuresContext.Provider>
  );
}

export function useSocietalStructures() {
  const context = useContext(SocietalStructuresContext);
  if (context === undefined) {
    throw new Error('useSocietalStructures must be used within a SocietalStructuresProvider');
  }
  return context;
} 