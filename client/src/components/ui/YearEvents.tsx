import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents, getMonthName } from '@/lib/api';

// Enhanced component for better empty state handling
const YearEvents = ({ year }: { year: string }) => {
  const [isEmptyStateExpanded, setIsEmptyStateExpanded] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar-events?year_bs=${year}`],
    queryFn: () => getCalendarEvents({ year_bs: year }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load events data</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  if (!data || !data.calendar_events || data.calendar_events.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto animate-fadeIn">
          <div className="mb-6">
            <img 
              src="/images/no-events-illustration.svg" 
              alt="No events found" 
              className="w-64 h-64 mx-auto opacity-80"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-32 w-32 mx-auto text-gray-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ display: 'none' }}  // Hide initially, will show if image fails
              onLoad={(e) => {
                // If the image fails, this will be shown
                const img = e.currentTarget.previousElementSibling as HTMLImageElement;
                if (img.style.display === 'none') {
                  e.currentTarget.style.display = 'block';
                }
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">No Events Found for Year {year} BS</h3>
          <p className="text-gray-600 mb-6">
            The calendar events for {year} BS are not available yet or haven't been added to our database.
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={() => setIsEmptyStateExpanded(!isEmptyStateExpanded)}
              className="flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <span>{isEmptyStateExpanded ? 'Hide suggestions' : 'Show suggestions'}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ml-1 transform transition-transform ${isEmptyStateExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {isEmptyStateExpanded && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100 text-left animate-fadeIn">
              <h4 className="font-medium text-gray-700 mb-2">What you can try:</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Try a different year (2080-2081 BS typically have more data)</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Check the "Year Overview" tab for general information</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>View the monthly calendar for daily information</span>
                </li>
              </ul>
              
              <div className="mt-4 p-3 bg-white rounded border border-gray-100">
                <h5 className="font-medium text-gray-700 text-sm mb-2">Upcoming years will include:</h5>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                    <span>Major national and religious holidays</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                    <span>Cultural festivals and celebrations</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                    <span>Important governmental and civic dates</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Group events by month
  const eventsByMonth: Record<string, any[]> = {};
  
  data.calendar_events.forEach((event: any) => {
    const date = event.date_bs || event.date;
    if (!date) return; // Skip if no date
    
    // Extract month from date (assuming format YYYY-MM-DD or DD.MM.YYYY)
    let month: string;
    if (date.includes('-')) {
      // Format: YYYY-MM-DD
      month = date.split('-')[1];
    } else if (date.includes('.')) {
      // Format: DD.MM.YYYY
      month = date.split('.')[1];
    } else {
      return; // Skip if invalid date format
    }
    
    const monthName = getMonthName(parseInt(month));
    
    if (!eventsByMonth[monthName]) {
      eventsByMonth[monthName] = [];
    }
    eventsByMonth[monthName].push(event);
  });

  // Helper to determine event type and color
  const getEventTypeAndColor = (event: any) => {
    const title = (event.title || event.name || '').toLowerCase();
    const type = event.event_type || '';
    
    if (type.includes('holiday') || title.includes('holiday')) {
      return {
        type: 'Public Holiday',
        color: 'bg-red-100 border-red-200 text-red-700',
        gradient: 'from-red-500 to-red-400',
        shadow: 'shadow-red-100'
      };
    }
    
    if (title.includes('festival') || type.includes('festival')) {
      return {
        type: 'Festival',
        color: 'bg-orange-100 border-orange-200 text-orange-700',
        gradient: 'from-amber-500 to-orange-400',
        shadow: 'shadow-orange-100'
      };
    }
    
    if (title.includes('birthday') || type.includes('birthday') || title.includes('jayanti')) {
      return {
        type: 'Birthday/Jayanti',
        color: 'bg-blue-100 border-blue-200 text-blue-700',
        gradient: 'from-blue-500 to-indigo-400',
        shadow: 'shadow-blue-100'
      };
    }
    
    return {
      type: 'Event',
      color: 'bg-green-100 border-green-200 text-green-700',
      gradient: 'from-green-500 to-teal-400',
      shadow: 'shadow-green-100'
    };
  };
  
  // Format date nicely
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    
    if (date.includes('-')) {
      const parts = date.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    if (date.includes('.')) {
      return date.replace(/\./g, '-');
    }
    
    return date;
  };

  // Get tithi information for a date
  const getTithiForDate = (date: string) => {
    // This is a placeholder - in a real app, you'd query this from your API
    const tithis = [
      'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'
    ];
    
    // Simple deterministic algorithm to assign a tithi based on date
    if (!date) return '';
    
    let dayOfMonth = 1;
    
    if (date.includes('-')) {
      dayOfMonth = parseInt(date.split('-')[2]) || 1;
    } else if (date.includes('.')) {
      dayOfMonth = parseInt(date.split('.')[0]) || 1;
    }
    
    // Map the day to a tithi (1-30 -> 0-15 with repetition)
    const tithiIndex = ((dayOfMonth - 1) % 15);
    
    // For the second half of the month, we're in the dark half (Krishna Paksha)
    const paksha = dayOfMonth > 15 ? 'Krishna' : 'Shukla';
    
    return `${tithis[tithiIndex]} (${paksha})`;
  };

  // Helper function to convert Tithi names to Devanagari
  const convertTithiToNepali = (tithi: string): string => {
    // Map of tithi names to Devanagari equivalents
    const tithiMap: Record<string, string> = {
      'Pratipada': 'प्रतिपदा',
      'Dwitiya': 'द्वितीया',
      'Tritiya': 'तृतीया',
      'Chaturthi': 'चतुर्थी',
      'Panchami': 'पञ्चमी',
      'Shashthi': 'षष्ठी',
      'Saptami': 'सप्तमी',
      'Ashtami': 'अष्टमी',
      'Navami': 'नवमी',
      'Dashami': 'दशमी',
      'Ekadashi': 'एकादशी',
      'Dwadashi': 'द्वादशी',
      'Trayodashi': 'त्रयोदशी',
      'Chaturdashi': 'चतुर्दशी',
      'Purnima': 'पूर्णिमा',
      'Amavasya': 'अमावस्या',
    };
    
    // Extract just the tithi name without Krishna/Shukla prefix if present
    const tithiParts = tithi.split(' ');
    const tithiName = tithiParts.length > 1 ? tithiParts[1] : tithi;
    
    return tithiMap[tithiName] || tithiName;
  };

  return (
    <div className="p-6">
      {Object.keys(eventsByMonth).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">No events found for this year</p>
          <p>Try selecting a different year or check back later</p>
        </div>
      ) : (
        <div>
          <h2 className="sr-only">Events for Year {year}</h2>
          {Object.keys(eventsByMonth).map((month) => (
            <div key={month} className="mb-8 animate-fadeIn">
              <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">{month}</h3>
              <div className="space-y-4">
                {eventsByMonth[month].map((event, index) => {
                  const { type, color, gradient, shadow } = getEventTypeAndColor(event);
                  const bsDate = event.date_bs || '';
                  const adDate = event.date_ad || event.date || '';
                  const tithi = event.tithi || getTithiForDate(bsDate);
                  
                  // Extract day number for display
                  let dayNumber = 'N/A';
                  if (bsDate.includes('-')) {
                    dayNumber = bsDate.split('-')[2];
                  } else if (bsDate.includes('.')) {
                    dayNumber = bsDate.split('.')[0];
                  }
                  
                  // Animation delay based on index for staggered appearance
                  const animationDelay = `${index * 0.1}s`;
                  
                  return (
                    <div 
                      key={index} 
                      className="border border-gray-100 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                      style={{ animationDelay }}
                    >
                      <div className="flex items-start">
                        <div className={`bg-gradient-to-br ${gradient} text-white rounded-md p-2 text-center min-w-[70px] mr-4 ${shadow}`}>
                          <div className="text-xs uppercase font-medium">{month}</div>
                          <div className="text-2xl font-bold">{dayNumber}</div>
                          <div className="text-xs text-white/80">{year}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{event.title || event.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className={`text-xs py-0.5 px-2 rounded-full ${color}`}>
                              {type}
                            </span>
                            <p className="text-sm text-gray-500">
                              BS: {formatDate(bsDate)} | AD: {formatDate(adDate)}
                            </p>
                          </div>
                          
                          {tithi && (
                            <div className="mt-2 text-sm text-gray-600 italic">
                              <strong>Tithi:</strong> {tithi} <span className="text-primary">(तिथि: {convertTithiToNepali(tithi)})</span>
                            </div>
                          )}
                          
                          {event.description && (
                            <div className="mt-2">
                              <h5 className="text-sm font-medium text-gray-700">Description:</h5>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                          )}
                          
                          {/* Additional details for SEO */}
                          <div className="sr-only">
                            <h5>Event Details</h5>
                            <p>Date: {formatDate(bsDate)} BS ({formatDate(adDate)} AD)</p>
                            <p>Type: {type}</p>
                            {tithi && <p>Tithi: {tithi}</p>}
                            {event.description && <p>Description: {event.description}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* SEO Information */}
          <div className="sr-only">
            <h2>Nepali Calendar Events for Year {year}</h2>
            <p>This page displays all festivals, holidays, and important events for the Nepali year {year}.</p>
            <p>Events are organized by month and include tithi information.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearEvents; 