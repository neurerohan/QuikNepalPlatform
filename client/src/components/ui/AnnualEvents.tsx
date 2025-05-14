import { useState, useEffect } from 'react';
import { getYearInfo } from '@/lib/calendar-content';

interface AnnualEventsProps {
  year: number;
}

const AnnualEvents = ({ year }: AnnualEventsProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Example events for empty state - these will display when API data is not available
  const defaultEvents = [
    {
      name: 'Nepali New Year (नेपाली नयाँ वर्ष)',
      month: 'Baishakh (बैशाख)',
      date: '~1',
      description: 'The beginning of the Nepali calendar year, celebrated with gatherings, feasts, and cultural events throughout Nepal.',
      type: 'National'
    },
    {
      name: 'Buddha Jayanti (बुद्ध जयन्ती)',
      month: 'Baishakh (बैशाख)',
      date: '~Full moon',
      description: 'Celebrates the birth, enlightenment, and death of Gautama Buddha, founder of Buddhism.',
      type: 'Religious',
      note: 'Date varies yearly'
    },
    {
      name: 'Janai Purnima (जनै पूर्णिमा)',
      month: 'Shrawan (साउन)',
      date: '~Full moon',
      description: 'Sacred thread changing ceremony for Hindu males, and tying of protective thread bracelets (Rakhi).',
      type: 'Religious',
      note: 'Date varies yearly'
    },
    {
      name: 'Gai Jatra (गाई जात्रा)',
      month: 'Bhadra (भदौ)',
      date: '~Early month',
      description: 'Festival to commemorate the death of loved ones with processions and humor.',
      type: 'Cultural',
      note: 'Date varies yearly'
    },
    {
      name: 'Teej (तीज)',
      month: 'Bhadra (भदौ)',
      date: '~Third day',
      description: 'Women\'s festival with fasting and prayers for marital happiness and wellbeing.',
      type: 'Cultural',
      note: 'Date varies yearly'
    },
    {
      name: 'Dashain (दशैं)',
      month: 'Ashwin (असोज)',
      date: '~Mid to end of month',
      description: 'Nepal\'s most important 15-day festival celebrating the victory of good over evil.',
      type: 'Cultural',
      note: 'Date varies yearly'
    },
    {
      name: 'Tihar (तिहार)',
      month: 'Kartik (कार्तिक)',
      date: '~New moon period',
      description: 'Five-day festival of lights honoring various deities, animals, and family bonds.',
      type: 'Cultural',
      note: 'Date varies yearly'
    },
    {
      name: 'Chhath Parva (छठ पर्व)',
      month: 'Kartik (कार्तिक)',
      date: '~Six days after Tihar',
      description: 'Ancient Hindu festival dedicated to the Sun God and Chhathi Maiya (Mother Goddess).',
      type: 'Religious',
      note: 'Date varies yearly'
    }
  ];

  // Get the year info from our content helper
  const yearInfo = getYearInfo(year);
  
  // Helper function to get appropriate icon for event type
  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'national':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        );
      case 'religious':
        return (
          <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      case 'cultural':
        return (
          <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  // Helper to get background color based on event type
  const getEventBgColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'national':
        return 'bg-red-50 border-red-100';
      case 'religious':
        return 'bg-purple-50 border-purple-100';
      case 'cultural':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-green-50 border-green-100';
    }
  };

  return (
    <div className="p-6">
      {/* Tab navigation for different views */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 transition-colors whitespace-nowrap
            ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          Year Overview
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 transition-colors whitespace-nowrap
            ${activeTab === 'calendar' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          Calendar by Month
        </button>
        <button 
          onClick={() => setActiveTab('festivals')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
            ${activeTab === 'festivals' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          Major Festivals
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Year {year} BS Overview</h3>
            <p className="text-gray-600 mb-4">
              Nepali year {year} BS ({year - 57}-{year - 56} AD) is {yearInfo?.description || 'an important year in the Nepali calendar with various festivals and events scheduled throughout the twelve months.'}
            </p>
            
            <h4 className="font-medium text-primary mb-2">Key Highlights</h4>
            <ul className="space-y-2 mb-6">
              {(yearInfo?.highlights || [
                'Major urban development projects in Kathmandu Valley',
                'Expansion of international air connectivity',
                'Focus on renewable energy infrastructure',
                'Educational reforms and skill development initiatives'
              ]).map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Calendar by Month Tab */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
            const monthName = (() => {
              switch(month) {
                case 1: return 'Baishakh (बैशाख)';
                case 2: return 'Jestha (जेठ)';
                case 3: return 'Ashadh (असार)';
                case 4: return 'Shrawan (साउन)';
                case 5: return 'Bhadra (भदौ)';
                case 6: return 'Ashwin (असोज)';
                case 7: return 'Kartik (कार्तिक)';
                case 8: return 'Mangsir (मंसिर)';
                case 9: return 'Poush (पुष)';
                case 10: return 'Magh (माघ)';
                case 11: return 'Falgun (फागुन)';
                case 12: return 'Chaitra (चैत)';
                default: return `Month ${month}`;
              }
            })();
            
            // Filter events for this month
            const monthEvents = defaultEvents.filter(event => 
              event.month.split(' ')[0].toLowerCase() === monthName.split(' ')[0].toLowerCase()
            );
            
            return (
              <div 
                key={month} 
                className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
                  ${monthEvents.length > 0 ? 'border-green-200' : 'border-gray-200'}`}
              >
                <div className={`p-3 ${monthEvents.length > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <h4 className="font-medium">{month}. {monthName}</h4>
                </div>
                
                <div className="p-3">
                  {monthEvents.length > 0 ? (
                    <ul className="space-y-2">
                      {monthEvents.map((event, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className={`inline-block w-2 h-2 rounded-full bg-${event.type.toLowerCase() === 'national' ? 'red' : event.type.toLowerCase() === 'religious' ? 'purple' : 'amber'}-500 mr-2 mt-1.5`}></span>
                          <div>
                            <p className="font-medium">{event.name.split(' ')[0]}</p>
                            <p className="text-xs text-gray-500">{event.date}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No major events recorded</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Major Festivals Tab */}
      {activeTab === 'festivals' && (
        <div className="space-y-6 animate-fadeIn">
          {defaultEvents.map((event, index) => (
            <div 
              key={index}
              className={`border rounded-lg overflow-hidden shadow-sm ${getEventBgColor(event.type)}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-4 bg-white/50 md:border-r border-gray-100 flex flex-col justify-center">
                  <h4 className="font-medium text-lg">{event.name}</h4>
                  <div className="flex items-center mt-1">
                    <div className="mr-2">{getEventIcon(event.type)}</div>
                    <span className="text-sm text-gray-600">{event.type}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <p>{event.month}</p>
                    <p>{event.date}</p>
                    {event.note && <p className="text-xs italic mt-1">{event.note}</p>}
                  </div>
                </div>
                
                <div className="p-4 col-span-3 bg-white/80">
                  <p className="text-gray-700">{event.description}</p>
                  
                  {/* This would typically come from API data */}
                  <div className="mt-3 text-sm">
                    <h5 className="font-medium text-gray-700">Details for {year} BS:</h5>
                    <p className="text-gray-600">
                      Specific dates will be published as the year approaches. Check back closer to the date for accurate information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Additional information and help text */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
        <div className="flex items-start">
          <svg className="h-5 w-5 mr-2 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium mb-1">About Festival Dates</p>
            <p>
              Nepali festival dates are determined by the lunar calendar and can vary yearly. 
              The dates shown are approximations and may change. For exact dates, please check official announcements 
              or contact local authorities as the festival approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualEvents;