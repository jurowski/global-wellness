// components/SocietalStructuresContext.js
import { useState } from 'react';

// Define societal structure models with descriptions
const SOCIETAL_MODELS = [
  {
    id: 'nordic',
    name: 'Nordic Model',
    countries: ['Finland', 'Sweden', 'Norway', 'Denmark'],
    description: 'The Nordic model combines free market capitalism with a comprehensive welfare state and strong labor protections. It features high taxes, generous public services, and collaborative labor-management relations.',
    key_features: [
      'Universal healthcare coverage with minimal out-of-pocket costs',
      'Free education from pre-K through university',
      'Generous parental leave and childcare policies',
      'Strong unemployment benefits with active labor market policies',
      'High degree of unionization and worker protections',
      'Relatively compressed wage structure with smaller gaps between CEOs and workers'
    ],
    wellness_outcomes: [
      'Consistently ranks among the highest in global happiness indices',
      'Lower rates of poverty and homelessness',
      'High social mobility across generations',
      'Greater gender equality in workforce participation',
      'Lower crime rates and incarceration',
      'Strong work-life balance with shorter working hours'
    ]
  },
  {
    id: 'continental_european',
    name: 'Continental European Model',
    countries: ['Germany', 'France', 'Switzerland'],
    description: 'The Continental European model features strong social insurance systems tied to employment, regulated market economies, and social partnership between employers, unions, and government.',
    key_features: [
      'Statutory health insurance with employer and employee contributions',
      'Strong job protections and unemployment benefits',
      'Robust vocational education and apprenticeship systems',
      'Codetermination giving workers representation on corporate boards',
      'Strong regulatory frameworks for businesses',
      'Generally higher taxes than Anglo-American models but lower than Nordic countries'
    ],
    wellness_outcomes: [
      'Good healthcare access with low out-of-pocket costs',
      'Lower income inequality compared to Anglo-American countries',
      'More stable employment patterns with fewer layoffs during downturns',
      'Higher job security and benefits for workers',
      'Better protection for temporary and part-time workers',
      'More time off: longer vacations and shorter working hours'
    ]
  },
  {
    id: 'anglo_american',
    name: 'Anglo-American Model',
    countries: ['USA', 'United Kingdom', 'Canada', 'Australia'],
    description: 'The Anglo-American model emphasizes free markets, flexible labor regulations, private provision of services, and means-tested social programs rather than universal benefits.',
    key_features: [
      'Lower taxes compared to other developed economies',
      'More limited and often means-tested welfare benefits',
      'Greater emphasis on private markets for services like healthcare',
      'More flexible labor markets with fewer regulations',
      'Focus on shareholder primacy in corporate governance',
      'Greater income inequality and wealth disparity'
    ],
    wellness_outcomes: [
      'Higher GDP per capita in some cases but less evenly distributed',
      'Higher healthcare costs with more uneven coverage',
      'Longer working hours and less vacation time on average',
      'Higher rates of poverty and homelessness in some regions',
      'Greater economic opportunity but also more economic insecurity',
      'More varied educational outcomes based on location and income'
    ]
  },
  {
    id: 'east_asian',
    name: 'East Asian Model',
    countries: ['Japan', 'South Korea', 'Singapore'],
    description: 'The East Asian model combines strong state involvement in economic development, corporate-centered welfare, and emphasizes education, family responsibility, and social cohesion.',
    key_features: [
      'Strong government role in economic planning and development',
      'High emphasis on educational achievement and competition',
      'Company-based welfare benefits rather than government programs',
      'Strong emphasis on family support systems',
      'High savings rates and investment in infrastructure',
      'Strong work ethic with longer working hours'
    ],
    wellness_outcomes: [
      'Very high educational achievement metrics',
      'Low crime rates and high public safety',
      'Long life expectancy and good healthcare outcomes',
      'Low unemployment but high work pressure',
      'More uneven work-life balance with longer working hours',
      'High rates of technological adoption and innovation'
    ]
  },
  {
    id: 'latin_american',
    name: 'Latin American Social Democracy',
    countries: ['Costa Rica', 'Uruguay', 'Chile'],
    description: 'These countries have developed stronger social safety nets and democratic institutions compared to regional neighbors, emphasizing public education, healthcare, and environmental protection.',
    key_features: [
      'Universal or near-universal healthcare systems',
      'Free public education with expanding access to higher education',
      'Strong democratic institutions with peaceful transitions of power',
      'Greater investments in environmental protection',
      'More progressive tax structures than regional neighbors',
      'Stronger labor protections than other emerging economies'
    ],
    wellness_outcomes: [
      'Higher happiness metrics than economic peers',
      'Better healthcare outcomes for similar income levels',
      'Lower violence rates than regional averages',
      'Stronger environmental quality and quality of life',
      'Higher social cohesion and trust in institutions',
      'More even distribution of economic growth benefits'
    ]
  }
];

export default function SocietalStructuresContext({ selectedCountries }) {
  const [expandedModel, setExpandedModel] = useState(null);
  
  // Find which models might be relevant based on selected countries
  const relevantModels = SOCIETAL_MODELS.filter(model => 
    model.countries.some(country => selectedCountries.includes(country))
  );
  
  if (relevantModels.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Different Societal Models</h2>
      <p className="text-gray-600 mb-6">
        The countries you're comparing represent different approaches to organizing society, each with unique structures 
        that impact wellness outcomes. Understanding these different models can help contextualize the data you're seeing.
      </p>
      
      <div className="space-y-4">
        {relevantModels.map(model => (
          <div key={model.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
              onClick={() => setExpandedModel(expandedModel === model.id ? null : model.id)}
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500">
                  Countries: {model.countries.filter(country => selectedCountries.includes(country)).join(', ')}
                </p>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-500 transition-transform ${expandedModel === model.id ? 'transform rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedModel === model.id && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-gray-700 mb-4">{model.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {model.key_features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Wellness Outcomes</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {model.wellness_outcomes.map((outcome, idx) => (
                        <li key={idx}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
