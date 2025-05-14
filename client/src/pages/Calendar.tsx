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

// YearEvents component to display events for a specific year
const YearEvents = ({ year }: { year: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar-events?year_bs=${year}`],
    queryFn: () => getCalendarEvents({ year_bs: year }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading events...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Failed to load events data</div>;
  }

  if (!data || !data.calendar_events || data.calendar_events.length === 0) {
    return <div className="p-8 text-center text-gray-500">No events found for this year</div>;
  }

  return (
    <div className="p-6">
      <div>
        <h2>Events for Year {year}</h2>
        <p>Calendar events would be displayed here.</p>
      </div>
    </div>
  );
};

// Traditional festivals
const getTraditionalFestivals = (month: number) => {
  return [
    { name: 'Example Festival', description: 'Description of festival' }
  ];
};

// Calendar component
interface CalendarParams {
  year?: string;
  month?: string;
}

const Calendar = () => {
  const [location, setLocation] = useLocation();
  const params = useParams<CalendarParams>();
  const [todayNepaliDate, setTodayNepaliDate] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  
  // Default values
  let year = params.year || new Date().getFullYear().toString();
  let month = params.month || '1';
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  return (
    <MainLayout 
      title={`Nepali Calendar ${params.year} - ${getMonthName(parseInt(month))}` }
      description="View and navigate through Bikram Sambat (BS) calendar with corresponding Gregorian (AD) dates."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Nepali Calendar</h1>
            <p>Today: {today.toLocaleDateString()}</p>
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
                    <button className="text-white">Previous</button>
                    <h2 className="text-xl font-semibold text-white">
                      Calendar Header
                    </h2>
                    <button className="text-white">Next</button>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-7 mb-3">
                      {weekdays.map((day, index) => (
                        <div key={index} className="text-center font-medium py-2.5 text-sm">{day}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      <div className="p-4 text-center">Calendar grid would go here</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* YEAR EVENTS TAB */}
              <TabsContent value="events">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-primary p-4">
                    <h2 className="text-xl font-semibold text-white font-montserrat text-center">
                      Events for {year} BS
                    </h2>
                  </div>
                  
                  <div className="border-b border-gray-100">
                    <YearEvents year={year} />
                  </div>
                  
                  <AnnualEvents year={parseInt(year)} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Calendar;
