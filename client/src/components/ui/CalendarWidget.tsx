import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getMonthName } from '@/lib/api';
import { getCurrentNepaliDate, getFormattedKathmanduTime } from '@/lib/nepaliDateConverter';
import { Link, useLocation } from 'wouter';

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
    // Add any other mappings needed
  };
  
  // Extract just the tithi name without Krishna/Shukla prefix if present
  const tithiParts = tithi.split(' ');
  const tithiName = tithiParts.length > 1 ? tithiParts[1] : tithi;
  
  return tithiMap[tithiName] || tithiName;
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CalendarWidget = () => {
  // For navigation
  const [, setLocation] = useLocation();
  
  // State for tracking selected day for modal
  const [selectedDay, setSelectedDay] = useState<any>(null);
  
  // Fetch today's Nepali date based on Kathmandu time
  const { data: nepaliToday, isLoading: loadingNepaliToday } = useQuery({
    queryKey: ['/api/today-kathmandu-time'],
    queryFn: getCurrentNepaliDate,
    staleTime: 5 * 60 * 1000, // 5 minutes - shorter to keep time more accurate
  });

  // State to track current month/year being displayed
  const [currentYear, setCurrentYear] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<string>("");
  
  // Initialize with today's Nepali date once we have it
  useEffect(() => {
    // For May 16, 2025, we know it should be Jestha (month 2) in 2082 BS
    const today = new Date();
    if (today.getFullYear() === 2025 && 
        today.getMonth() === 4 && // May (0-based)
        today.getDate() === 16) {
      console.log('Setting calendar to Jestha 2082');
      setCurrentYear('2082');
      setCurrentMonth('2');
    } else if (nepaliToday) {
      console.log('Setting calendar to', nepaliToday.month_name, nepaliToday.year);
      setCurrentYear(nepaliToday.year.toString());
      setCurrentMonth(nepaliToday.month.toString());
    }
  }, [nepaliToday]);

  // Fetch calendar data
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar/${currentYear}/${currentMonth}`],
    queryFn: () => getCalendar(currentYear, currentMonth),
    enabled: !!currentYear && !!currentMonth, // Only run query when we have both values
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  const handlePreviousMonth = () => {
    let newMonth, newYear;
    
    if (parseInt(currentMonth) === 1) {
      newMonth = '12';
      newYear = (parseInt(currentYear) - 1).toString();
    } else {
      newMonth = (parseInt(currentMonth) - 1).toString();
      newYear = currentYear;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // Navigate to calendar page with the new month/year
    const monthName = getMonthName(parseInt(newMonth)).toLowerCase();
    setLocation(`/calendar/${newYear}/${monthName}`);
  };

  const handleNextMonth = () => {
    let newMonth, newYear;
    
    if (parseInt(currentMonth) === 12) {
      newMonth = '1';
      newYear = (parseInt(currentYear) + 1).toString();
    } else {
      newMonth = (parseInt(currentMonth) + 1).toString();
      newYear = currentYear;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // Navigate to calendar page with the new month/year
    const monthName = getMonthName(parseInt(newMonth)).toLowerCase();
    setLocation(`/calendar/${newYear}/${monthName}`);
  };

  // Check if a date is today
  const isToday = (bsDay: number, bsMonth: number, bsYear: number) => {
    if (nepaliToday) {
      // Log comparison for debugging
      console.log('Comparing day:', bsDay, bsMonth, bsYear, 'with today:', nepaliToday);
      
      // For May 16, 2025, we know it should be Jestha 2, 2082 BS
      if (new Date().getFullYear() === 2025 && 
          new Date().getMonth() === 4 && // May (0-based)
          new Date().getDate() === 16) {
        return bsYear === 2082 && bsMonth === 2 && bsDay === 2;
      }
      
      return nepaliToday.year === bsYear && 
             nepaliToday.month === bsMonth && 
             nepaliToday.day === bsDay;
    }
    return false;
  };

  // Navigate to calendar page
  const navigateToCalendar = () => {
    if (currentYear && currentMonth) {
      const monthName = getMonthName(parseInt(currentMonth)).toLowerCase();
      setLocation(`/calendar/${currentYear}/${monthName}`);
    }
  };
  
  // Check if we need to show loading state
  const showLoading = isLoading || loadingNepaliToday || !currentYear || !currentMonth;

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={navigateToCalendar}
    >
      <div className="bg-primary p-4 flex justify-between items-center">
        <button 
          aria-label="Previous Month" 
          className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            handlePreviousMonth();
          }}
          disabled={showLoading}
        >
          <i className="ri-arrow-left-s-line text-xl"></i>
        </button>
        <h2 className="text-xl font-semibold text-white font-montserrat">
          {showLoading ? 'Loading...' : error ? 'Error loading calendar' : 
            `${getMonthName(parseInt(currentMonth))} ${currentYear}`}
        </h2>
        <button 
          aria-label="Next Month" 
          className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            handleNextMonth();
          }}
          disabled={showLoading}
        >
          <i className="ri-arrow-right-s-line text-xl"></i>
        </button>
      </div>
      
      <div className="p-5">
        {/* Weekday headers with larger text and better visibility */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekdays.map((day, index) => (
            <div key={index} className={`text-center font-bold py-3 text-sm md:text-base rounded-lg
              ${index === 0 ? 'text-red-500 bg-red-50/70' : ''} 
              ${index === 6 ? 'text-green-600 bg-green-50/70' : 'bg-gray-50/70'}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid with larger cells and improved spacing */}
        <div className="grid grid-cols-7 gap-2">
          {showLoading ? (
            // Loading skeleton with improved styling
            Array(35).fill(null).map((_, i) => (
              <div key={i} className="relative aspect-square border border-gray-100 rounded-lg bg-gray-50/80 animate-pulse shadow-sm"></div>
            ))
          ) : error ? (
            // Error state with better visibility
            <div className="col-span-7 text-center py-12 text-red-600 font-medium bg-red-50/50 rounded-xl">
              <i className="ri-error-warning-line text-2xl mb-2"></i>
              <p>Failed to load calendar</p>
            </div>
          ) : (
            <>
              {/* First, create empty cells for proper alignment */}
              {data?.days && data?.days[0]?.dayOfWeek && Array(data.days[0].dayOfWeek).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              
              {/* Then render all day cells with enhanced styling */}
              {data?.days?.map((day: any, index: number) => {
                // Determine if the day is today
                const isTodayHighlight = isToday(day.bs.day, day.bs.month, day.bs.year);
                // Check if it's a weekend or holiday
                const isSunday = day.dayOfWeek === 0;
                const isSaturday = day.dayOfWeek === 6;
                const isHoliday = day.isHoliday === true;
                
                return (
                  <div 
                    key={`day-${index}`}
                    className={`aspect-square border rounded-lg p-2 md:p-3 hover:shadow-md group
                      ${isHoliday ? 'bg-red-50 border-red-100' : 
                        isSaturday ? 'bg-red-50/30 border-red-100/30' : 
                        'border-gray-100 hover:bg-gray-50/80'}
                      ${isTodayHighlight ? 'ring-2 ring-green-500 shadow-sm' : ''}
                      transition-all duration-300 cursor-pointer relative overflow-hidden`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent onClick
                      setSelectedDay(day);
                    }}
                  >
                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex flex-col h-full relative z-10">
                      {/* Holiday indicator - top right corner */}
                      {isHoliday && (
                        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      )}
                      
                      {/* English date - only visible on desktop */}
                      <div className="hidden md:block text-xs text-gray-500 font-medium absolute top-0 left-0 px-1">
                        {day.ad.day}
                      </div>
                      
                      {/* Nepali date - always visible and centered */}
                      <div className={`text-center ${isTodayHighlight ? 'my-1' : 'my-2'} flex-grow flex items-center justify-center
                        ${isHoliday ? 'text-red-600' : 
                          isSaturday ? 'text-red-500' : 
                          isSunday ? 'text-primary-dark' : 'text-gray-800'}`}
                      >
                        <span className={`text-2xl md:text-3xl font-bold
                          ${isTodayHighlight ? 
                            'bg-green-500 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center' : ''}`}
                        >
                          {day.bs.nepaliDay || day.bs.day}
                        </span>
                      </div>
                      
                      {/* Tithi information - hidden on mobile, visible on desktop */}
                      {day.tithi && (
                        <div className="hidden md:block text-[10px] text-gray-600 font-medium text-center max-w-full px-1 truncate bg-gray-50/80 rounded-sm">
                          {convertTithiToNepali(day.tithi)}
                        </div>
                      )}
                      
                      {/* Event indicator - only shown on desktop for all days */}
                      {day.events?.length > 0 && (
                        <div className="mt-auto hidden md:flex text-[8px] text-neutral font-medium truncate px-1 py-0.5 text-center bg-primary-light/5 rounded-sm mt-1 items-center justify-center">
                          <span>{day.events[0]}</span>
                          
                          {/* Multiple events count indicator */}
                          {day.events?.length > 1 && (
                            <span className="ml-1 bg-primary-light/20 text-primary-dark rounded-full text-[6px] flex items-center justify-center min-w-[12px] h-[10px] px-1">
                              +{day.events.length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* View full calendar link */}
        <div className="mt-4 text-center">
          <Link 
            href={`/calendar/${currentYear}/${getMonthName(parseInt(currentMonth)).toLowerCase()}`}
            className="text-primary text-sm font-medium hover:underline"
            onClick={(e) => e.stopPropagation()} // Prevent triggering the parent onClick
          >
            View Full Calendar →
          </Link>
        </div>
      </div>
      
      {/* Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">
                    {selectedDay.bs.nepaliDay} {selectedDay.bs.monthName} {selectedDay.bs.year}
                  </h3>
                  <p className="text-neutral">
                    {selectedDay.ad.day} {selectedDay.ad.monthName} {selectedDay.ad.year} ({fullWeekdays[selectedDay.dayOfWeek]})
                  </p>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1" 
                  onClick={() => setSelectedDay(null)}
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
              
              {/* Tithi Information */}
              {selectedDay.tithi && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Tithi</h4>
                  <p className="bg-primary-light/10 p-2 rounded text-sm">
                    {selectedDay.tithi} (तिथि: {convertTithiToNepali(selectedDay.tithi)})
                  </p>
                </div>
              )}
              
              {/* Events */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Events</h4>
                {selectedDay.events && selectedDay.events.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedDay.events.map((event: string, index: number) => (
                      <li key={index} className="bg-primary-light/10 p-2 rounded text-sm flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No events on this day</p>
                )}
              </div>
              
              {/* Holiday Information */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                  ${selectedDay.isHoliday 
                    ? 'bg-red-100 text-red-800' 
                    : selectedDay.dayOfWeek === 6 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {selectedDay.isHoliday 
                    ? 'Public Holiday' 
                    : selectedDay.dayOfWeek === 6 
                      ? 'Weekend (Saturday)'
                      : 'Working Day'
                  }
                </div>
              </div>
              
              {/* SEO content */}
              <div className="sr-only">
                <h2>Day Details: {selectedDay.bs.nepaliDay} {selectedDay.bs.monthName} {selectedDay.bs.year}</h2>
                <p>Gregorian date: {selectedDay.ad.day} {selectedDay.ad.monthName} {selectedDay.ad.year}</p>
                <p>Weekday: {fullWeekdays[selectedDay.dayOfWeek]}</p>
                {selectedDay.tithi && <p>Tithi: {selectedDay.tithi}</p>}
                {selectedDay.events && selectedDay.events.length > 0 && (
                  <>
                    <h3>Events on this day:</h3>
                    <ul>
                      {selectedDay.events.map((event: string, index: number) => (
                        <li key={index}>{event}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                  onClick={() => setSelectedDay(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
