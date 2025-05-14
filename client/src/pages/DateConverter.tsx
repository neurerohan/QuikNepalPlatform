import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import DateConverterForm from '@/components/ui/DateConverterForm';
import FadeIn from '@/components/ui/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { getCurrentNepaliDate, formatNepaliDate, getKathmanduTime } from '@/lib/nepaliDateConverter';
import SEO from '@/components/SEO';
import { FaCalendarAlt, FaExchangeAlt, FaGlobe, FaHistory, FaInfoCircle } from 'react-icons/fa';

// Background particles animation
const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-300/30"
          style={{
            width: Math.random() * 25 + 5,
            height: Math.random() * 25 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -30 + 15, 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
};

// Calendar feature card component
const CalendarFeatureCard = ({ title, icon, description, className }: {
  title: string;
  icon: React.ReactNode;
  description: string;
  className: string;
}) => {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-md overflow-hidden border ${className} hover:shadow-lg transition-all duration-300`}
      whileHover={{ y: -5 }}
    >
      <div className={`p-5 flex items-start space-x-4`}>
        <div className="text-3xl flex-shrink-0 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Month comparison table component
const MonthComparisonTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-indigo-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b">Nepali Month</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b">Approx. Gregorian Dates</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b">Days</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b">Season</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Baishakh (बैशाख)</td>
            <td className="py-3 px-4">mid-April to mid-May</td>
            <td className="py-3 px-4">30-32</td>
            <td className="py-3 px-4">Spring / Summer</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Jestha (जेष्ठ)</td>
            <td className="py-3 px-4">mid-May to mid-June</td>
            <td className="py-3 px-4">31-32</td>
            <td className="py-3 px-4">Summer</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Asar (असार)</td>
            <td className="py-3 px-4">mid-June to mid-July</td>
            <td className="py-3 px-4">31-32</td>
            <td className="py-3 px-4">Summer / Monsoon</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Shrawan (श्रावण)</td>
            <td className="py-3 px-4">mid-July to mid-August</td>
            <td className="py-3 px-4">31-32</td>
            <td className="py-3 px-4">Monsoon</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Bhadra (भाद्र)</td>
            <td className="py-3 px-4">mid-August to mid-September</td>
            <td className="py-3 px-4">31-32</td>
            <td className="py-3 px-4">Monsoon</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Ashwin (आश्विन)</td>
            <td className="py-3 px-4">mid-September to mid-October</td>
            <td className="py-3 px-4">30-31</td>
            <td className="py-3 px-4">Autumn</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Kartik (कार्तिक)</td>
            <td className="py-3 px-4">mid-October to mid-November</td>
            <td className="py-3 px-4">29-30</td>
            <td className="py-3 px-4">Autumn</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Mangsir (मंसिर)</td>
            <td className="py-3 px-4">mid-November to mid-December</td>
            <td className="py-3 px-4">29-30</td>
            <td className="py-3 px-4">Autumn / Winter</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Poush (पौष)</td>
            <td className="py-3 px-4">mid-December to mid-January</td>
            <td className="py-3 px-4">29-30</td>
            <td className="py-3 px-4">Winter</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Magh (माघ)</td>
            <td className="py-3 px-4">mid-January to mid-February</td>
            <td className="py-3 px-4">29-30</td>
            <td className="py-3 px-4">Winter</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Falgun (फाल्गुन)</td>
            <td className="py-3 px-4">mid-February to mid-March</td>
            <td className="py-3 px-4">29-30</td>
            <td className="py-3 px-4">Winter / Spring</td>
          </tr>
          <tr className="hover:bg-indigo-50/50">
            <td className="py-3 px-4 font-medium">Chaitra (चैत्र)</td>
            <td className="py-3 px-4">mid-March to mid-April</td>
            <td className="py-3 px-4">30-31</td>
            <td className="py-3 px-4">Spring</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface NepaliDateType {
  year: number;
  month: number;
  month_name: string;
  day: number;
  day_of_week: number;
  ad_date: string;
  bs_date: string;
}

const DateConverter = () => {
  const [currentNepaliDate, setCurrentNepaliDate] = useState<NepaliDateType | null>(null);
  const [currentGregorianDate, setCurrentGregorianDate] = useState<string | null>(null);
  const kathmanduTime = getKathmanduTime();
  const modifiedDate = kathmanduTime.toISOString();

  useEffect(() => {
    // Get current Nepali date
    const nepaliDate = getCurrentNepaliDate();
    setCurrentNepaliDate(nepaliDate);
    
    // Get current Gregorian date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentGregorianDate(today.toLocaleDateString('en-US', options));
  }, []);

  const pageTitle = "नेपाली मिति परिवर्तक | Nepali Date Converter";
  const pageDescription = "Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars easily with our date converter tool. Translate Nepali date into English and vice versa. The most accurate Nepali to English date converter available online.";
  const pageKeywords = "date converter, convert nepali date into english, translate nepali date into english, date converter english, nepali date, english date, BS to AD, AD to BS, bikram sambat, gregorian calendar";

  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        publishedDate="2024-01-01"
        modifiedDate={modifiedDate}
        canonicalUrl="https://quiknepal.com"
        pathname="/nepali-date-converter"
        ogImage="https://quiknepal.com/og-images/date-converter.jpg"
        ogType="website"
        twitterCardType="summary_large_image"
        schemaType="WebApplication"
        hrefLangs={[
          { lang: "en", url: "https://quiknepal.com/en/nepali-date-converter" },
          { lang: "ne", url: "https://quiknepal.com/ne/nepali-date-converter" }
        ]}
      />
      <MainLayout
        title={pageTitle}
        description={pageDescription}
      >
      <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <BackgroundParticles />
      <FadeIn>
          <section className="py-12 md:py-16 relative z-10">
          <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <motion.h1 
                  className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-3 tracking-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  नेपाली मिति परिवर्तक
                </motion.h1>
                <motion.h2 
                  className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Nepali Date Converter
                </motion.h2>
                <motion.p 
                  className="text-md text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our comprehensive date converter tool. Translate Nepali date into English or convert English date to Nepali with 100% accuracy.
                </motion.p>
                <motion.div
                  className="flex flex-wrap justify-center gap-2 mt-3 text-sm text-indigo-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="bg-indigo-100 px-2 py-1 rounded-full">Date Converter</span>
                  <span className="bg-indigo-100 px-2 py-1 rounded-full">Convert Nepali Date into English</span>
                  <span className="bg-indigo-100 px-2 py-1 rounded-full">Translate Nepali Date into English</span>
                  <span className="bg-indigo-100 px-2 py-1 rounded-full">Date Converter English</span>
                </motion.div>
              </div>

              {/* Current Date Display */}
              <div className="max-w-4xl mx-auto mb-10 flex flex-wrap justify-center gap-4">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-indigo-100 flex-1 min-w-[250px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-indigo-800 mb-1">Today's Gregorian Date</h3>
                    <p className="text-2xl font-bold text-gray-700">{currentGregorianDate || "Loading..."}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-indigo-100 flex-1 min-w-[250px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-indigo-800 mb-1">Today's Nepali Date</h3>
                    <p className="text-2xl font-bold text-gray-700">
                      {currentNepaliDate ? `${currentNepaliDate.day} ${currentNepaliDate.month_name} ${currentNepaliDate.year}` : "Loading..."}
            </p>
          </div>
                </motion.div>
              </div>

              {/* Main Converter Section */}
              <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-100 mb-10">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
              <h3 className="text-xl font-semibold text-white">BS/AD Date Converter</h3>
                  <p className="text-white/80 text-sm">Convert between Nepali (Bikram Sambat) and Gregorian calendar systems</p>
            </div>
            
            <DateConverterForm />
          </div>

              {/* Calendar Info Tabs */}
              <motion.div 
                className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-100 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Tabs defaultValue="about" className="w-full">
                  <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="about">About BS Calendar</TabsTrigger>
                      <TabsTrigger value="months">Nepali Months</TabsTrigger>
                      <TabsTrigger value="differences">Key Differences</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="about" className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-indigo-700 mb-3">विक्रम सम्वत् (Bikram Sambat) Calendar</h3>
                    
                    <p className="text-gray-700 mb-4">
                      The Bikram Sambat (BS) calendar is the official calendar of Nepal, introduced by King Vikramaditya in 57 BCE. It is approximately 56 years and 8 months ahead of the Gregorian (AD) calendar.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <CalendarFeatureCard 
                        title="Nepal's Official Calendar" 
                        icon={<svg className="text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>}
                        description="The Bikram Sambat calendar is the legal and official calendar of Nepal, used for all government, business, and daily activities."
                        className="border-indigo-200"
                      />
                      
                      <CalendarFeatureCard 
                        title="New Year: Baishakh 1" 
                        icon={<svg className="text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        description="The Nepali New Year begins in mid-April (around April 13-14), which corresponds to the first day of the month of Baishakh in the BS calendar."
                        className="border-green-200"
                      />
                      
                      <CalendarFeatureCard 
                        title="Lunar-Solar Calendar" 
                        icon={<svg className="text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                        description="The BS calendar is a lunar-solar calendar, with months beginning with the new moon and adjustments made to align with solar years."
                        className="border-amber-200"
                      />
                      
                      <CalendarFeatureCard 
                        title="Variable Month Lengths" 
                        icon={<svg className="text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        description="Unlike the Gregorian calendar, BS months can vary from 29 to 32 days, and the same month may have different lengths in different years."
                        className="border-rose-200"
                      />
                    </div>
                    
                    <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-700 mb-2">Historical Significance</h4>
                      <p className="text-gray-700 text-sm">
                        The Bikram Sambat calendar dates back over 2,000 years and has been an integral part of Nepali cultural and historical identity. It's named after King Vikramaditya, who is said to have defeated the Śaka rulers in 57 BCE. The calendar has continued to be used throughout Nepal's history and was officially adopted as the national calendar.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="months" className="p-6">
                    <h3 className="text-xl font-bold text-indigo-700 mb-4">Nepali Months and Their Gregorian Equivalents</h3>
                    <p className="text-gray-700 mb-6">
                      The Nepali calendar has 12 months with varying lengths. Here's how they align with the Gregorian calendar:
                    </p>
                    
                    <MonthComparisonTable />
                    
                    <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-700 mb-2">Seasonal Alignment</h4>
                      <p className="text-gray-700 text-sm">
                        The Nepali calendar is closely aligned with agricultural seasons and traditional festivals. The new year begins in mid-April (Baishakh) which coincides with the arrival of spring and harvest season. Major festivals like Dashain typically fall in Ashwin (September-October), and Tihar in Kartik (October-November).
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="differences" className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-indigo-700 mb-3">Key Differences: BS vs. Gregorian Calendar</h3>
                    
                    <div className="overflow-hidden bg-white rounded-lg shadow">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Feature</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Bikram Sambat (BS)</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Gregorian (AD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-3 px-4 font-medium">Year Difference</td>
                            <td className="py-3 px-4">56-57 years ahead of Gregorian</td>
                            <td className="py-3 px-4">Standard international calendar</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="py-3 px-4 font-medium">New Year Begins</td>
                            <td className="py-3 px-4">Mid-April (Baishakh 1)</td>
                            <td className="py-3 px-4">January 1</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium">Month Lengths</td>
                            <td className="py-3 px-4">Variable (29-32 days)</td>
                            <td className="py-3 px-4">Fixed (28/30/31 days)</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="py-3 px-4 font-medium">Leap Year</td>
                            <td className="py-3 px-4">Complex calculation based on lunar cycles</td>
                            <td className="py-3 px-4">Every 4 years (with century exceptions)</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium">Calendar Type</td>
                            <td className="py-3 px-4">Lunar-Solar</td>
                            <td className="py-3 px-4">Solar</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="py-3 px-4 font-medium">Day Count per Year</td>
                            <td className="py-3 px-4">Usually 354-356 days (with adjustments)</td>
                            <td className="py-3 px-4">365 or 366 days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-700 mb-2">Practical Implications</h4>
                      <p className="text-gray-700 text-sm">
                        Understanding these differences is crucial for travelers to Nepal, businesses working with Nepali partners, and anyone dealing with Nepali documents or deadlines. Government offices, schools, and businesses in Nepal primarily operate on the BS calendar, so knowing how to convert between the two systems is essential.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Usage Examples */}
              <motion.div 
                className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-100 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5">
                  <h3 className="text-xl font-semibold text-white">When You Need Date Conversion</h3>
                  <p className="text-white/80 text-sm">Practical scenarios where date conversion is useful</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 rounded-lg p-5">
                      <h4 className="text-lg font-semibold text-purple-700 mb-3">For Travelers to Nepal</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Understanding local festival dates that follow BS calendar</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Booking accommodations that list availability in BS dates</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Interpreting expiration dates on visas and permits</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-5">
                      <h4 className="text-lg font-semibold text-indigo-700 mb-3">For Business Purposes</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Converting contract deadlines from BS to AD dates</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Understanding Nepali fiscal years and tax deadlines</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Planning business operations around local holidays</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-5">
                      <h4 className="text-lg font-semibold text-blue-700 mb-3">For Document Processing</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Converting birthdates on official Nepali documents</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Verifying expiration dates on certificates and licenses</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Understanding filing deadlines for government offices</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-5">
                      <h4 className="text-lg font-semibold text-green-700 mb-3">For Cultural Understanding</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Understanding astrological implications in Nepali culture</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Planning for cultural events and celebrations</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Learning about historical events in Nepal's timeline</span>
                        </li>
                      </ul>
                    </div>
          </div>
                </div>
              </motion.div>
        </div>
      </section>
        </FadeIn>

      {/* Additional SEO Content Section */}
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border border-indigo-100">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Why Use Our Nepali Date Converter Tool?</h2>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Our date converter tool is designed to help you easily convert Nepali date into English and vice versa. Whether you need to translate Nepali date into English for official documents, travel planning, or cultural understanding, our tool provides accurate and reliable conversions.
              </p>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-indigo-700 mb-2">Key Benefits of Our Date Converter:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Instantly convert between Bikram Sambat (BS) and Gregorian (AD) calendars</li>
                  <li>100% accurate date conversion algorithms based on official Nepali calendar data</li>
                  <li>User-friendly interface that makes date conversion simple and intuitive</li>
                  <li>Comprehensive information about both calendar systems</li>
                  <li>Ability to translate Nepali date into English for any date in history</li>
                  <li>Helpful for travelers, researchers, and anyone working with Nepali dates</li>
                </ul>
              </div>
              
              <p>
                The Nepali calendar (Bikram Sambat) is approximately 56.7 years ahead of the Gregorian calendar, making manual conversion challenging. Our date converter English tool eliminates the complexity and potential for errors when you need to convert Nepali date into English.
              </p>
              
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                <div className="flex items-start">
                  <FaInfoCircle className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">Did You Know?</h4>
                    <p className="text-amber-700">
                      The Nepali calendar has different month lengths compared to the Gregorian calendar, and these can vary year to year. Our date converter tool accounts for all these variations to provide accurate translations when you convert Nepali date into English.
                    </p>
                  </div>
                </div>
              </div>
              
              <p>
                Whether you're planning travel to Nepal, working with Nepali documents, or simply curious about date differences between calendars, our date converter tool is your reliable solution for all date conversion needs. Try our tool today to easily translate Nepali date into English with just a few clicks!
              </p>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Published: January 1, 2024</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
    </>
  );
};

export default DateConverter;
