import React from 'react';
import { getMajorEvents, getYearInfo } from '@/lib/calendar-content';

interface AnnualEventsProps {
  year: number;
}

const AnnualEvents: React.FC<AnnualEventsProps> = ({ year }) => {
  const events = getMajorEvents(year);
  const yearInfo = getYearInfo(year);
  
  // Group events by month
  const eventsByMonth: Record<number, typeof events> = {};
  events.forEach(event => {
    if (!eventsByMonth[event.month]) {
      eventsByMonth[event.month] = [];
    }
    eventsByMonth[event.month].push(event);
  });
  
  // Get Nepali month names
  const nepaliMonths = [
    'Baishakh (बैशाख)', 
    'Jestha (जेठ)', 
    'Ashadh (असार)', 
    'Shrawan (साउन)', 
    'Bhadra (भदौ)', 
    'Ashwin (असोज)', 
    'Kartik (कार्तिक)', 
    'Mangsir (मंसिर)', 
    'Poush (पुष)', 
    'Magh (माघ)', 
    'Falgun (फागुन)', 
    'Chaitra (चैत)'
  ];

  return (
    <div className="p-6">
      {/* Year Overview */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">Year {year} BS Overview</h3>
        <p className="text-neutral mb-4">{yearInfo.description}</p>
        
        <div className="bg-primary-light/10 rounded-lg p-4">
          <h4 className="font-medium text-primary mb-2">Key Highlights</h4>
          <ul className="space-y-2">
            {yearInfo.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-neutral">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Major Festivals Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">Major Festivals & Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events
            .filter(event => event.importance === 'major')
            .map((event, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className={`p-3 ${event.type === 'national' 
                  ? 'bg-blue-50' 
                  : event.type === 'religious' 
                    ? 'bg-purple-50' 
                    : event.type === 'cultural' 
                      ? 'bg-amber-50' 
                      : 'bg-green-50'}`}>
                  <h4 className="font-medium text-gray-800">
                    {event.name} <span className="text-gray-500 text-sm">({event.nepaliName})</span>
                  </h4>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <span className="mr-2">{nepaliMonths[event.month - 1]}</span>
                    {event.approximateDay && (
                      <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-gray-200">
                        ~{event.approximateDay}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-neutral">{event.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      event.type === 'national' 
                        ? 'bg-blue-100 text-blue-800' 
                        : event.type === 'religious' 
                          ? 'bg-purple-100 text-purple-800' 
                          : event.type === 'cultural' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    {event.movable && (
                      <span className="text-xs text-gray-500 italic">Date varies yearly</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* Monthly Calendar Events */}
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">Calendar by Month</h3>
        <div className="space-y-6">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <div key={month} className="border-b border-gray-200 pb-4 last:border-0">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-8 h-8 rounded-full bg-primary-light/20 text-primary flex items-center justify-center mr-2">
                  {month}
                </span>
                {nepaliMonths[month - 1]}
              </h4>
              
              {eventsByMonth[month] && eventsByMonth[month].length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {eventsByMonth[month].map((event, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-3 rounded border border-gray-100 shadow-sm"
                    >
                      <h5 className="font-medium text-sm">{event.name}</h5>
                      <p className="text-xs text-gray-500 mt-1">{event.approximateDay}</p>
                      <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${
                        event.type === 'national' 
                          ? 'bg-blue-100 text-blue-800' 
                          : event.type === 'religious' 
                            ? 'bg-purple-100 text-purple-800' 
                            : event.type === 'cultural' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No major events recorded</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnualEvents;