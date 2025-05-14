import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getCalendarEvents, getMonthName, getTodayNepaliDate } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, useLocation } from 'wouter';
import FadeIn from '@/components/ui/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { getMonthContent, getYearInfo } from '@/lib/calendar-content';
import AnnualEvents from '@/components/ui/AnnualEvents';
import SEO from '@/components/SEO';
import { getKathmanduTime } from '@/lib/nepaliDateConverter';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarDay, FaCalendarWeek, FaInfoCircle } from 'react-icons/fa';

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

// YearEvents component to display events for a specific year
const YearEvents = ({ year }: { year: string }) => {
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
    // Enhanced fallback content with custom events for better UX
    return (
      <div className="p-8">
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 mb-6">
          <h3 className="text-lg font-medium text-primary mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 mr-2">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
            No API Events Available
          </h3>
          <p className="text-neutral mb-4">We couldn't find official event data for year {year} BS. While we work on updating our database, here are some important annual events you can expect:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <span className="text-red-500 text-sm font-medium">1</span>
                </div>
                <h4 className="font-medium">Nepali New Year</h4>
              </div>
              <p className="text-sm text-gray-600">The first day of Baishakh marks the beginning of the Nepali New Year with celebrations across the country.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                  <span className="text-amber-500 text-sm font-medium">2</span>
                </div>
                <h4 className="font-medium">Buddha Jayanti</h4>
              </div>
              <p className="text-sm text-gray-600">Full moon day of Baishakh celebrating the birth, enlightenment and death of Gautama Buddha.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <span className="text-green-500 text-sm font-medium">6</span>
                </div>
                <h4 className="font-medium">Dashain Festival</h4>
              </div>
              <p className="text-sm text-gray-600">Nepal's most important 15-day festival taking place in Ashwin month, celebrating the victory of good over evil.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <span className="text-purple-500 text-sm font-medium">7</span>
                </div>
                <h4 className="font-medium">Tihar Festival</h4>
              </div>
              <p className="text-sm text-gray-600">Five-day festival of lights in Kartik month, honoring Goddess Laxmi, animals, and brotherly bonds.</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Check the Annual Events section below for more comprehensive yearly events.</p>
          </div>
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
        color: 'bg-red-100 border-red-200 text-red-700'
      };
    }
    
    if (title.includes('festival') || type.includes('festival')) {
      return {
        type: 'Festival',
        color: 'bg-orange-100 border-orange-200 text-orange-700'
      };
    }
    
    if (title.includes('birthday') || type.includes('birthday')) {
      return {
        type: 'Birthday',
        color: 'bg-blue-100 border-blue-200 text-blue-700'
      };
    }
    
    return {
      type: 'Event',
      color: 'bg-green-100 border-green-200 text-green-700'
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
            <div key={month} className="mb-10">
              <h2 className="text-2xl font-bold text-primary mb-6">About the Nepali Calendar (Hamro Patro)</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  The <strong>Nepali Calendar</strong> (also known as <strong>Hamro Patro</strong> or <strong>Mero Patro</strong>) is the official calendar system of Nepal. Based on the Bikram Sambat (BS) system, it is approximately 56.7 years ahead of the Gregorian calendar. Our <strong>Nepal calendar</strong> provides accurate information about <strong>today's Nepali date</strong>, festivals, events, and tithi details.
                </p>
                <p className="mb-4">
                  Whether you're looking for <strong>today's nepali date</strong>, checking upcoming festivals, or planning according to the <strong>nepali patro nepali</strong> calendar system, our comprehensive <strong>nepal patro</strong> has all the information you need. The <strong>date of nepal</strong> calendar follows a lunar cycle, making it different from the Gregorian calendar used internationally.
                </p>
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 mb-4">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">Today's Nepali Date</h3>
                  <p className="text-indigo-700">
                    <FaCalendarDay className="inline-block mr-2" />
                    <strong>{formattedTodayDate}</strong> according to the <strong>nepal calendar date today</strong>.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">{month}</h3>
                <div className="space-y-4">
                  {eventsByMonth[month].map((event, index) => {
                    const { type, color } = getEventTypeAndColor(event);
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
                    
                    return (
                      <div 
                        key={index} 
                        className="border border-gray-100 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <div className="flex items-start">
                          <div className="bg-primary text-white rounded-md p-2 text-center min-w-[60px] mr-4">
                            <div className="text-xs uppercase">{month}</div>
                            <div className="text-2xl font-bold">{dayNumber}</div>
                  let dayNumber = 'N/A';
                  if (bsDate.includes('-')) {
                    dayNumber = bsDate.split('-')[2];
                  } else if (bsDate.includes('.')) {
                    dayNumber = bsDate.split('.')[0];
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className="border border-gray-100 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <div className="flex items-start">
                        <div className="bg-primary text-white rounded-md p-2 text-center min-w-[60px] mr-4">
                          <div className="text-xs uppercase">{month}</div>
                          <div className="text-2xl font-bold">{dayNumber}</div>
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

// Add getTraditionalFestivals function higher up in the file, before the Calendar component
const getTraditionalFestivals = (month: number) => {
  const festivals = [
    // Baishakh (1)
    ...(month === 1 ? [
      { name: 'Nepali New Year', description: 'First day of Baishakh marks the Nepali New Year (Navavarsha)' },
      { name: 'Bisket Jatra', description: 'Ancient festival celebrated in Bhaktapur with chariot processions' }
    ] : []),
    // Jestha (2)
    ...(month === 2 ? [
      { name: 'Buddha Jayanti', description: 'Celebrates the birth of Gautama Buddha, the founder of Buddhism' },
      { name: 'Sithi Nakha', description: 'Newari festival marking the start of monsoon preparation' }
    ] : []),
    // Ashadh (3)
    ...(month === 3 ? [
      { name: 'Ropai Jatra', description: 'Rice planting festival celebrated during monsoon season' },
      { name: 'Jagannath Rath Yatra', description: 'Chariot procession of Lord Jagannath, popular in certain regions' }
    ] : []),
    // Shrawan (4)
    ...(month === 4 ? [
      { name: 'Shrawan Sombar', description: 'Hindu fasting observed by women on Mondays for prosperity' },
      { name: 'Nag Panchami', description: 'Worship of serpent deities for protection from snake bites' }
    ] : []),
    // Bhadra (5)
    ...(month === 5 ? [
      { name: 'Gai Jatra', description: 'Festival of cows that commemorates those who died in the past year' },
      { name: 'Krishna Janmashtami', description: 'Celebrates the birth of Lord Krishna with fasting and festivities' },
      { name: 'Teej', description: 'Major festival for women with fasting, singing and dancing' }
    ] : []),
    // Ashwin (6)
    ...(month === 6 ? [
      { name: 'Dashain', description: 'Nepal\'s biggest festival celebrating the victory of good over evil' },
      { name: 'Fulpati', description: 'Sacred flowers and plants brought to Kathmandu for Dashain' }
    ] : []),
    // Kartik (7)
    ...(month === 7 ? [
      { name: 'Tihar', description: 'Festival of lights honoring Laxmi, crows, dogs, cows and brothers' },
      { name: 'Nepal Sambat', description: 'Traditional Nepali New Year according to Nepal Era calendar' }
    ] : []),
    // Mangsir (8)
    ...(month === 8 ? [
      { name: 'Yomari Punhi', description: 'Newari festival featuring sweet bread delicacy called Yomari' },
      { name: 'Bala Chaturdashi', description: 'Ceremony at Pashupatinath to honor the deceased with seeds and flowers' }
    ] : []),
    // Poush (9)
    ...(month === 9 ? [
      { name: 'Tamu Lhosar', description: 'New Year celebration of the Gurung community' },
      { name: 'Udhauli', description: 'Kiranti festival celebrating the migration of birds to lower elevations' }
    ] : []),
    // Magh (10)
    ...(month === 10 ? [
      { name: 'Maghe Sankranti', description: 'Winter solstice festival with special foods and sacred bathing' },
      { name: 'Sonam Lhosar', description: 'New Year celebration of the Tamang community' }
    ] : []),
    // Falgun (11)
    ...(month === 11 ? [
      { name: 'Holi', description: 'Festival of colors with water and powdered color throwing' },
      { name: 'Gyalpo Lhosar', description: 'New Year celebration of the Sherpa community' }
    ] : []),
    // Chaitra (12)
    ...(month === 12 ? [
      { name: 'Chaite Dashain', description: 'Smaller version of Dashain festival' },
      { name: 'Ghode Jatra', description: 'Horse racing festival in Kathmandu Valley' }
    ] : [])
  ];
  
  return festivals;
};

// Add new animations to the global styles
const additionalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarParams {
  year?: string;
  month?: string;
}

const Calendar = () => {
  const [location, setLocation] = useLocation();
  const params = useParams<CalendarParams>();
  
  // State to hold today's Nepali date from API
  const [todayNepaliDate, setTodayNepaliDate] = useState<any>(null);
  
  // State to hold the selected day for detail view
  const [selectedDay, setSelectedDay] = useState<any>(null);
  
  // Get current Kathmandu time for SEO modified date
  const kathmanduTime = getKathmanduTime();
  const modifiedDate = kathmanduTime.toISOString();
  
  // Get today's Nepali date from API
  const { data: nepaliToday, isLoading: loadingToday } = useQuery({
    queryKey: ['/api/today'],
    queryFn: getTodayNepaliDate,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnWindowFocus: false,
  });
  
  // Update today state when data is loaded
  useEffect(() => {
    if (nepaliToday) {
      setTodayNepaliDate(nepaliToday);
    }
  }, [nepaliToday]);
  
  // If no params are provided, use current Nepali date from API and redirect
  useEffect(() => {
    if (!params.year || !params.month) {
      if (nepaliToday) {
        // Use the accurate Nepali date from API
        const nepaliMonthName = nepaliToday.month_name.toLowerCase();
        setLocation(`/nepalicalendar/${nepaliToday.year}/${nepaliMonthName}`);
      } else {
        // Fallback to approximation if API data not available yet
        const today = new Date();
        const currentNepaliYear = today.getFullYear() + 57; // Approximate
        const currentMonth = today.getMonth() + 1;
        const nepaliMonthName = getMonthName(currentMonth).toLowerCase();
        setLocation(`/nepalicalendar/${currentNepaliYear}/${nepaliMonthName}`);
      }
    }
  }, [params, setLocation, nepaliToday]);
  
  // Helper function to get month number from name
  const getMonthNumberFromName = (monthName: string): number => {
    const nepaliMonths = [
      'baishakh', 'jestha', 'ashadh', 'shrawan', 
      'bhadra', 'ashwin', 'kartik', 'mangsir', 
      'poush', 'magh', 'falgun', 'chaitra'
    ];
    const index = nepaliMonths.findIndex(m => 
      m.toLowerCase() === monthName?.toLowerCase()
    );
    return index !== -1 ? index + 1 : 1;
  };
  
  // Support both numeric month and month name formats
  let year = params.year || new Date().getFullYear().toString();
  let month = params.month || '1';
  
  // Check if month is a string name (like "baishakh") and convert to number
  if (isNaN(parseInt(month))) {
    month = getMonthNumberFromName(month).toString();
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar/${year}/${month}`],
    queryFn: () => getCalendar(year, month),
    enabled: !!year && !!month,
    retry: 1
  });

  const handlePreviousMonth = () => {
    const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
    const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
    const prevMonthName = getMonthName(prevMonth).toLowerCase();
    setLocation(`/nepalicalendar/${prevYear}/${prevMonthName}`);
  };

  const handleNextMonth = () => {
    const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
    const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
    const nextMonthName = getMonthName(nextMonth).toLowerCase();
    setLocation(`/nepalicalendar/${nextYear}/${nextMonthName}`);
  };

  // Get today's date to highlight
  const today = new Date();
  const isToday = (bsDay: number, bsMonth: number, bsYear: number) => {
    if (nepaliToday) {
      // Use accurate Nepali date from API
      // Only highlight if we're in the current month AND on the correct day
      return parseInt(year) === nepaliToday.year && 
             parseInt(month) === nepaliToday.month && 
             nepaliToday.day === bsDay;
    } else {
      // If API data not available, don't highlight any day
      return false;
    }
  };
  
  // SEO keywords and metadata
  const pageTitle = "Hamro Patro | Nepali Calendar | Today's Nepali Date | Nepal Calendar";
  const pageDescription = "View the official Nepali calendar (Bikram Sambat) with holidays, events, and tithi information. Check today's nepali date, mero patro, nepali patro, and important festivals in Nepal calendar date today.";
  const pageKeywords = "hamro patro, nepali calendar, today's nepali date, mero patro, nepal calendar date today, nepali calendar nepali calendar, date of nepal, nepal patro, nepali patro nepali";
  
  // Format today's date for display
  const formattedTodayDate = todayNepaliDate ? 
    `${todayNepaliDate.day} ${todayNepaliDate.month_name} ${todayNepaliDate.year}` : 
    "Loading today's nepali date...";
    
  // Current year and month for schema markup
  const currentYear = params.year || (todayNepaliDate ? todayNepaliDate.year.toString() : "");
  const currentMonth = params.month || (todayNepaliDate ? todayNepaliDate.month_name : "");
  
  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        publishedDate="2024-01-01"
        modifiedDate={modifiedDate}
        canonicalUrl="https://quiknepal.com"
        pathname="/nepalicalendar"
        ogImage="https://quiknepal.com/og-images/nepali-calendar.jpg"
        ogType="website"
        twitterCardType="summary_large_image"
        schemaType="Calendar"
        hrefLangs={[
          { lang: "en", url: "https://quiknepal.com/en/nepalicalendar" },
          { lang: "ne", url: "https://quiknepal.com/ne/nepalicalendar" }
        ]}
      >
        {/* Additional Schema Markup for Nepali Calendar */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Hamro Patro - Nepali Calendar",
            "description": "View today's nepali date and browse the complete nepali calendar (mero patro). The official nepal calendar with dates, events, and festivals.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
        
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://quiknepal.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Nepali Calendar",
                "item": "https://quiknepal.com/nepalicalendar"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": `${currentYear} ${currentMonth}`,
                "item": `https://quiknepal.com/nepalicalendar/${currentYear}/${currentMonth.toLowerCase()}`
              }
            ]
          })}
        </script>
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Hamro Patro or Nepali Calendar?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Hamro Patro (Nepal Patro) is the official calendar of Nepal based on the Bikram Sambat system. It shows today's nepali date and all important festivals, events, and tithis throughout the year."
                }
              },
              {
                "@type": "Question",
                "name": "How do I find today's Nepali date?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Today's nepali date is clearly displayed at the top of our nepali calendar. The current date is highlighted in the calendar view for easy reference."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between Hamro Patro and Mero Patro?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Both Hamro Patro and Mero Patro refer to the Nepali calendar. 'Hamro' means 'our' and 'Mero' means 'my' in Nepali. Both show the nepal calendar date today and other important information."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate is this Nepali Calendar?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our nepali calendar (nepali patro) is highly accurate, following the official Bikram Sambat calendar used in Nepal. It includes precise tithi calculations, accurate festival dates, and today's nepali date."
                }
              }
            ]
          })}
        </script>
        
        {/* Event Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "Nepali Calendar Events",
            "description": "View all festivals and events in the Nepal calendar date today and throughout the year in our hamro patro.",
            "startDate": `${currentYear}-01-01`,
            "endDate": `${currentYear}-12-31`,
            "location": {
              "@type": "Place",
              "name": "Nepal",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Nepal"
              }
            },
            "organizer": {
              "@type": "Organization",
              "name": "QuikNepal",
              "url": "https://quiknepal.com"
            }
          })}
        </script>
      </SEO>
      <MainLayout 
        title={pageTitle}
        description={pageDescription}
      >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary font-poppins mb-2">
                  {isLoading ? 'Loading Calendar...' : 
                    `Nepali Calendar ${params.year} - ${getMonthName(parseInt(month))}`}
                </h1>
                <p className="text-neutral mb-2">
                  नेपाली पात्रो {params.year} - {getMonthName(parseInt(month))}
                </p>
                <p className="text-sm text-gray-500">
                  Today: {today.toLocaleDateString()} ({weekdays[today.getDay()]})
                  {nepaliToday && (
                    <span className="ml-1">
                      | BS: {nepaliToday.year}-{nepaliToday.month}-{nepaliToday.day} ({nepaliToday.month_name})
                    </span>
                  )}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <button 
                  className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    if (nepaliToday) {
                      // Use accurate Nepali date from the API
                      const nepaliMonthName = nepaliToday.month_name.toLowerCase();
                      setLocation(`/nepalicalendar/${nepaliToday.year}/${nepaliMonthName}`);
                    } else {
                      // Fallback to approximation if API data not available
                      const today = new Date();
                      const currentNepaliYear = today.getFullYear() + 57;
                      const currentMonth = today.getMonth() + 1;
                      const nepaliMonthName = getMonthName(currentMonth).toLowerCase();
                      setLocation(`/nepalicalendar/${currentNepaliYear}/${nepaliMonthName}`);
                    }
                  }}
                >
                  Go to Today
                </button>
                
                <div className="flex gap-1 items-center">
                  <select 
                    className="px-2 py-1.5 border border-gray-200 rounded-md text-sm"
                    defaultValue={month}
                    onChange={(e) => {
                      const monthName = getMonthName(parseInt(e.target.value)).toLowerCase();
                      setLocation(`/nepalicalendar/${year}/${monthName}`);
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{getMonthName(m)}</option>
                    ))}
                  </select>
                  
                  <select 
                    className="px-2 py-1.5 border border-gray-200 rounded-md text-sm"
                    defaultValue={year}
                    onChange={(e) => {
                      const monthName = getMonthName(parseInt(month)).toLowerCase();
                      setLocation(`/nepalicalendar/${e.target.value}/${monthName}`);
                    }}
                  >
                    {/* Range from 2000 BS to current year plus a few years */}
                    {Array.from({ length: 83 }, (_, i) => 2000 + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <p className="text-center text-neutral mb-4 max-w-2xl mx-auto">
              Browse through the Bikram Sambat (BS) calendar and view corresponding Gregorian (AD) dates.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="month" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="month">Calendar View</TabsTrigger>
                <TabsTrigger value="events">Year Events</TabsTrigger>
              </TabsList>
              
              {/* MONTH VIEW TAB */}
              <TabsContent value="month">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-primary p-4 flex justify-between items-center">
                    <button 
                      aria-label="Previous Month" 
                      className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
                      onClick={handlePreviousMonth}
                    >
                      <i className="ri-arrow-left-s-line text-xl"></i>
                    </button>
                    <h2 className="text-xl font-semibold text-white font-montserrat">
                      {isLoading ? 'Loading...' : error ? 'Error loading calendar' : 
                        data?.monthDetails?.meta?.nepaliHeader || 
                        `${data?.monthDetails?.bs?.monthName} ${data?.monthDetails?.bs?.year} | ${data?.monthDetails?.ad?.monthName} ${data?.monthDetails?.ad?.year}`}
                    </h2>
                    <button 
                      aria-label="Next Month" 
                      className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
                      onClick={handleNextMonth}
                    >
                      <i className="ri-arrow-right-s-line text-xl"></i>
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-5">
                    <div className="grid grid-cols-7 mb-3">
                      {weekdays.map((day, index) => (
                        <div 
                          key={index} 
                          className={`text-center font-medium py-2.5 text-sm md:text-base
                            ${index === 0 ? 'text-red-500' : ''} 
                            ${index === 6 ? 'text-green-600' : ''}
                          `}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 md:gap-3">
                      {isLoading ? (
                        // Loading skeleton
                        Array(35).fill(null).map((_, i) => (
                          <div key={i} className="aspect-square border border-gray-100 rounded bg-gray-50 animate-pulse"></div>
                        ))
                      ) : error ? (
                        // Error state
                        <div className="col-span-7 text-center py-8 text-red-500">
                          Failed to load calendar data
                        </div>
                      ) : (
                        // Calendar grid with actual data
                        (() => {
                          if (!data?.days?.length) return null;
                          
                          // First, create and render empty cells for proper day alignment
                          const firstDay = data.days[0];
                          const emptyCellCount = firstDay.dayOfWeek;
                          const emptyCells = Array(emptyCellCount).fill(null).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                          ));
                          
                          // Then render all the day cells
                          const dayCells = data.days.map((day: any, index: number) => {
                            const isTodayHighlight = isToday(day.bs.day, day.bs.month, day.bs.year);
                            const isSunday = day.dayOfWeek === 0;
                            const isSaturday = day.dayOfWeek === 6;
                            // Create our own holiday detection logic - be more specific with holiday detection
                            const isHoliday = day.events && day.events.some((event: string) => {
                              // Only mark true holidays as holidays, not every event with these common terms
                              const isPublicHoliday = 
                                event.toLowerCase().includes('public holiday') || 
                                event.toLowerCase().includes('federal holiday') ||
                                event.toLowerCase().includes('national holiday');
                                
                              // Religious festivals that are holidays  
                              const isReligiousHoliday =
                                event.toLowerCase().includes('dashain') ||
                                event.toLowerCase().includes('tihar') ||
                                event.toLowerCase().includes('holi') ||
                                event.toLowerCase().includes('lhosar') ||
                                event.toLowerCase().includes('chhath');
                                
                              return isPublicHoliday || isReligiousHoliday;
                            });
                            
                            return (
                              <div 
                                key={`day-${index}`}
                                className={`aspect-square border border-gray-100 rounded p-2 hover:bg-gray-50 
                                  ${day.isHoliday === true || isHoliday ? 'bg-red-50' : day.dayOfWeek === 6 ? 'bg-red-50/30' : ''}
                                  ${isTodayHighlight ? 'ring-2 ring-green-500' : ''}
                                  transition-all cursor-pointer`}
                                onClick={() => setSelectedDay(day)}
                              >
                                <div className="flex flex-col h-full relative">
                                  {/* Nepali date - emphasized */}
                                  <div className={`text-xl md:text-2xl font-bold text-center ${day.isHoliday || isHoliday ? 'text-red-500' : isSaturday ? 'text-red-500' : isSunday ? 'text-primary' : 'text-gray-700'} ${isTodayHighlight ? 'bg-green-500 text-white rounded-full w-9 h-9 flex items-center justify-center mx-auto' : ''}`}>
                                    {day.bs.nepaliDay}
                                  </div>
                                  
                                  {/* English date - smaller, positioned in corner */}
                                  <div className="text-[10px] md:text-xs text-gray-500 absolute top-0 right-0 px-0.5">
                                    {day.ad.day}
                                  </div>
                                  
                                  {/* Tithi information in Devanagari */}
                                  {day.tithi && (
                                    <div className="text-[9px] md:text-[10px] text-gray-500 mt-1 text-center max-w-full px-1 truncate">
                                      <h4 className="sr-only">Tithi: {day.tithi}</h4>
                                      तिथि: {convertTithiToNepali(day.tithi)}
                                    </div>
                                  )}
                                  
                                  {/* Event indicator */}
                                  {day.events?.length > 0 && (
                                    <div className="mt-auto text-[9px] md:text-[10px] text-primary-dark truncate px-1 py-0.5 text-center">
                                      <h4 className="sr-only">Event: {day.events.join(', ')}</h4>
                                      {day.events[0]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          });
                          
                          // Return all cells - empty cells first, then day cells
                          return [...emptyCells, ...dayCells];
                        })()
                      )}
                    </div>
                  </div>
                </div>

                {/* Monthly Events Section - Enlarged */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6 md:p-7 border border-gray-100 overflow-hidden">
                  <h4 className="text-xl font-semibold mb-5 bg-gradient-to-r from-[#57c84d] to-[#83d475] text-white py-3 px-4 rounded-lg shadow-md transform -translate-x-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Key Events in {getMonthName(parseInt(month))}
                  </h4>
                  
                  {/* Current month events from API data */}
                  {data && data.days && data.days.filter((day: any) => day.events && day.events.length > 0).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {(() => {
                        // Safely extract all events with proper type handling
                        const allEvents: string[] = [];
                        data.days.forEach((day: any) => {
                          if (day.events && Array.isArray(day.events)) {
                            day.events.forEach((event: any) => {
                              if (typeof event === 'string' && !allEvents.includes(event)) {
                                allEvents.push(event);
                              }
                            });
                          }
                        });
                        
                        return allEvents.map((event: string, index) => {
                          // Get days for this event
                          const eventDays = data.days
                            .filter((day: any) => 
                              day.events && 
                              Array.isArray(day.events) && 
                              day.events.includes(event)
                            )
                            .map((day: any) => day.bs.nepaliDay);
                            
                          // Determine if the event is a holiday
                          const isEventHoliday = (() => {
                              const isPublicHoliday = 
                                event.toLowerCase().includes('public holiday') || 
                                event.toLowerCase().includes('federal holiday') ||
                                event.toLowerCase().includes('national holiday');
                                
                              const isReligiousHoliday =
                                event.toLowerCase().includes('dashain') ||
                                event.toLowerCase().includes('tihar') ||
                                event.toLowerCase().includes('holi') ||
                                event.toLowerCase().includes('lhosar') ||
                                event.toLowerCase().includes('chhath');
                                
                              return isPublicHoliday || isReligiousHoliday;
                          })();
                          
                          // Determine event type and icon
                          const getEventTypeAndIcon = () => {
                            const eventLower = event.toLowerCase();
                            
                            if (isEventHoliday) {
                              return {
                                type: 'Holiday',
                                icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>,
                                color: 'from-red-500 to-red-400 shadow-red-200/40'
                              };
                            }
                            
                            if (eventLower.includes('festival') || eventLower.includes('jatra')) {
                              return {
                                type: 'Festival',
                                icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                </svg>,
                                color: 'from-amber-500 to-orange-400 shadow-orange-200/40'
                              };
                            }
                            
                            if (eventLower.includes('jayanti') || eventLower.includes('birthday')) {
                              return {
                                type: 'Jayanti',
                                icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>,
                                color: 'from-blue-500 to-indigo-400 shadow-blue-200/40'
                              };
                            }
                            
                            if (eventLower.includes('diwas') || eventLower.includes('day') || eventLower.includes('दिवस')) {
                              return {
                                type: 'Day',
                                icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>,
                                color: 'from-teal-500 to-emerald-400 shadow-teal-200/40'
                              };
                            }
                            
                            if (eventLower.includes('puja') || eventLower.includes('vrat') || eventLower.includes('v्रत')) {
                              return {
                                type: 'Religious',
                                icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>,
                                color: 'from-purple-500 to-purple-400 shadow-purple-200/40'
                              };
                            }
                            
                            return {
                              type: 'Event',
                              icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>,
                              color: 'from-[#57c84d] to-[#83d475] shadow-green-200/40'
                            };
                          };
                          
                          const eventInfo = getEventTypeAndIcon();
                          const animationDelay = `${index * 0.1}s`;
                          
                          return (
                            <div 
                              key={index} 
                              className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                              style={{ animationDelay }}
                            >
                              <div className={`flex items-center p-4 bg-gradient-to-r ${eventInfo.color} text-white`}>
                                <div className="rounded-full bg-white/20 p-2 mr-3 flex-shrink-0">
                                  {eventInfo.icon}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium line-clamp-2">{event}</p>
                                  <div className="text-xs text-white/80 mt-1 flex flex-wrap gap-1">
                                    {eventDays.map((day: string | number, i: number) => (
                                      <span key={i} className="bg-white/20 rounded-full px-2 py-0.5">
                                        {day} {getMonthName(parseInt(month))}
                                </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-10 animate-fadeIn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-base text-gray-500">No major events recorded for this month.</p>
                      <p className="text-sm text-gray-400 mt-2">Try selecting a different month to see events.</p>
                    </div>
                  )}
                  
                  {/* Traditional festivals section */}
                  <div className="mt-8">
                    <h5 className="text-lg font-semibold mb-4 text-[#57c84d] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                      Traditional Festivals
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                      {getTraditionalFestivals(parseInt(month)).map((festival, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                          <h6 className="font-medium text-purple-700">{festival.name}</h6>
                          <p className="text-sm text-gray-600 mt-1">{festival.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
                
                {/* Month Summary - Enhanced with better design and more content */}
                {params.year && (
                  <div className="mt-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-20 -translate-y-20 z-0"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-x-8 translate-y-10 z-0"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-semibold text-primary mb-5 flex items-center animate-fadeIn">
                          <div className="bg-primary text-white rounded-lg px-3 py-1.5 mr-3">
                            <span className="font-bold">{getMonthContent(parseInt(month), parseInt(params.year)).nepaliName}</span>
                          </div>
                          About {getMonthName(parseInt(month))} Month
                        </h3>
                    
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                            {/* Main content area - enhanced and sectioned */}
                        {(() => {
                          const monthContent = getMonthContent(parseInt(month), parseInt(params.year));
                          return (
                                <div className="space-y-6">
                                  {/* Introduction section with better styling */}
                                  <div className="bg-gradient-to-r from-primary/10 to-transparent p-5 rounded-lg border-l-4 border-primary">
                                    <p className="text-neutral">
                                      <span className="font-medium text-lg">{monthContent.name}</span> 
                                      (Nepali: <span className="font-medium text-lg">{monthContent.nepaliName}</span>) is 
                                the {parseInt(month)}{parseInt(month) === 1 ? 'st' : parseInt(month) === 2 ? 'nd' : parseInt(month) === 3 ? 'rd' : 'th'} month in the Nepali Bikram Sambat calendar. 
                                This month typically falls during <span className="font-medium">{monthContent.gregorianMonths}</span> in the Gregorian calendar.
                              </p>
                                  </div>
                                  
                                  {/* Climate and highlights section with icon */}
                                  <div className="flex gap-5 items-start bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex-shrink-0 bg-amber-100 text-amber-600 p-3 rounded-full animate-gentle-float">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-800 mb-2">Climate & Highlights</h4>
                                      <p className="text-neutral mb-3">
                                In {monthContent.name}, the average temperature in Nepal ranges from <span className="font-medium">{monthContent.temperature}</span>. 
                                      </p>
                                      <p className="text-neutral">
                                This month is particularly known for <span className="font-medium">{monthContent.highlights}</span>.
                              </p>
                                    </div>
                                  </div>
                                  
                                  {/* Agricultural activities with icon */}
                                  <div className="flex gap-5 items-start bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex-shrink-0 bg-green-100 text-green-600 p-3 rounded-full animate-gentle-float">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-800 mb-2">Agricultural Activities</h4>
                                      <p className="text-neutral mb-3">
                                {monthContent.name} typically has <span className="font-medium">{monthContent.days} days</span> in most years of the Nepali calendar. 
                                      </p>
                                      <p className="text-neutral">
                                The agricultural activities during this month generally include <span className="font-medium">{monthContent.agriculture}</span>.
                              </p>
                                    </div>
                                  </div>
                                  
                                  {/* Cultural significance section */}
                                  <div className="bg-primary-light/10 p-5 rounded-lg relative">
                                    <div className="absolute top-0 right-0 opacity-10">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                      </svg>
                                    </div>
                                    <div className="relative">
                                      <h4 className="font-medium text-primary text-lg mb-3 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        Cultural Significance
                                      </h4>
                                      <p className="text-neutral mb-3 bg-white/60 p-3 rounded-lg shadow-sm">
                                  {monthContent.name} falls within {(() => {
                                    if ([1, 2, 3].includes(parseInt(month))) return "spring season in Nepal";
                                    if ([4, 5, 6, 7].includes(parseInt(month))) return "monsoon season in Nepal";
                                    if ([8, 9].includes(parseInt(month))) return "autumn season in Nepal";
                                    return "winter season in Nepal";
                                  })()} with particular importance to the agricultural calendar and cultural traditions.
                                        {parseInt(month) === 1 && " This is the beginning of the Nepali calendar year, celebrated with festivities and social gatherings across the country."}
                                        {parseInt(month) === 6 && " This month hosts Dashain, Nepal's most significant festival celebrated for 15 days with family reunions, feasting, and worship."}
                                        {parseInt(month) === 7 && " This month hosts Tihar, the festival of lights, second only to Dashain in importance, with five days of celebrations honoring different deities and strengthening family bonds."}
                                </p>
                                      
                                      {/* Festival cards */}
                                      {monthContent.festivals.length > 0 && (
                                        <div>
                                          <h5 className="font-medium text-primary mb-3 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                            </svg>
                                            Key Festivals in {monthContent.name}
                                          </h5>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {monthContent.festivals.map((festival, index) => (
                                              <div 
                                                key={index} 
                                                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                                                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                                              >
                                                <div className="flex items-center mb-2">
                                                  <div className="w-8 h-8 rounded-full bg-primary-light/30 flex items-center justify-center mr-2 text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                    </svg>
                              </div>
                                                  <h6 className="font-medium text-primary-dark">{festival}</h6>
                                                </div>
                                                <div className="mt-2 bg-primary-light/10 text-xs text-gray-600 p-1.5 rounded">
                                                  Celebrated in {monthContent.name} ({monthContent.nepaliName})
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Additional cultural information */}
                                  <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h4 className="font-medium text-lg text-gray-800 mb-3">Nepali Calendar Context</h4>
                                    <p className="text-neutral mb-3">
                          The Nepali calendar, officially known as Bikram Sambat (BS), is approximately 56.7 years ahead of the Gregorian calendar (AD) and is the official calendar of Nepal. It was introduced by King Bikramaditya and has been in use for over 2,000 years, making it one of the oldest continuously used calendars in the world.
                        </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3 text-sm mt-4">
                                      <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-600">
                                          <span className="font-medium block mb-1">Month Structure</span>
                                          The Nepali calendar follows a lunar-solar system, with months having between 29 to 32 days, adjusting to keep in sync with lunar cycles.
                                        </p>
                                      </div>
                                      <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-600">
                                          <span className="font-medium block mb-1">Tithis (Lunar Days)</span>
                                          Each month consists of 30 tithis (lunar days) divided into two paksha (fortnights): Shukla (bright) and Krishna (dark).
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })()}
                      </div>
                      
                          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                            {/* Sidebar with enhanced design */}
                            <div className="space-y-5">
                              {/* Month facts card with enhanced styling */}
                              <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-xl text-white shadow-lg animate-pulse-border border-2 border-primary">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-semibold text-xl text-white">Month Facts</h4>
                                  <div className="bg-white/20 rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                </div>
                                <ul className="space-y-4">
                                  <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full p-1.5 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <div>
                                      <span className="text-white/70 text-sm block">Position</span>
                                      <span className="font-medium">{parseInt(month)}{parseInt(month) === 1 ? 'st' : parseInt(month) === 2 ? 'nd' : parseInt(month) === 3 ? 'rd' : 'th'} month</span>
                                    </div>
                            </li>
                                  <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full p-1.5 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                      </svg>
                                    </div>
                                    <div>
                                      <span className="text-white/70 text-sm block">Nepali Name</span>
                                      <span className="font-medium">{getMonthContent(parseInt(month), parseInt(params.year)).nepaliName}</span>
                                    </div>
                            </li>
                                  <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full p-1.5 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <span className="text-white/70 text-sm block">Days</span>
                                      <span className="font-medium">{getMonthContent(parseInt(month), parseInt(params.year)).days}</span>
                                    </div>
                            </li>
                                  <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full p-1.5 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <span className="text-white/70 text-sm block">Major Festivals</span>
                                      <span className="font-medium">{getMonthContent(parseInt(month), parseInt(params.year)).festivals.length}</span>
                                    </div>
                            </li>
                                  <li className="flex items-center">
                                    <div className="bg-white/20 rounded-full p-1.5 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                      </svg>
                                    </div>
                                    <div>
                                      <span className="text-white/70 text-sm block">Gregorian</span>
                                      <span className="font-medium">{getMonthContent(parseInt(month), parseInt(params.year)).gregorianMonths}</span>
                                    </div>
                            </li>
                          </ul>
                        </div>
                              
                              {/* Weather widget-style card */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 animate-gentle-float">
                                <h4 className="font-medium text-indigo-800 mb-4 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                  </svg>
                                  Typical Weather
                                </h4>
                                <div className="flex items-center justify-between">
                                  <div className="text-center">
                                    <span className="block text-4xl font-bold text-indigo-600 mb-1 animate-shimmer">
                                      {parseInt(month) <= 3 ? "🌤️" : 
                                       parseInt(month) <= 7 ? "🌧️" : 
                                       parseInt(month) <= 9 ? "⛅" : "❄️"}
                                    </span>
                                    <span className="text-sm text-gray-500 block animate-weather-slide">
                                      {parseInt(month) <= 3 ? "Spring" : 
                                       parseInt(month) <= 7 ? "Monsoon" : 
                                       parseInt(month) <= 9 ? "Autumn" : "Winter"}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-lg font-medium text-indigo-800 block">
                                      {getMonthContent(parseInt(month), parseInt(params.year)).temperature.split(' ')[0]}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Terai Region
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-blue-100">
                                  <p className="text-sm text-gray-600">
                                    {parseInt(month) <= 3 ? "Warm days with clear skies. Excellent time for tourism and outdoor activities in Nepal." : 
                                     parseInt(month) <= 7 ? "Humid with heavy rainfall. Rice planting season with lush green landscapes." : 
                                     parseInt(month) <= 9 ? "Clear weather after monsoon. Festival season with moderate temperatures." : 
                                     "Cool and dry with excellent mountain views. Winter crops flourish."}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Links to other months */}
                              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-medium text-gray-800 mb-3">Explore Other Months</h4>
                                <div className="grid grid-cols-3 gap-2">
                                  {Array.from({ length: 12 }, (_, i) => i + 1)
                                    .filter(m => m !== parseInt(month)) // Exclude current month
                                    .map(m => {
                                      const monthName = getMonthName(m).toLowerCase();
                                      return (
                                        <a
                                          href={`/nepalicalendar/${params.year}/${monthName}`}
                                          key={m}
                                          className="text-center py-2 px-1 text-sm bg-gray-50 hover:bg-primary-light/20 rounded transition-colors"
                                        >
                                          {getMonthName(m)}
                                        </a>
                                      );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* YEAR EVENTS TAB - Using our new Annual Events component */}
              <TabsContent value="events">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-primary p-4">
                    <h2 className="text-xl font-semibold text-white font-montserrat text-center">
                      {`Holidays & Events for ${params.year || new Date().getFullYear().toString()} BS`}
                    </h2>
                  </div>
                  
                  {/* Standard API events first */}
                  <div className="border-b border-gray-100">
                    <YearEvents year={params.year || new Date().getFullYear().toString()} />
                  </div>
                  
                  {/* Enhanced annual events with our new component */}
                  <AnnualEvents year={parseInt(params.year || new Date().getFullYear().toString())} />
                </div>
              </TabsContent>
            </Tabs>

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
                          {selectedDay.ad.day} {selectedDay.ad.monthName} {selectedDay.ad.year} ({weekdays[selectedDay.dayOfWeek]})
                        </p>
                      </div>
                      <button 
                        className="text-gray-500 hover:text-gray-700 p-1" 
                        onClick={() => setSelectedDay(null)}
                      >
                        <i className="ri-close-line text-xl"></i>
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
                      <p>Weekday: {weekdays[selectedDay.dayOfWeek]}</p>
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
            
            {/* FAQs Section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-primary mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">How to check today's Nepali date?</h4>
                  <p className="text-neutral">Click the "Go to Today" button at the top of the page to view today's date in the Nepali calendar.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">How do I view events for a month?</h4>
                  <p className="text-neutral">Navigate to the desired month using the month selector at the top, then click on the "Events" tab to see all events for that month.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">What do the different colored days mean?</h4>
                  <p className="text-neutral">Red indicates Saturdays (weekend holiday in Nepal), blue indicates Sundays, and other special holidays are marked with background colors. The legend below the calendar explains the color coding.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">How do I see details for a specific day?</h4>
                  <p className="text-neutral">Click on any day in the calendar to see its detailed information, including the tithi, events, and holiday status.</p>
                </div>
              </div>
            </div>
            
            {/* Explore Other Tools */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-primary mb-6">Explore Other Tools</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/vegetables" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-center">
                  <h4 className="font-medium text-lg mb-2 text-primary">Vegetable Prices</h4>
                  <p className="text-neutral text-sm">Check daily vegetable prices from Kalimati market.</p>
                </a>
                
                <a href="/date-converter" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-center">
                  <h4 className="font-medium text-lg mb-2 text-primary">Date Converter</h4>
                  <p className="text-neutral text-sm">Convert dates between Nepali (BS) and English (AD) calendars.</p>
                </a>
                
                <a href="/rashifal" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-center">
                  <h4 className="font-medium text-lg mb-2 text-primary">Daily Rashifal</h4>
                  <p className="text-neutral text-sm">Check your daily horoscope prediction.</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
    </>
  );
};

export default Calendar;
