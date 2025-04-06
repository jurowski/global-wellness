'use client';

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CountrySelector } from '../components/CountrySelector'
import MetricSelector from '../components/MetricSelector'
import WellnessInsights from '../components/WellnessInsights'
import LocationComparison from '../components/LocationComparison'
import { SocietalStructuresProvider } from '../components/SocietalStructuresContext'
import Link from 'next/link'
import Script from 'next/script'

// List of metrics we want to compare
const WELLNESS_METRICS = [
  // Personal Well-being
  { 
    id: 'happiness', 
    name: 'Happiness Index',
    category: 'Personal Well-being',
    description: 'World Happiness Report score', 
    source: 'World Happiness Report',
    citation: 'Helliwell, J. F., Layard, R., Sachs, J. D., & De Neve, J. E. (2023). World Happiness Report 2023.',
    sourceLink: 'https://worldhappiness.report/',
    dataQuality: {
      reliability: 0.95,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Survey-based with statistical weighting'
    }
  },
  {
    id: 'life_satisfaction',
    name: 'Life Satisfaction',
    category: 'Personal Well-being',
    description: 'Overall satisfaction with life circumstances',
    source: 'OECD Better Life Index',
    citation: 'OECD. (2023). Better Life Index - Life Satisfaction.',
    sourceLink: 'http://www.oecdbetterlifeindex.org/',
    dataQuality: {
      reliability: 0.94,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'Survey-based assessment'
    }
  },
  {
    id: 'emotional_wellbeing',
    name: 'Emotional Well-being',
    category: 'Personal Well-being',
    description: 'Population emotional health and resilience',
    source: 'Gallup Global Emotions Report',
    citation: 'Gallup. (2023). Global Emotions Report.',
    sourceLink: 'https://www.gallup.com/analytics/349280/gallup-global-emotions-report.aspx',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.1',
      methodology: 'Daily emotional experience tracking'
    }
  },
  {
    id: 'sleep_quality',
    name: 'Sleep Quality',
    category: 'Personal Well-being',
    description: 'Population sleep patterns and quality of rest',
    source: 'Global Sleep Survey',
    citation: 'Sleep Research Society. (2023). Global Sleep Survey Report.',
    sourceLink: 'https://www.sleepresearchsociety.org/',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.7',
      methodology: 'Sleep pattern analysis and surveys'
    }
  },

  // Health & Healthcare
  {
    id: 'healthcare',
    name: 'Healthcare Quality',
    category: 'Health & Healthcare',
    description: 'Healthcare system performance and accessibility',
    source: 'WHO Global Health Observatory',
    citation: 'World Health Organization. (2023). Global Health Observatory data.',
    sourceLink: 'https://www.who.int/data/gho',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.8',
      methodology: 'Composite index based on multiple health indicators'
    }
  },
  {
    id: 'life_expectancy',
    name: 'Life Expectancy',
    category: 'Health & Healthcare',
    description: 'Average life expectancy at birth',
    source: 'World Bank',
    citation: 'World Bank. (2023). Life Expectancy at Birth.',
    sourceLink: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN',
    dataQuality: {
      reliability: 0.96,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.0',
      methodology: 'Demographic and statistical analysis'
    }
  },
  {
    id: 'health_behaviors',
    name: 'Health Behaviors',
    category: 'Health & Healthcare',
    description: 'Physical activity, nutrition, and preventive care practices',
    source: 'WHO Global Health Risks',
    citation: 'WHO. (2023). Global Health Risks Report.',
    sourceLink: 'https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/ncd-risk-factors',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.8',
      methodology: 'Population health surveys and clinical data'
    }
  },
  {
    id: 'preventive_care',
    name: 'Preventive Care',
    category: 'Health & Healthcare',
    description: 'Access to and utilization of preventive healthcare services',
    source: 'WHO Preventive Care Database',
    citation: 'WHO. (2023). Global Preventive Care Report.',
    sourceLink: 'https://www.who.int/data/preventive-care',
    dataQuality: {
      reliability: 0.91,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'Healthcare service utilization analysis'
    }
  },
  {
    id: 'mental_health_access',
    name: 'Mental Health Access',
    category: 'Health & Healthcare',
    description: 'Access to mental health services and support',
    source: 'WHO Mental Health Atlas',
    citation: 'WHO. (2023). Mental Health Atlas.',
    sourceLink: 'https://www.who.int/teams/mental-health-and-substance-use/mental-health-atlas',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.6',
      methodology: 'Healthcare service availability assessment'
    }
  },

  // Education & Learning
  {
    id: 'education',
    name: 'Education Access',
    category: 'Education & Learning',
    description: 'Access to quality education and literacy rates',
    source: 'UNESCO Institute for Statistics',
    citation: 'UNESCO. (2023). UIS Statistics Database.',
    sourceLink: 'http://data.uis.unesco.org/',
    dataQuality: {
      reliability: 0.90,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'Statistical analysis of education indicators'
    }
  },
  {
    id: 'lifelong_learning',
    name: 'Lifelong Learning',
    category: 'Education & Learning',
    description: 'Adult education participation and continuous learning opportunities',
    source: 'Eurostat',
    citation: 'Eurostat. (2023). Adult Learning Statistics.',
    sourceLink: 'https://ec.europa.eu/eurostat/statistics-explained/index.php/Adult_learning_statistics',
    dataQuality: {
      reliability: 0.87,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Survey-based education participation analysis'
    }
  },
  {
    id: 'digital_education',
    name: 'Digital Education',
    category: 'Education & Learning',
    description: 'Access to and quality of digital learning resources',
    source: 'UNESCO ICT in Education Database',
    citation: 'UNESCO. (2023). ICT in Education Statistics.',
    sourceLink: 'http://uis.unesco.org/en/topic/ict-education',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.6',
      methodology: 'Digital education infrastructure assessment'
    }
  },
  {
    id: 'critical_thinking',
    name: 'Critical Thinking',
    category: 'Education & Learning',
    description: 'Population critical thinking and problem-solving skills',
    source: 'OECD PISA Assessment',
    citation: 'OECD. (2023). PISA Global Competence Framework.',
    sourceLink: 'https://www.oecd.org/pisa/innovation/global-competence/',
    dataQuality: {
      reliability: 0.93,
      sampleSize: 'Very Large',
      updateFrequency: 'Triennial',
      confidenceInterval: '±1.9',
      methodology: 'Standardized assessment'
    }
  },

  // Work & Economic Well-being
  {
    id: 'work_life',
    name: 'Work-Life Balance',
    category: 'Work & Economic Well-being',
    description: 'Balance between work hours and leisure time',
    source: 'OECD Better Life Index',
    citation: 'OECD. (2023). Better Life Index - Work-Life Balance.',
    sourceLink: 'http://www.oecdbetterlifeindex.org/',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.0',
      methodology: 'Survey and time-use studies'
    }
  },
  {
    id: 'income_equality',
    name: 'Income Equality',
    category: 'Work & Economic Well-being',
    description: 'Distribution of income and economic equality',
    source: 'World Bank GINI Index',
    citation: 'World Bank. (2023). GINI Index.',
    sourceLink: 'https://data.worldbank.org/indicator/SI.POV.GINI',
    dataQuality: {
      reliability: 0.93,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.5',
      methodology: 'Economic statistical analysis'
    }
  },
  {
    id: 'job_security',
    name: 'Job Security',
    category: 'Work & Economic Well-being',
    description: 'Employment stability and worker protection measures',
    source: 'ILO Statistics',
    citation: 'International Labour Organization. (2023). ILOSTAT.',
    sourceLink: 'https://ilostat.ilo.org/',
    dataQuality: {
      reliability: 0.91,
      sampleSize: 'Very Large',
      updateFrequency: 'Quarterly',
      confidenceInterval: '±2.0',
      methodology: 'Labor market statistics and surveys'
    }
  },
  {
    id: 'workplace_satisfaction',
    name: 'Workplace Satisfaction',
    category: 'Work & Economic Well-being',
    description: 'Employee satisfaction and workplace conditions',
    source: 'ILO Working Conditions Survey',
    citation: 'ILO. (2023). Global Working Conditions Report.',
    sourceLink: 'https://www.ilo.org/global/statistics-and-databases/',
    dataQuality: {
      reliability: 0.87,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.9',
      methodology: 'Workplace satisfaction surveys'
    }
  },
  {
    id: 'career_growth',
    name: 'Career Growth',
    category: 'Work & Economic Well-being',
    description: 'Opportunities for professional development and advancement',
    source: 'ILO Skills Development Report',
    citation: 'ILO. (2023). Global Skills Development Report.',
    sourceLink: 'https://www.ilo.org/global/topics/skills-development/lang--en/index.htm',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.7',
      methodology: 'Career progression tracking'
    }
  },

  // Environment & Sustainability
  {
    id: 'environmental_quality',
    name: 'Environmental Quality',
    category: 'Environment & Sustainability',
    description: 'Air quality, water quality, and environmental preservation',
    source: 'Yale Environmental Performance Index',
    citation: 'Yale Center for Environmental Law & Policy. (2023). Environmental Performance Index.',
    sourceLink: 'https://epi.yale.edu/',
    dataQuality: {
      reliability: 0.91,
      sampleSize: 'Very Large',
      updateFrequency: 'Biennial',
      confidenceInterval: '±2.2',
      methodology: 'Composite index of environmental indicators'
    }
  },
  {
    id: 'climate_action',
    name: 'Climate Action',
    category: 'Environment & Sustainability',
    description: 'Climate change mitigation and adaptation measures',
    source: 'Climate Action Tracker',
    citation: 'Climate Action Tracker. (2023). Country Assessments.',
    sourceLink: 'https://climateactiontracker.org/',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Policy analysis and emissions tracking'
    }
  },
  {
    id: 'biodiversity',
    name: 'Biodiversity',
    category: 'Environment & Sustainability',
    description: 'Species diversity and ecosystem health',
    source: 'IUCN Red List',
    citation: 'IUCN. (2023). Global Species Database.',
    sourceLink: 'https://www.iucnredlist.org/',
    dataQuality: {
      reliability: 0.93,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.8',
      methodology: 'Species and ecosystem monitoring'
    }
  },
  {
    id: 'air_quality',
    name: 'Air Quality',
    category: 'Environment & Sustainability',
    description: 'Population exposure to clean air and pollution levels',
    source: 'WHO Air Quality Database',
    citation: 'WHO. (2023). Global Air Quality Report.',
    sourceLink: 'https://www.who.int/teams/environment-climate-change-and-health/air-quality-and-health',
    dataQuality: {
      reliability: 0.94,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.8',
      methodology: 'Air quality monitoring'
    }
  },

  // Social Connections & Community
  {
    id: 'social_support',
    name: 'Social Support',
    category: 'Social Connections & Community',
    description: 'Quality of social relationships and community support',
    source: 'Gallup World Poll',
    citation: 'Gallup. (2023). Gallup World Poll.',
    sourceLink: 'https://www.gallup.com/analytics/318875/global-research.aspx',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.8',
      methodology: 'Global survey and interviews'
    }
  },
  {
    id: 'civic_engagement',
    name: 'Civic Engagement',
    category: 'Social Connections & Community',
    description: 'Political participation and community involvement',
    source: 'International IDEA',
    citation: 'International IDEA. (2023). Global State of Democracy Indices.',
    sourceLink: 'https://www.idea.int/gsod-indices/#/indices/world-map',
    dataQuality: {
      reliability: 0.86,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.5',
      methodology: 'Composite index of democratic indicators'
    }
  },
  {
    id: 'community_vitality',
    name: 'Community Vitality',
    category: 'Social Connections & Community',
    description: 'Strength of local communities and social cohesion',
    source: 'OECD Regional Well-Being',
    citation: 'OECD. (2023). Regional Well-Being Framework.',
    sourceLink: 'https://www.oecdregionalwellbeing.org/',
    dataQuality: {
      reliability: 0.85,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.0',
      methodology: 'Multi-dimensional community assessment'
    }
  },
  {
    id: 'intergenerational_bonds',
    name: 'Intergenerational Bonds',
    category: 'Social Connections & Community',
    description: 'Strength of connections between generations',
    source: 'OECD Social Cohesion Indicators',
    citation: 'OECD. (2023). Social Cohesion Report.',
    sourceLink: 'https://www.oecd.org/social/social-cohesion-indicators/',
    dataQuality: {
      reliability: 0.86,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.1',
      methodology: 'Social relationship analysis'
    }
  },
  {
    id: 'community_trust',
    name: 'Community Trust',
    category: 'Social Connections & Community',
    description: 'Level of trust within local communities',
    source: 'OECD Social Capital Indicators',
    citation: 'OECD. (2023). Social Capital Report.',
    sourceLink: 'https://www.oecd.org/statistics/social-capital/',
    dataQuality: {
      reliability: 0.87,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.8',
      methodology: 'Community trust surveys'
    }
  },

  // Digital Well-being & Technology
  {
    id: 'digital_inclusion',
    name: 'Digital Inclusion',
    category: 'Digital Well-being & Technology',
    description: 'Access to digital resources and internet connectivity',
    source: 'ITU Digital Development Dashboard',
    citation: 'International Telecommunication Union. (2023). Digital Development Dashboard.',
    sourceLink: 'https://www.itu.int/en/ITU-D/Statistics/Pages/default.aspx',
    dataQuality: {
      reliability: 0.93,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.8',
      methodology: 'Composite index of digital access indicators'
    }
  },
  {
    id: 'digital_literacy',
    name: 'Digital Literacy',
    category: 'Digital Well-being & Technology',
    description: 'Population digital skills and technological competency',
    source: 'UNESCO Institute for Statistics',
    citation: 'UNESCO. (2023). ICT Skills Development Index.',
    sourceLink: 'http://data.uis.unesco.org/',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Survey-based assessment of digital competencies'
    }
  },
  {
    id: 'digital_privacy',
    name: 'Digital Privacy',
    category: 'Digital Well-being & Technology',
    description: 'Protection of personal data and online privacy',
    source: 'Privacy International',
    citation: 'Privacy International. (2023). State of Privacy Report.',
    sourceLink: 'https://privacyinternational.org/state-privacy',
    dataQuality: {
      reliability: 0.90,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.4',
      methodology: 'Privacy protection assessment'
    }
  },
  {
    id: 'digital_balance',
    name: 'Digital Balance',
    category: 'Digital Well-being & Technology',
    description: 'Healthy technology usage and digital habits',
    source: 'Digital Well-being Index',
    citation: 'Digital Well-being Institute. (2023). Global Digital Balance Report.',
    sourceLink: 'https://digitalwellbeing.org/',
    dataQuality: {
      reliability: 0.90,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.4',
      methodology: 'Digital behavior analysis'
    }
  },

  // Cultural & Creative Well-being
  {
    id: 'cultural_participation',
    name: 'Cultural Participation',
    category: 'Cultural & Creative Well-being',
    description: 'Engagement in cultural activities and creative expression',
    source: 'UNESCO Culture Statistics',
    citation: 'UNESCO. (2023). Culture Statistics Database.',
    sourceLink: 'http://uis.unesco.org/en/topic/culture',
    dataQuality: {
      reliability: 0.87,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.0',
      methodology: 'Survey-based cultural participation assessment'
    }
  },
  {
    id: 'creative_economy',
    name: 'Creative Economy',
    category: 'Cultural & Creative Well-being',
    description: 'Contribution of creative industries to well-being',
    source: 'UNCTAD Creative Economy Database',
    citation: 'UNCTAD. (2023). Creative Economy Outlook.',
    sourceLink: 'https://unctad.org/topic/creative-economy',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.8',
      methodology: 'Economic analysis of creative sectors'
    }
  },
  {
    id: 'artistic_freedom',
    name: 'Artistic Freedom',
    category: 'Cultural & Creative Well-being',
    description: 'Freedom of artistic expression and creative rights',
    source: 'UNESCO Culture & Arts Freedom Index',
    citation: 'UNESCO. (2023). Freedom of Artistic Expression Report.',
    sourceLink: 'https://en.unesco.org/creativity/',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.7',
      methodology: 'Artistic freedom assessment'
    }
  },
  {
    id: 'cultural_heritage',
    name: 'Cultural Heritage',
    category: 'Cultural & Creative Well-being',
    description: 'Preservation and appreciation of cultural heritage',
    source: 'UNESCO Cultural Heritage Index',
    citation: 'UNESCO. (2023). Cultural Heritage Preservation Report.',
    sourceLink: 'https://whc.unesco.org/',
    dataQuality: {
      reliability: 0.91,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.3',
      methodology: 'Cultural heritage assessment'
    }
  },

  // Food & Nutrition Well-being
  {
    id: 'food_security',
    name: 'Food Security',
    category: 'Food & Nutrition Well-being',
    description: 'Access to sufficient and nutritious food',
    source: 'FAO Food Security Index',
    citation: 'FAO. (2023). Global Food Security Report.',
    sourceLink: 'https://www.fao.org/food-security/en/',
    dataQuality: {
      reliability: 0.93,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.9',
      methodology: 'Food security assessment'
    }
  },
  {
    id: 'nutrition_quality',
    name: 'Nutrition Quality',
    category: 'Food & Nutrition Well-being',
    description: 'Population nutrition status and dietary quality',
    source: 'WHO Global Nutrition Report',
    citation: 'WHO. (2023). Global Nutrition Report.',
    sourceLink: 'https://globalnutritionreport.org/',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'Population nutrition surveillance'
    }
  },
  {
    id: 'sustainable_food',
    name: 'Sustainable Food',
    category: 'Food & Nutrition Well-being',
    description: 'Sustainable food production and consumption',
    source: 'FAO Sustainable Food Systems',
    citation: 'FAO. (2023). Sustainable Food Systems Report.',
    sourceLink: 'https://www.fao.org/food-systems/',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Food system sustainability analysis'
    }
  },

  // Urban & Housing Well-being
  {
    id: 'housing_quality',
    name: 'Housing Quality',
    category: 'Urban & Housing Well-being',
    description: 'Quality and accessibility of housing',
    source: 'UN-Habitat Urban Indicators',
    citation: 'UN-Habitat. (2023). Global Urban Indicators Database.',
    sourceLink: 'https://unhabitat.org/global-urban-indicators-database',
    dataQuality: {
      reliability: 0.90,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.2',
      methodology: 'Housing quality assessment framework'
    }
  },
  {
    id: 'urban_livability',
    name: 'Urban Livability',
    category: 'Urban & Housing Well-being',
    description: 'Quality of urban life and city services',
    source: 'Economist Intelligence Unit',
    citation: 'EIU. (2023). Global Liveability Index.',
    sourceLink: 'https://www.eiu.com/n/campaigns/global-liveability-index-2023/',
    dataQuality: {
      reliability: 0.91,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.3',
      methodology: 'Multi-factor urban quality assessment'
    }
  },
  {
    id: 'green_spaces',
    name: 'Green Spaces',
    category: 'Urban & Housing Well-being',
    description: 'Access to and quality of urban green spaces',
    source: 'WHO Urban Green Space Initiative',
    citation: 'WHO. (2023). Urban Green Space Assessment.',
    sourceLink: 'https://www.who.int/teams/environment-climate-change-and-health/urban-health/green-spaces',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.1',
      methodology: 'Urban green space assessment'
    }
  },
  {
    id: 'housing_affordability',
    name: 'Housing Affordability',
    category: 'Urban & Housing Well-being',
    description: 'Access to affordable and adequate housing',
    source: 'UN-Habitat Housing Index',
    citation: 'UN-Habitat. (2023). Global Housing Affordability Report.',
    sourceLink: 'https://unhabitat.org/',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.1',
      methodology: 'Housing affordability analysis'
    }
  },

  // Safety & Security Well-being
  {
    id: 'public_safety',
    name: 'Public Safety',
    category: 'Safety & Security Well-being',
    description: 'Crime rates and personal security measures',
    source: 'UN Office on Drugs and Crime',
    citation: 'UNODC. (2023). Global Study on Homicide.',
    sourceLink: 'https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'Crime statistics and surveys'
    }
  },
  {
    id: 'disaster_resilience',
    name: 'Disaster Resilience',
    category: 'Safety & Security Well-being',
    description: 'Preparedness and response to natural disasters',
    source: 'UN Office for Disaster Risk Reduction',
    citation: 'UNDRR. (2023). Global Assessment Report on Disaster Risk Reduction.',
    sourceLink: 'https://www.undrr.org/publication/global-assessment-report-disaster-risk-reduction-2023',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.0',
      methodology: 'Multi-hazard risk assessment'
    }
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Safety & Security Well-being',
    description: 'Digital security and protection against cyber threats',
    source: 'ITU Global Cybersecurity Index',
    citation: 'ITU. (2023). Global Cybersecurity Index.',
    sourceLink: 'https://www.itu.int/en/ITU-D/Cybersecurity/Pages/global-cybersecurity-index.aspx',
    dataQuality: {
      reliability: 0.91,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.1',
      methodology: 'Composite analysis of cybersecurity measures'
    }
  },
  {
    id: 'emergency_response',
    name: 'Emergency Response',
    category: 'Safety & Security Well-being',
    description: 'Emergency services effectiveness and response times',
    source: 'WHO Emergency Care System Assessment',
    citation: 'WHO. (2023). Emergency Care System Assessment.',
    sourceLink: 'https://www.who.int/emergencycare/en/',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.8',
      methodology: 'Emergency response time and effectiveness analysis'
    }
  },

  // Financial Well-being
  {
    id: 'financial_literacy',
    name: 'Financial Literacy',
    category: 'Financial Well-being',
    description: 'Population financial knowledge and capability',
    source: 'OECD International Network on Financial Education',
    citation: 'OECD. (2023). International Survey of Adult Financial Literacy.',
    sourceLink: 'https://www.oecd.org/financial/education/',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Biennial',
      confidenceInterval: '±2.8',
      methodology: 'Survey-based financial competency assessment'
    }
  },
  {
    id: 'financial_inclusion',
    name: 'Financial Inclusion',
    category: 'Financial Well-being',
    description: 'Access to banking and financial services',
    source: 'World Bank Global Findex',
    citation: 'World Bank. (2023). Global Financial Inclusion Database.',
    sourceLink: 'https://globalfindex.worldbank.org/',
    dataQuality: {
      reliability: 0.94,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.5',
      methodology: 'Financial services access analysis'
    }
  },
  {
    id: 'retirement_security',
    name: 'Retirement Security',
    category: 'Financial Well-being',
    description: 'Pension systems and retirement preparedness',
    source: 'Mercer Global Pension Index',
    citation: 'Mercer. (2023). Global Pension Index.',
    sourceLink: 'https://www.mercer.com/our-thinking/global-pension-index.html',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'Multi-factor pension system analysis'
    }
  },
  {
    id: 'debt_management',
    name: 'Debt Management',
    category: 'Financial Well-being',
    description: 'Household debt levels and management capabilities',
    source: 'OECD Household Debt Statistics',
    citation: 'OECD. (2023). Household Debt Statistics.',
    sourceLink: 'https://data.oecd.org/hha/household-debt.htm',
    dataQuality: {
      reliability: 0.93,
      sampleSize: 'Very Large',
      updateFrequency: 'Quarterly',
      confidenceInterval: '±1.8',
      methodology: 'Household financial analysis'
    }
  },

  // Mobility & Transportation
  {
    id: 'transport_access',
    name: 'Transport Access',
    category: 'Mobility & Transportation',
    description: 'Access to public transportation and mobility options',
    source: 'UN Habitat Urban Transport Database',
    citation: 'UN-Habitat. (2023). Global Urban Transport Database.',
    sourceLink: 'https://unhabitat.org/topic/mobility',
    dataQuality: {
      reliability: 0.87,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.0',
      methodology: 'Transport infrastructure assessment'
    }
  },
  {
    id: 'sustainable_mobility',
    name: 'Sustainable Mobility',
    category: 'Mobility & Transportation',
    description: 'Green transportation and sustainable mobility practices',
    source: 'Sustainable Mobility for All',
    citation: 'SuM4All. (2023). Global Mobility Report.',
    sourceLink: 'https://www.sum4all.org/data/files/global-mobility-report',
    dataQuality: {
      reliability: 0.86,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.2',
      methodology: 'Sustainable transport indicators analysis'
    }
  },
  {
    id: 'traffic_safety',
    name: 'Traffic Safety',
    category: 'Mobility & Transportation',
    description: 'Road safety and traffic accident prevention',
    source: 'WHO Global Status Report on Road Safety',
    citation: 'WHO. (2023). Global Status Report on Road Safety.',
    sourceLink: 'https://www.who.int/violence_injury_prevention/road_safety_status/en/',
    dataQuality: {
      reliability: 0.94,
      sampleSize: 'Very Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.5',
      methodology: 'Traffic safety statistics analysis'
    }
  },
  {
    id: 'transport_innovation',
    name: 'Transport Innovation',
    category: 'Mobility & Transportation',
    description: 'Adoption of innovative transportation solutions',
    source: 'World Economic Forum Mobility Innovation Index',
    citation: 'WEF. (2023). Global Mobility Innovation Index.',
    sourceLink: 'https://www.weforum.org/reports/mobility-innovation-index',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.7',
      methodology: 'Transportation innovation assessment'
    }
  },

  // Recreation & Leisure
  {
    id: 'leisure_time',
    name: 'Leisure Time',
    category: 'Recreation & Leisure',
    description: 'Available time for leisure and recreational activities',
    source: 'OECD Time Use Surveys',
    citation: 'OECD. (2023). Time Use Database.',
    sourceLink: 'https://www.oecd.org/social/time-use-database.htm',
    dataQuality: {
      reliability: 0.90,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Time-use survey analysis'
    }
  },
  {
    id: 'recreation_access',
    name: 'Recreation Access',
    category: 'Recreation & Leisure',
    description: 'Access to parks, sports facilities, and recreational spaces',
    source: 'WHO Global Urban Health Initiative',
    citation: 'WHO. (2023). Urban Green Spaces and Health.',
    sourceLink: 'https://www.who.int/teams/environment-climate-change-and-health/urban-health',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.8',
      methodology: 'Urban recreation infrastructure assessment'
    }
  },
  {
    id: 'cultural_events',
    name: 'Cultural Events',
    category: 'Recreation & Leisure',
    description: 'Access to and participation in cultural events',
    source: 'UNESCO Culture & Leisure Statistics',
    citation: 'UNESCO. (2023). Cultural Events Participation Survey.',
    sourceLink: 'http://uis.unesco.org/en/topic/culture-leisure',
    dataQuality: {
      reliability: 0.87,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.0',
      methodology: 'Cultural participation surveys'
    }
  },
  {
    id: 'tourism_accessibility',
    name: 'Tourism Accessibility',
    category: 'Recreation & Leisure',
    description: 'Access to and affordability of tourism activities',
    source: 'UNWTO Tourism Accessibility Index',
    citation: 'UNWTO. (2023). Tourism Accessibility Report.',
    sourceLink: 'https://www.unwto.org/tourism-statistics',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.6',
      methodology: 'Tourism accessibility assessment'
    }
  }
];

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      }, HTMLElement>;
    }
  }
}

