// components/FAQ.js
import { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: "What is the purpose of this tool?",
    answer: "This tool aims to expand perspectives by visualizing how different societal structures correlate with various wellness outcomes. By comparing objective data across countries rather than focusing on cultural stereotypes, we can better understand how different approaches to organizing society might affect quality of life."
  },
  {
    question: "Are you suggesting one societal model is better than others?",
    answer: "We're not advocating for any specific model. Different societies have made different trade-offs based on their unique histories, values, and circumstances. This tool simply presents objective data so you can draw your own conclusions about what aspects might be worth learning from."
  },
  {
    question: "Where does this data come from?",
    answer: "The data is compiled from various international organizations including the OECD, World Health Organization, United Nations Human Development Reports, World Happiness Report, Global Peace Index, and national statistical agencies. Each metric includes its specific source."
  },
  {
    question: "Why focus on wellness metrics rather than GDP or economic growth?",
    answer: "While economic metrics are important, they don't tell the complete story of how people experience life in different societies. Wellness metrics like happiness, health outcomes, education, safety, and work-life balance provide a more holistic picture of quality of life across different dimensions."
  },
  {
    question: "How should I interpret these comparisons?",
    answer: "Look for patterns rather than focusing on individual data points. Consider the trade-offs different societies have made and think about which factors matter most to you personally. Remember that no society is perfect - each has areas of strength and opportunities for improvement."
  },
  {
    question: "What does 'societal structure' actually mean?",
    answer: "Societal structure refers to the way a society organizes its key institutions and systems, including healthcare, education, labor markets, social welfare, taxation, and corporate governance. These structures reflect underlying values and priorities and have significant impacts on how people experience daily life."
  },
  {
    question: "Can a country adopt aspects of another country's model?",
    answer: "Yes, but with important caveats. Societal structures evolve within specific historical, cultural, and economic contexts. While countries can certainly learn from each other, simply transplanting one element without considering how it fits within the broader system may not yield the same results. Adaptation rather than direct copying is usually more effective."
  },
  {
    question: "How often is this data updated?",
    answer: "We strive to update our data annually as new information becomes available from our source organizations. Each metric displays the year of its most recent update."
  }
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);
  
  const toggleItem = (index) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
              onClick={() => toggleItem(index)}
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-500 transition-transform ${openItem === index ? 'transform rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {openItem === index && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
