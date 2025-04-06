// components/EducationalResources.js
import { useState } from 'react';

const RESOURCES = [
  {
    category: 'Books',
    items: [
      {
        title: 'The Nordic Theory of Everything',
        author: 'Anu Partanen',
        description: 'Explores how the Nordic approach to social policy might improve American life.',
        tags: ['nordic', 'comparative']
      },
      {
        title: 'The Economics of Belonging',
        author: 'Martin Sandbu',
        description: 'Examines how economic policies can create more inclusive societies.',
        tags: ['economics', 'inequality']
      },
      {
        title: 'The Spirit Level: Why Greater Equality Makes Societies Stronger',
        author: 'Richard Wilkinson & Kate Pickett',
        description: 'Examines how inequality affects social outcomes across different nations.',
        tags: ['inequality', 'social outcomes']
      },
      {
        title: 'Saving Capitalism from the Capitalists',
        author: 'Raghuram Rajan & Luigi Zingales',
        description: 'Explores how different market structures affect economic outcomes.',
        tags: ['capitalism', 'markets']
      },
      {
        title: 'Happiness and the Law',
        author: 'John Bronsteen, Christopher Buccafusco & Jonathan Masur',
        description: 'Examines how legal structures influence societal well-being.',
        tags: ['happiness', 'law']
      }
    ]
  },
  {
    category: 'Academic Papers',
    items: [
      {
        title: 'Varieties of Capitalism: The Institutional Foundations of Comparative Advantage',
        author: 'Peter A. Hall & David Soskice',
        description: 'Seminal work categorizing different types of market economies and their institutional arrangements.',
        tags: ['economic systems', 'institutional analysis']
      },
      {
        title: 'Happiness: Lessons from a New Science',
        author: 'Richard Layard',
        description: 'Examines happiness research and its implications for public policy.',
        tags: ['happiness', 'wellbeing']
      },
      {
        title: 'The Welfare State and Quality of Life',
        author: 'Axel van den Berg & Lance W. Roberts',
        description: 'Analysis of how different welfare state arrangements influence quality of life metrics.',
        tags: ['welfare state', 'quality of life']
      },
      {
        title: 'Health Systems in Different Countries: Comparative Efficiency and Policy',
        author: 'Ellen Nolte & Martin McKee',
        description: 'Compares healthcare outcomes and systems across multiple countries.',
        tags: ['healthcare', 'comparative policy']
      }
    ]
  },
  {
    category: 'Documentaries & Lectures',
    items: [
      {
        title: 'Where to Invade Next',
        author: 'Michael Moore',
        description: 'Documentary exploring social policies in various countries that could benefit the United States.',
        tags: ['comparative policy', 'social systems']
      },
      {
        title: 'Happy',
        author: 'Roko Belic',
        description: 'Documentary exploring what makes people happy across different cultures and societies.',
        tags: ['happiness', 'cultural comparison']
      },
      {
        title: 'Capitalism: A Love Story',
        author: 'Michael Moore',
        description: 'Critical examination of the American economic system and its effects on society.',
        tags: ['capitalism', 'economic critique']
      },
      {
        title: 'Healthcare Systems Around the World',
        author: 'Healthcare Triage (YouTube)',
        description: 'Series explaining how healthcare systems function in different countries.',
        tags: ['healthcare', 'comparative systems']
      }
    ]
  },
  {
    category: 'Organizations & Data Sources',
    items: [
      {
        title: 'OECD Better Life Index',
        author: 'Organisation for Economic Co-operation and Development',
        description: 'Interactive tool to compare well-being across countries based on material living conditions and quality of life.',
        link: 'http://www.oecdbetterlifeindex.org',
        tags: ['data', 'wellbeing', 'comparative']
      },
      {
        title: 'World Happiness Report',
        author: 'Sustainable Development Solutions Network',
        description: 'Annual report measuring and ranking countries by happiness and wellbeing factors.',
        link: 'https://worldhappiness.report',
        tags: ['happiness', 'metrics', 'data']
      },
      {
        title: 'Human Development Index',
        author: 'United Nations Development Programme',
        description: 'Composite index measuring average achievement in key dimensions of human development.',
        link: 'http://hdr.undp.org',
        tags: ['development', 'metrics', 'comparative']
      },
      {
        title: 'World Inequality Database',
        author: 'World Inequality Lab',
        description: 'Open source database on income and wealth inequality across countries.',
        link: 'https://wid.world',
        tags: ['inequality', 'economics', 'data']
      },
      {
        title: 'Our World in Data',
        author: 'University of Oxford',
        description: 'Research and data to make progress against the world\'s largest problems.',
        link: 'https://ourworldindata.org',
        tags: ['data', 'research', 'metrics']
      }
    ]
  }
];

export default function EducationalResources() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Get unique tags across all resources
  const allTags = [];
  RESOURCES.forEach(category => {
    category.items.forEach(item => {
      item.tags.forEach(tag => {
        if (!allTags.includes(tag)) {
          allTags.push(tag);
        }
      });
    });
  });
  
  // Filter resources based on active category, search term, and selected tags
  const filteredResources = RESOURCES.filter(category => 
    activeCategory === 'All' || category.category === activeCategory
  ).map(category => {
    const filteredItems = category.items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => item.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
    
    return {
      ...category,
      items: filteredItems
    };
  }).filter(category => category.items.length > 0);
  
  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Learn More</h2>
      <p className="text-gray-600 mb-6">
        Explore these resources to deepen your understanding of different societal structures 
        and how they relate to wellness outcomes.
      </p>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              activeCategory === 'All' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveCategory('All')}
          >
            All Resources
          </button>
          {RESOURCES.map(category => (
            <button
              key={category.category}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === category.category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveCategory(category.category)}
            >
              {category.category}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-2/3">
            <input
              type="text"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-1/3">
            <select
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value=""
              onChange={(e) => {
                if (e.target.value && !selectedTags.includes(e.target.value)) {
                  setSelectedTags([...selectedTags, e.target.value]);
                }
              }}
            >
              <option value="">Filter by topic...</option>
              {allTags.sort().map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                  onClick={() => handleTagToggle(tag)}
                >
                  <span className="sr-only">Remove filter</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={() => setSelectedTags([])}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No resources found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredResources.map(category => (
            <div key={category.category}>
              <h3 className="text-lg font-medium text-gray-900 mb-3">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">By {item.author}</p>
                    <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags.map(tag => (
                        <span 
                          key={tag}
                          className={`cursor-pointer inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.link && (
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}