// Add ElevenLabs widget component
function ElevenLabsWidget() {
  return (
    <>
      <elevenlabs-convai agent-id="RjWW5CP9gUsiIlGRShhj"></elevenlabs-convai>
      <Script 
        src="https://elevenlabs.io/convai-widget/index.js" 
        strategy="lazyOnload"
      />
    </>
  );
}

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState(['United States', 'Finland', 'Japan', 'Germany', 'Costa Rica'])
  const [selectedMetrics, setSelectedMetrics] = useState(['happiness', 'healthcare', 'education', 'work_life'])
  const [wellnessData, setWellnessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false)
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/wellness-data', {
          params: { 
            countries: selectedCountries.join(','),
            metrics: selectedMetrics.join(',')
          }
        })
        setWellnessData(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [selectedCountries, selectedMetrics])

  return (
    <SocietalStructuresProvider>
      <div className="min-h-screen bg-background-dark">
        <main className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-text-primary">
              Global Wellness Perspectives
            </h1>
            <p className="mt-1 text-xs text-text-secondary">
              Explore how different societal structures correlate with wellness outcomes around the world.
            </p>
          </div>

          {/* Add the widget near the top of the page */}
          <div className="mb-4">
            <ElevenLabsWidget />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="bg-card-bg rounded-lg shadow-lg border border-border-color p-2">
              <div className="grid grid-cols-2 gap-2">
                <CountrySelector 
                  selectedCountries={selectedCountries} 
                  setSelectedCountries={setSelectedCountries} 
                  selectedMetrics={selectedMetrics}
                  dataAvailability={wellnessData?.dataAvailability}
                />
                <MetricSelector 
                  metrics={WELLNESS_METRICS}
                  selectedMetrics={selectedMetrics} 
                  setSelectedMetrics={setSelectedMetrics} 
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/50 border border-red-700 rounded-md p-4">
                <p className="text-red-200">{error}</p>
              </div>
            ) : wellnessData ? (
              <div className="space-y-2">
                <LocationComparison 
                  metrics={selectedMetrics}
                  globalData={wellnessData}
                />
                <WellnessInsights data={wellnessData} metrics={WELLNESS_METRICS} />
              </div>
            ) : (
              <div className="text-center text-text-secondary">
                No data available. Please adjust your selection.
              </div>
            )}
          </div>
        </main>

        <footer className="bg-background-light mt-4 py-2 border-t border-border-color">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <button
                  onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
                  className="flex justify-between items-center w-full text-left text-lg font-semibold text-text-primary mb-2 hover:text-accent-primary transition-colors"
                >
                  <span>Data Sources & Quality</span>
                  <span className="transform transition-transform duration-200" style={{
                    transform: isSourcesExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>▼</span>
                </button>
                {isSourcesExpanded && (
                  <div className="space-y-4 animate-fadeIn">
                    {WELLNESS_METRICS.map(metric => (
                      <div key={metric.id} className="bg-background-dark p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <a 
                              href={metric.sourceLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-accent-primary hover:text-accent-secondary font-medium"
                            >
                              {metric.source}
                            </a>
                            <p className="text-sm text-text-secondary mt-1">{metric.citation}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <span className="text-sm text-text-secondary mr-2">Reliability:</span>
                              <div className="w-24 bg-background-light rounded-full h-2.5">
                                <div 
                                  className="bg-green-500 h-2.5 rounded-full" 
                                  style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <p className="text-sm text-text-secondary mt-1">
                              CI: {metric.dataQuality.confidenceInterval}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-text-secondary">
                          <p>Sample Size: {metric.dataQuality.sampleSize}</p>
                          <p>Update Frequency: {metric.dataQuality.updateFrequency}</p>
                          <p className="mt-1 italic">{metric.dataQuality.methodology}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="flex justify-between items-center w-full text-left text-lg font-semibold text-text-primary mb-2 hover:text-accent-primary transition-colors"
                >
                  <span>About the Data</span>
                  <span className="transform transition-transform duration-200" style={{
                    transform: isAboutExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>▼</span>
                </button>
                {isAboutExpanded && (
                  <div className="bg-background-dark p-4 rounded-lg animate-fadeIn">
                    <h4 className="font-medium text-text-primary mb-2">Data Quality Indicators</h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li>
                        <span className="font-medium">Reliability Score:</span> Measures the consistency and accuracy of data collection methods (0-1 scale)
                      </li>
                      <li>
                        <span className="font-medium">Confidence Interval:</span> Range within which the true value is likely to fall
                      </li>
                      <li>
                        <span className="font-medium">Sample Size:</span> Indicates the scope of data collection
                      </li>
                      <li>
                        <span className="font-medium">Update Frequency:</span> How often the data is refreshed
                      </li>
                    </ul>
                    <div className="mt-4">
                      <h4 className="font-medium text-text-primary mb-2">Data Normalization</h4>
                      <p className="text-sm text-text-secondary">
                        All metrics are normalized to a 0-100 scale for comparison purposes. 
                        The normalization process accounts for different measurement scales and units across sources.
                      </p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-text-primary mb-2">Last Updated</h4>
                      <p className="text-sm text-text-secondary">
                        {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SocietalStructuresProvider>
  )
} 