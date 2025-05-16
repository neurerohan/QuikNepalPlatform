import MainLayout from '@/components/layout/MainLayout';
import FadeIn from '@/components/ui/FadeIn';
import Bounce from '@/components/ui/Bounce';
import CalendarWidget from '@/components/ui/CalendarWidget';
import FeatureCard from '@/components/ui/FeatureCard';
import DataTable from '@/components/ui/DataTable';
import SEO from '@/components/SEO';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  getVegetables, 
  getMetals, 
  getRashifal, 
  getCalendarEvents 
} from '@/lib/api';
import { getCurrentNepaliDate, getKathmanduTime, getFormattedKathmanduTime } from '@/lib/nepaliDateConverter';

const Home = () => {
  // Get sample vegetable data for the preview
  const vegetablesQuery = useQuery({
    queryKey: ['/api/vegetables'],
    queryFn: getVegetables,
    staleTime: 3600000 // 1 hour
  });

  // Get sample metal data for the preview
  const metalsQuery = useQuery({
    queryKey: ['/api/metals'],
    queryFn: getMetals,
    staleTime: 3600000 // 1 hour
  });

  // Get sample rashifal data for the preview
  const rashifalQuery = useQuery({
    queryKey: ['/api/rashifal'],
    queryFn: () => getRashifal(), // Wrap in anonymous function to match expected signature
    staleTime: 3600000 // 1 hour
  });

  // Get current date and time in Kathmandu time zone
  const kathmanduTime = getKathmanduTime();
  const formattedDate = kathmanduTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get current time in Kathmandu
  const formattedTime = getFormattedKathmanduTime('short');
  
  // For SEO metadata
  const modifiedDate = kathmanduTime.toISOString();
  
  // Get today's Nepali date based on Kathmandu time
  const { data: nepaliToday, isLoading: loadingNepaliToday } = useQuery({
    queryKey: ['/api/today-kathmandu-time'],
    queryFn: getCurrentNepaliDate,
    staleTime: 5 * 60 * 1000, // 5 minutes - shorter to keep time more accurate
  });
  
  // Get today's events
  const { data: eventsData } = useQuery({
    queryKey: ['/api/calendar-events'],
    queryFn: () => getCalendarEvents({}),
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  const vegetableColumns = [
    { header: 'Item', accessor: 'name' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Min Price', accessor: 'minPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Max Price', accessor: 'maxPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Avg Price', accessor: 'avgPrice', cell: (value: number) => `Rs. ${value}` },
  ];

  // SEO optimization
  
  // SEO title and description with keywords
  const pageTitle = "QuikNepal - Your Essential Nepali Information Hub | Nepali Calendar, Rashifal, Vegetable Rates";
  const pageDescription = "Access Nepali calendars, vegetable rates, metal prices, rashifal readings and more at QuikNepal, your comprehensive Nepali information portal. Get today's Nepali date, daily horoscope, and latest market prices in Nepal.";
  const pageKeywords = "nepali calendar, hamro patro, mero patro, vegetable rates in nepal, gold price in nepal, rashifal, horoscope, nepali date today, nepal calendar, nepali patro";
  
  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        publishedDate="2024-01-01"
        modifiedDate={modifiedDate}
        canonicalUrl="https://quiknepal.com"
        pathname="/"
        ogImage="https://quiknepal.com/og-images/home-page.jpg"
        ogType="website"
        twitterCardType="summary_large_image"
        schemaType="WebPage"
        hrefLangs={[
          { lang: "en", url: "https://quiknepal.com/en" },
          { lang: "ne", url: "https://quiknepal.com/ne" }
        ]}
      >
        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "QuikNepal",
            "url": "https://quiknepal.com",
            "logo": "https://quiknepal.com/logo.png",
            "description": "Your comprehensive Nepali information portal for calendars, vegetable rates, metal prices, and rashifal readings.",
            "sameAs": [
              "https://facebook.com/quiknepal",
              "https://twitter.com/quiknepal",
              "https://instagram.com/quiknepal"
            ]
          })}
        </script>

        {/* WebSite Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "QuikNepal",
            "url": "https://quiknepal.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://quiknepal.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* FAQPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I check today's Nepali date?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can check today's Nepali date on our homepage or by visiting our Calendar page. We display both Gregorian (AD) and Bikram Sambat (BS) dates based on Nepal Time Zone (UTC+5:45)."
                }
              },
              {
                "@type": "Question",
                "name": "How often are vegetable prices updated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vegetable prices are updated daily based on the latest market rates in Kalimati, Kathmandu. Each update includes minimum, maximum, and average prices per unit."
                }
              },
              {
                "@type": "Question",
                "name": "Where can I find today's gold and silver prices in Nepal?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can find today's gold and silver prices on our Metals page. We provide daily updates for different types of gold (24K, 22K, etc.) and silver as per Nepal Gold and Silver Dealers' Association."
                }
              }
            ]
          })}
        </script>
      </SEO>
      
      <MainLayout
        title="QuikNepal - Your Essential Nepali Information Hub"
        description="Access Nepali calendars, vegetable rates, metal prices, rashifal readings and more at QuikNepal, your comprehensive Nepali information portal."
      >
      {/* Hero Section - Completely Rebuilt */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-primary to-primary-light overflow-hidden flex items-center">
        {/* Background animated pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="#fff" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-20 left-[10%] w-40 h-40 bg-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[10%] w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-[10%] text-5xl text-white/15 animate-float" style={{ animationDuration: '8s' }}>
          <i className="ri-calendar-line"></i>
        </div>
        
        <div className="absolute top-1/3 right-[18%] text-6xl text-white/15 animate-float" style={{ animationDuration: '9s', animationDelay: '0.5s' }}>
          <i className="ri-gold-bar-line"></i>
        </div>
        
        <div className="absolute bottom-1/4 left-[15%] text-5xl text-white/15 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}>
          <i className="ri-star-line"></i>
        </div>
        
        <div className="absolute bottom-1/3 right-[20%] text-5xl text-white/15 animate-float" style={{ animationDuration: '7s', animationDelay: '1.5s' }}>
          <i className="ri-shopping-basket-line"></i>
        </div>
        
        {/* Content Container */}
        <div className="container relative mx-auto px-4 py-20 flex flex-col justify-center items-center text-center">
          {/* Badge */}
          <div className="inline-block relative mb-6 bg-transparent">
            <div className="text-lg md:text-xl font-medium bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 shadow-lg">
              <span className="text-yellow-200 font-semibold">नमस्ते</span> <span className="text-white">नेपाल</span>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-poppins mb-8 text-white text-shadow-sm tracking-tight bg-transparent">
            Essential Nepali Information Hub
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light mb-12 text-white/90 leading-relaxed bg-transparent">
            Your comprehensive resource for Nepali calendars, vegetable rates, metal prices, rashifal readings and more
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-6 bg-transparent">
            <Link 
              href="/calendar" 
              className="bg-white text-primary font-bold py-4 px-10 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center shadow-md" 
              aria-label="Explore Nepali Calendar"
            >
              <i className="ri-calendar-2-line mr-3 text-xl"></i> 
              <span>Explore Calendar</span>
            </Link>
            
            <Link 
              href="#features" 
              className="bg-primary-dark/20 text-white backdrop-blur-lg font-medium py-4 px-10 rounded-xl hover:bg-primary-dark/40 transition-all duration-300 flex items-center border border-white/20 shadow-md group" 
              aria-label="Discover Features"
            >
              <i className="ri-apps-line mr-3 text-xl"></i> 
              <span>Discover Features</span>
              <i className="ri-arrow-right-line ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
            </Link>
          </div>
        </div>
        
        {/* Wave effect at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-12 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C172,20,295,50,321.39,56.44Z" 
              className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Calendar Widget Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <CalendarWidget />
            
            <div className="mt-6 bg-primary-light/20 rounded-lg p-4 flex items-start gap-4">
              <div className="text-primary-dark rounded-full bg-white p-2 mt-1">
                <i className="ri-calendar-line text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-primary-dark text-lg mb-1">Today's Date</h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
                    <p className="text-xs text-gray-500">Gregorian (AD)</p>
                    <p className="text-primary-dark font-medium">{formattedDate}</p>
                    <p className="text-xs text-gray-500 mt-1">Kathmandu Time</p>
                    <p className="text-primary-dark font-medium">{formattedTime}</p>
                  </div>
                  
                  {nepaliToday ? (
                    <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
                      <p className="text-xs text-gray-500">Bikram Sambat (BS)</p>
                      <p className="text-primary-dark font-medium">
                        {nepaliToday.day} {nepaliToday.month_name} {nepaliToday.year}
                      </p>
                      <p className="text-xs text-primary-dark/70 mt-1 bg-green-50 inline-block px-2 py-1 rounded">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                        Nepal Time Zone (UTC+5:45)
                      </p>
                    </div>
                  ) : loadingNepaliToday ? (
                    <div className="bg-white rounded-lg p-2 shadow-sm flex-1 animate-pulse">
                      <p className="text-xs text-gray-300">Loading Nepali date...</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
                      <p className="text-xs text-gray-500">Bikram Sambat (BS)</p>
                      <p className="text-red-400 text-sm">Error loading Nepali date</p>
                    </div>
                  )}
                </div>
                
                {/* Display today's events if available */}
                {eventsData?.calendar_events?.length > 0 && (
                  <div className="mt-3 bg-white p-2 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-primary-dark mb-1">Today's Events</h4>
                    <ul className="space-y-1">
                      {eventsData.calendar_events.slice(0, 2).map((event: any, index: number) => (
                        <li key={index} className="text-xs text-neutral flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {event.title || event.name}
                        </li>
                      ))}
                    </ul>
                    {eventsData.calendar_events.length > 2 && (
                      <Link href="/calendar" className="text-xs text-primary hover:underline mt-1 inline-block">
                        + {eventsData.calendar_events.length - 2} more events
                      </Link>
                    )}
                  </div>
                )}
                
                <div className="mt-2 text-right">
                  <Link href="/nepalicalendar/2082/baishakh" className="text-primary text-xs font-medium hover:underline">
                    View Full Calendar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Sections */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary font-poppins mb-10 text-center">Our Featured Services</h2>
          
          {/* Vegetable Price Tracker */}
          <div className="flex flex-col md:flex-row gap-12 items-center mb-20 relative">
            {/* Animated decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full animate-pulse" style={{ animationDuration: '7s' }}></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/5 rounded-full animate-pulse" style={{ animationDuration: '10s' }}></div>
            
            <FadeIn className="md:w-1/2 relative z-10">
              <div className="relative">
                <span className="absolute -top-6 left-0 text-xs font-semibold bg-primary text-white px-3 py-1 rounded-full">
                  UPDATED DAILY
                </span>
                <h3 className="text-2xl font-bold text-primary font-poppins mb-4 mt-2">Vegetable Price Tracker</h3>
              </div>
              
              <p className="text-neutral mb-6">Stay informed about current vegetable prices at Kalimati Market to make better shopping decisions. Our tracker provides:</p>
              
              <ul className="space-y-3 mb-8">
                {['Daily updated prices for common vegetables', 
                  'Minimum and maximum price ranges for each item', 
                  'Price trend indicators to track changes', 
                  'Easy-to-read table format with sorting options'].map((item, index) => (
                  <FadeIn key={index} delay={0.2 + (index * 0.1)}>
                    <li className="flex items-start group">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-primary-light/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <i className="ri-check-line"></i>
                      </div>
                      <span className="group-hover:text-primary-dark transition-colors duration-300">{item}</span>
                    </li>
                  </FadeIn>
                ))}
              </ul>
              
              <Bounce>
                <Link 
                  href="/kalimati-vegetable-price" 
                  className="inline-flex items-center bg-primary text-white font-medium py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <span className="relative">
                    <span className="absolute inset-0 bg-white/20 animate-pulse rounded-md" style={{ animationDuration: '2s' }}></span>
                    <span className="relative">View Vegetable Prices</span>
                  </span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </Link>
              </Bounce>
            </FadeIn>
            
            <div className="md:w-1/2 relative z-10">
              <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-100 bg-white">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-primary">Today's Vegetable Prices</h3>
                    <span className="text-xs text-gray-500">{`Last updated: ${formattedDate}`}</span>
                  </div>
                  
                  {vegetablesQuery.isLoading ? (
                    <div className="space-y-4 py-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4 items-center animate-pulse">
                          <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                          <div className="flex-1">
                            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                          </div>
                          <div className="h-6 w-14 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {(vegetablesQuery.data || []).slice(0, 5).map((item: any, index: number) => (
                        <FadeIn key={index} delay={0.1 * index} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-4 group">
                            <div className="h-10 w-10 bg-primary-light/10 flex items-center justify-center rounded-md text-primary">
                              <i className="ri-leaf-line text-lg"></i>
                            </div>
                            
                            <div className="flex-1">
                              <div className="font-medium group-hover:text-primary transition-colors duration-300">
                                {item.name_nepali ? `${item.name} (${item.name_nepali})` : item.name}
                              </div>
                              <div className="text-xs text-gray-500">Per {item.unit}</div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-primary-dark">
                                Rs. {parseFloat(item.avg_price).toFixed(2)}
                              </div>
                              <div className="text-xs flex items-center gap-1 justify-end">
                                {parseFloat(item.min_price) < parseFloat(item.avg_price) * 0.9 ? (
                                  <span className="text-green-500 flex items-center"><i className="ri-arrow-down-line"></i> Low: Rs.{parseFloat(item.min_price).toFixed(2)}</span>
                                ) : parseFloat(item.max_price) > parseFloat(item.avg_price) * 1.1 ? (
                                  <span className="text-red-500 flex items-center"><i className="ri-arrow-up-line"></i> High: Rs.{parseFloat(item.max_price).toFixed(2)}</span>
                                ) : (
                                  <span className="text-gray-500 flex items-center"><i className="ri-arrow-right-line"></i> Stable</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-5 text-center">
                    <Link href="/kalimati-vegetable-price" className="text-primary text-sm hover:underline inline-flex items-center">
                      See all vegetable prices <i className="ri-arrow-right-s-line ml-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rashifal Service */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center mb-20 relative">
            {/* Animated background decorations */}
            <div className="absolute -top-16 -right-8 w-40 h-40 bg-yellow-50 rounded-full animate-pulse opacity-40" style={{ animationDuration: '6s' }}></div>
            <div className="absolute -bottom-8 -left-12 w-56 h-56 bg-blue-50 rounded-full animate-pulse opacity-50" style={{ animationDuration: '8s' }}></div>
            
            {/* Zodiac symbol animations */}
            <div className="hidden md:block">
              {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((symbol, index) => (
                <div key={index} 
                  className="absolute text-primary-light/20 text-2xl animate-float" 
                  style={{ 
                    top: `${Math.random() * 100}%`,
                    right: `${(index * 8) % 100}%`,
                    animationDuration: `${5 + Math.random() * 5}s`,
                    animationDelay: `${index * 0.3}s` 
                  }}>
                  {symbol}
                </div>
              ))}
            </div>
            
            <FadeIn className="md:w-1/2 relative z-10">
              <div className="relative">
                <span className="absolute -top-6 right-0 text-xs font-semibold bg-purple-600 text-white px-3 py-1 rounded-full">
                  DAILY UPDATES
                </span>
                <h3 className="text-2xl font-bold text-primary font-poppins mb-4 mt-2">Daily Rashifal Readings</h3>
              </div>
              <p className="text-neutral mb-6">Access personalized daily horoscope predictions based on traditional Nepali astrology. Our Rashifal service features:</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Daily updated predictions for all 12 zodiac signs',
                  'Guidance on relationships, career, health, and finances',
                  'Traditional Nepali astrological interpretations',
                  'Beautiful, interactive zodiac sign cards'
                ].map((item, index) => (
                  <FadeIn key={index} delay={0.2 + (index * 0.1)}>
                    <li className="flex items-start group">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                        <i className="ri-check-line"></i>
                      </div>
                      <span className="group-hover:text-purple-800 transition-colors duration-300">{item}</span>
                    </li>
                  </FadeIn>
                ))}
              </ul>
              
              <Bounce>
                <Link 
                  href="/nepali-rashifal" 
                  className="group inline-flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <i className="ri-star-line mr-2"></i>
                  <span>Read Your Rashifal</span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </Link>
              </Bounce>
            </FadeIn>
            
            <div className="md:w-1/2 relative z-10">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Stars animation in background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#57c84d] to-[#83d475]">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span 
                      key={i}
                      className="absolute inline-block bg-white rounded-full animate-twinkle"
                      style={{
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative p-6 text-white z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <i className="ri-moon-fill text-2xl mr-2 text-yellow-200"></i>
                      <h3 className="text-xl font-semibold">आजको राशिफल</h3>
                    </div>
                    <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{formattedDate}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    {rashifalQuery.data && rashifalQuery.data.predictions ? (
                      rashifalQuery.data.predictions.slice(0, 4).map((sign: any, index: number) => (
                        <FadeIn key={index} delay={0.1 * index}>
                          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-inner group">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white">
                                {sign.sign_english ? sign.sign_english.charAt(0) : '✨'}
                              </div>
                              <h4 className="font-medium text-white">{sign.sign_nepali}</h4>
                            </div>
                            <p className="text-sm text-white/90 mt-2 line-clamp-3 group-hover:text-white transition-colors duration-300">{sign.prediction}</p>
                          </div>
                        </FadeIn>
                      ))
                    ) : (
                      <div className="col-span-2 p-6 text-center">
                        <div className="animate-pulse bg-white/20 h-5 w-3/4 mx-auto rounded mb-3"></div>
                        <div className="animate-pulse bg-white/20 h-4 w-2/3 mx-auto rounded"></div>
                        <div className="animate-pulse bg-white/20 h-4 w-1/2 mx-auto rounded mt-3"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-white/90 text-sm mb-3">Find guidance for your zodiac sign today</p>
                    <Link href="/nepali-rashifal" 
                      className="inline-block bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-2 rounded-lg font-medium border border-white/30 transition-all duration-300 hover:shadow-lg group">
                      <span className="inline-flex items-center">
                        <span>View All Signs</span>
                        <i className="ri-arrow-right-s-line ml-1 group-hover:translate-x-1 transition-transform duration-200"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Date Converter Service */}
          <div className="flex flex-col md:flex-row gap-12 items-center relative">
            {/* Animated decorative elements */}
            <div className="absolute -bottom-16 -left-8 w-40 h-40 bg-primary/5 rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -top-8 -right-12 w-48 h-48 bg-sky-50 rounded-full animate-pulse opacity-50" style={{ animationDuration: '10s' }}></div>
            
            {/* Calendar date animations */}
            <div className="hidden md:block">
              {Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index} 
                  className="absolute text-primary/5 font-bold text-3xl animate-float" 
                  style={{ 
                    top: `${15 + (index * 15)}%`,
                    left: `${5 + (index * 3)}%`,
                    animationDuration: `${6 + Math.random() * 4}s`,
                    animationDelay: `${index * 0.5}s`,
                    transform: `rotate(${-5 + (index * 2)}deg)`
                  }}>
                  {index % 2 === 0 ? (2080 + index) : (2023 + index)}
                </div>
              ))}
            </div>
            
            <FadeIn className="md:w-1/2 relative z-10">
              <div className="relative">
                <span className="absolute -top-6 left-0 text-xs font-semibold bg-blue-500 text-white px-3 py-1 rounded-full">
                  REAL-TIME CONVERSION
                </span>
                <h3 className="text-2xl font-bold text-primary font-poppins mb-4 mt-2">BS-AD Date Converter</h3>
              </div>
              
              <p className="text-neutral mb-6">Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our precise conversion tool. Features include:</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Instant conversion between Nepali and Gregorian calendars',
                  'Simple, intuitive interface with date pickers',
                  'Additional date information including day of week and tithis',
                  'Support for dates from 1975 BS to 2100 BS'
                ].map((item, index) => (
                  <FadeIn key={index} delay={0.2 + (index * 0.1)}>
                    <li className="flex items-start group">
                      <div className="mr-3 mt-1 p-1 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <i className="ri-check-line"></i>
                      </div>
                      <span className="group-hover:text-blue-800 transition-colors duration-300">{item}</span>
                    </li>
                  </FadeIn>
                ))}
              </ul>
              
              <Bounce>
                <Link 
                  href="/nepali-date-converter" 
                  className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <i className="ri-calendar-line mr-2"></i>
                  <span>Convert Dates</span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </Link>
              </Bounce>
            </FadeIn>
            
            <div className="md:w-1/2 relative z-10">
              <div className="relative overflow-hidden rounded-xl shadow-lg p-6 bg-white border border-gray-100">
                {/* Animated gradient border */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#57c84d] via-blue-500 to-[#83d475]"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-primary flex items-center">
                      <i className="ri-calendar-event-line mr-2 text-blue-500"></i>
                      Date Converter
                    </h3>
                    <div className="flex items-center text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      <i className="ri-time-line mr-1"></i> Instant
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <FadeIn delay={0.1}>
                      <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="inline-block w-3 h-3 bg-[#57c84d] rounded-full mr-2"></span>
                            Convert from BS to AD
                          </div>
                          <div className="text-xs text-gray-400">Bikram Sambat → Gregorian</div>
                        </div>
                        <div className="flex gap-3 items-center justify-between">
                          <div className="font-medium text-neutral group-hover:text-primary transition-colors duration-300">2080 Kartik 15</div>
                          <div className="text-2xl text-primary relative">
                            <i className="ri-arrow-right-line group-hover:animate-pulse"></i>
                          </div>
                          <div className="font-medium text-neutral group-hover:text-primary transition-colors duration-300">2023 November 1</div>
                        </div>
                      </div>
                    </FadeIn>
                    
                    <FadeIn delay={0.2}>
                      <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                            Convert from AD to BS
                          </div>
                          <div className="text-xs text-gray-400">Gregorian → Bikram Sambat</div>
                        </div>
                        <div className="flex gap-3 items-center justify-between">
                          <div className="font-medium text-neutral group-hover:text-blue-600 transition-colors duration-300">2025 April 14</div>
                          <div className="text-2xl text-blue-500 relative">
                            <i className="ri-arrow-right-line group-hover:animate-pulse"></i>
                          </div>
                          <div className="font-medium text-neutral group-hover:text-blue-600 transition-colors duration-300">2082 Baishakh 1</div>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      href="/nepali-date-converter" 
                      className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors group"
                    >
                      <span>Try the converter yourself</span>
                      <i className="ri-arrow-right-s-line ml-1 group-hover:translate-x-1 transition-transform duration-200"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary font-poppins mb-4">Explore Our Features</h2>
            <p className="text-neutral max-w-2xl mx-auto">Access a wide range of essential Nepali information and utilities in one place</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Nepali Calendar"
              description="Access a comprehensive Bikram Sambat (BS) calendar with corresponding Gregorian (AD) dates."
              icon="calendar-2"
              link="/nepali-calendar"
              linkText="View Calendar"
            />
            
            <FeatureCard 
              title="Date Converter"
              description="Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars."
              icon="repeat"
              link="/nepali-date-converter"
              linkText="Convert Dates"
            />
            
            <FeatureCard 
              title="Vegetable Rates"
              description="Track current vegetable prices from Kalimati market to make informed shopping decisions."
              icon="shopping-basket"
              link="/kalimati-vegetable-price"
              linkText="Check Rates"
            />
            
            <FeatureCard 
              title="Metal Prices"
              description="Stay updated with the latest gold and silver prices in the Nepali market."
              icon="coin"
              link="/gold-and-silver-in-nepal"
              linkText="View Prices"
            />
            
            <FeatureCard 
              title="Rashifal"
              description="Read daily horoscope predictions for all zodiac signs in the Nepali tradition."
              icon="star"
              link="/nepali-rashifal"
              linkText="Read Rashifal"
            />
            
            <FeatureCard 
              title="Forex Rates"
              description="Check current and historical foreign exchange rates for Nepali Rupee (NPR)."
              icon="exchange-dollar"
              link="/foreign-currency-exchange"
              linkText="View Forex Rates"
            />
          </div>
        </div>
      </section>

      {/* SEO-friendly Informational Section - Enhanced and Dynamic */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10"></div>
          <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-primary/5"></div>
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-primary/5"></div>
        </div>
        
        {/* Decorative icons */}
        <div className="absolute top-20 right-16 text-primary/10 text-6xl transform rotate-12">
          <i className="ri-calendar-2-line"></i>
        </div>
        <div className="absolute bottom-16 left-10 text-primary/10 text-5xl transform -rotate-12">
          <i className="ri-coin-line"></i>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="flex flex-col items-center">
                <span className="inline-block bg-primary/10 text-primary-dark font-medium px-4 py-2 rounded-full text-sm mb-4">
                  NEPALI INFORMATION HUB
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-poppins mb-4 text-center">
                  The Ultimate Nepali Information Resource
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#57c84d] to-[#83d475] rounded-full mb-8"></div>
              </div>
            </FadeIn>
            
            <div className="prose prose-lg max-w-none text-neutral">
              <FadeIn>
                <p className="text-lg md:text-xl leading-relaxed">
                  QuikNepal provides comprehensive Nepali information resources designed specifically for the unique needs of Nepali citizens and anyone interested in Nepal. Our platform integrates essential daily utilities with cultural context to make everyday life easier for Nepali users.
                </p>
              </FadeIn>
              
              {/* Calendar section with image and text in card layout */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-12 md:mt-16 hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-2/5 bg-gradient-to-br from-[#57c84d] to-[#83d475] p-8 md:p-10 flex items-center justify-center">
                    <div className="flex flex-col items-center text-white">
                      <div className="text-7xl mb-4">
                        <i className="ri-calendar-2-line"></i>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-center mb-2">Bikram Sambat Calendar</h3>
                      <div className="bg-white/20 px-4 py-2 rounded-lg mt-2">
                        <span className="text-white font-medium">२०८०</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8 md:p-10">
                    <FadeIn delay={0.1}>
                      <h3 className="text-primary font-bold text-2xl md:text-3xl mb-4">The Importance of Nepali Calendar</h3>
                      <p className="mb-4">
                        The Bikram Sambat calendar holds immense cultural significance in Nepal, serving as the country's official calendar system. It's not just a way to track dates—it's integral to planning festivals, religious ceremonies, and agricultural activities.
                      </p>
                      <div className="bg-gray-50 rounded-xl p-5 mt-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Our detailed calendar features:</h4>
                        <ul className="space-y-2">
                          {[
                            'Traditional festivals and celebrations highlighted throughout the year',
                            'Important national holidays and observances clearly marked',
                            'Tithi information for religious and cultural practices',
                            'Seasonal contextual information for each month'
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-primary mr-2 mt-1"><i className="ri-check-line"></i></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </div>
              
              {/* Practical Information Section */}
              <FadeIn delay={0.2}>
                <div className="mt-12 md:mt-16">
                  <h3 className="text-primary font-bold text-2xl md:text-3xl mb-6 flex items-center">
                    <i className="ri-information-line mr-3 p-2 bg-primary-light/20 rounded-lg text-primary"></i>
                    Practical Daily Information
                  </h3>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="mb-6 text-lg">
                      QuikNepal goes beyond calendar services to provide practical information that impacts daily life in Nepal. Our vegetable price tracker helps families budget effectively by providing up-to-date information on market prices, while our metal prices section allows users to track the value of investments in gold and silver—traditional stores of value in Nepali culture.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-3">
                          <i className="ri-shopping-basket-line text-2xl text-primary mr-3"></i>
                          <h4 className="font-bold text-gray-800">Vegetable Prices</h4>
                        </div>
                        <p className="text-gray-600">Track daily updated prices from Kalimati market to make informed shopping decisions.</p>
                      </div>
                      
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-3">
                          <i className="ri-coin-line text-2xl text-primary mr-3"></i>
                          <h4 className="font-bold text-gray-800">Metal Rates</h4>
                        </div>
                        <p className="text-gray-600">Monitor gold and silver rates that serve as traditional stores of value in Nepali culture.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              {/* Cultural Section */}
              <FadeIn delay={0.3}>
                <div className="mt-12 md:mt-16">
                  <h3 className="text-primary font-bold text-2xl md:text-3xl mb-6 flex items-center">
                    <i className="ri-heart-line mr-3 p-2 bg-primary-light/20 rounded-lg text-primary"></i>
                    Cultural Alignment
                  </h3>
                  <p className="text-lg">
                    Our platform respectfully integrates traditional Nepali practices with modern technology. The Rashifal (horoscope) section honors the astrological traditions important to many Nepali citizens, while our intuitive design makes this cultural information accessible to users of all ages.
                  </p>
                </div>
              </FadeIn>
              
              {/* Why QuikNepal Section */}
              <FadeIn delay={0.4}>
                <div className="bg-gradient-to-r from-[#57c84d]/10 to-[#83d475]/10 p-8 md:p-10 rounded-2xl my-12 md:my-16 border border-primary/10 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  {/* Subtle animations */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary/5 group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <h4 className="text-primary font-bold text-2xl mb-4 flex items-center">
                      <i className="ri-question-line mr-3 p-2 bg-white rounded-lg text-primary"></i>
                      Why QuikNepal?
                    </h4>
                    <p className="mb-0 text-lg">
                      QuikNepal stands out by providing authentic, accurate information specifically tailored to the Nepali context. Unlike general information sites, our platform deeply understands the cultural significance behind the data we present. We're committed to preserving cultural heritage while making essential information easily accessible for the modern Nepali user.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <FadeIn delay={0.5}>
              <div className="mt-10 flex justify-center">
                <Link 
                  href="#features" 
                  className="inline-flex items-center bg-gradient-to-r from-[#57c84d] to-[#83d475] text-white font-medium py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <span className="mr-2">Explore All Services</span>
                  <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </MainLayout>
    </>
  );
};

export default Home;