import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForex, getTodayNepaliDate } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import FadeIn from '@/components/ui/FadeIn';
import { motion } from 'framer-motion';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { format, parseISO } from 'date-fns'; // For formatting dates

// Popular currency information - adding more for flag mapping if needed
const currencyDetails: {[key: string]: { name: string; flag: string; color?: string; about?: string }} = {
  USD: { name: 'US Dollar', flag: '🇺🇸', color: 'from-green-500 to-emerald-400', about: 'The US Dollar is the official currency of the United States and several other countries. It is the world\'s primary reserve currency.'},
  EUR: { name: 'Euro', flag: '🇪🇺', color: 'from-blue-500 to-indigo-400', about: 'The Euro is the official currency of 19 of the 27 member states of the European Union.'},
  GBP: { name: 'British Pound', flag: '🇬🇧', color: 'from-purple-500 to-pink-400', about: 'The British Pound is the official currency of the United Kingdom and is the oldest currency still in use.'},
  JPY: { name: 'Japanese Yen', flag: '🇯🇵', color: 'from-red-500 to-rose-400', about: 'The Japanese Yen is the official currency of Japan and is the third most traded currency in the foreign exchange market.'},
  AUD: { name: 'Australian Dollar', flag: '🇦🇺', color: 'from-yellow-500 to-amber-400', about: 'The Australian Dollar is the currency of the Commonwealth of Australia and its territories.'},
  INR: { name: 'Indian Rupee', flag: '🇮🇳', color: 'from-orange-500 to-amber-400', about: 'The Indian Rupee is the official currency of India and is the currency most used by Nepalis for trade and travel.'},
  AED: { name: 'UAE Dirham', flag: '🇦🇪' },
  BHD: { name: 'Bahraini Dinar', flag: '🇧🇭' },
  CAD: { name: 'Canadian Dollar', flag: '🇨🇦' },
  CHF: { name: 'Swiss Franc', flag: '🇨🇭' },
  CNY: { name: 'Chinese Yuan Renminbi', flag: '🇨🇳' },
  DKK: { name: 'Danish Krone', flag: '🇩🇰' },
  HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰' },
  KRW: { name: 'South Korean Won', flag: '🇰🇷' },
  KWD: { name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾' },
  OMR: { name: 'Omani Rial', flag: '🇴🇲' },
  QAR: { name: 'Qatari Riyal', flag: '🇶🇦' },
  SAR: { name: 'Saudi Riyal', flag: '🇸🇦' },
  SEK: { name: 'Swedish Krona', flag: '🇸🇪' },
  SGD: { name: 'Singapore Dollar', flag: '🇸🇬' },
  THB: { name: 'Thai Baht', flag: '🇹🇭' },
  // Add more as needed from API response
};

// Background particles animation component 
const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: Math.random() * 20 + 5,
            height: Math.random() * 20 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

// Currency Card component for the "Major Currencies" section
const CurrencyInfoCard = ({ currencyCode }: { currencyCode: string }) => {
  const detail = currencyDetails[currencyCode];
  if (!detail || !detail.about) return null; // Only render for currencies with full details for this section

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`h-2 bg-gradient-to-r ${detail.color || 'from-gray-400 to-gray-500'}`} />
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{detail.flag}</span>
          <div>
            <h3 className="font-semibold">{currencyCode}</h3>
            <p className="text-sm text-gray-600">{detail.name}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700">{detail.about}</p>
      </div>
    </motion.div>
  );
};

const Forex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15); // Show more items per page

  // Fetch current Nepali date
  const { data: todayNepaliDateData, isLoading: isLoadingNepaliDate } = useQuery({
    queryKey: ['/api/todayNepaliDate'],
    queryFn: getTodayNepaliDate,
    staleTime: 60000, // Refetch every minute to ensure date is current
    refetchInterval: 60000, // Keep it up-to-date
  });

  const { data: forexData, isLoading: isLoadingForex, error: errorForex } = useQuery({
    queryKey: ['/api/forex', { page: currentPage, per_page: perPage }],
    queryFn: () => getForex({ page: currentPage, per_page: perPage }),
    enabled: true,
    staleTime: 1800000, // 30 minutes for potentially faster updates
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const forexColumns = [
    { 
      header: 'Date', 
      accessor: 'date', 
      cell: (value: string) => {
        try {
          return format(parseISO(value), 'MMM dd, yyyy');
        } catch {
          return value; // Fallback if date is not ISO
        }
      }
    },
    {
      header: 'Currency',
      accessor: 'currency',
      cell: (value: string) => {
        const detail = currencyDetails[value.toUpperCase()];
        return (
          <div className="flex items-center">
            {detail?.flag && <span className="mr-2 text-lg">{detail.flag}</span>}
            <span>{value.toUpperCase()}</span>
          </div>
        );
      },
    },
    { header: 'Unit', accessor: 'unit', cell: (value: number) => <div className="text-right pr-2">{value}</div> },
    { header: 'Buying Rate', accessor: 'buyingRate', cell: (value: string | number) => <div className="text-right font-medium text-green-600">{`Rs. ${value}`}</div> },
    { header: 'Selling Rate', accessor: 'sellingRate', cell: (value: string | number) => <div className="text-right font-medium text-red-600">{`Rs. ${value}`}</div> },
    { header: 'Middle Rate', accessor: 'middleRate', cell: (value: string | number) => <div className="text-right text-gray-700">{`Rs. ${value}`}</div> },
  ];

  const ratesDate = forexData?.rates && forexData.rates.length > 0 ? forexData.rates[0].date : null;
  const formattedApiRatesDate = ratesDate ? format(parseISO(ratesDate), 'MMMM dd, yyyy') : "Latest";

  // Construct current Nepali date string
  let currentFormattedNepaliDate = "Today";
  if (todayNepaliDateData) {
    currentFormattedNepaliDate = `${todayNepaliDateData.month_name} ${todayNepaliDateData.day}, ${todayNepaliDateData.year}`;
  }

  const pageTitle = `आजको विदेशी मुद्रा विनिमय दर (${currentFormattedNepaliDate}) - Forex Rates Nepal`;
  const pageDescription = `Check ${currentFormattedNepaliDate}'s latest foreign exchange rates for Nepali Rupee (NPR) from Nepal Rastra Bank.`;

  return (
    <MainLayout
      title={pageTitle}
      description={pageDescription}
    >
      <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
        <BackgroundParticles />
        
      <FadeIn>
          <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-primary mb-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  आजको विदेशी मुद्रा विनिमय दर
                </motion.h1>
                <motion.h2 
                  className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Foreign Exchange Rates for {currentFormattedNepaliDate}
                </motion.h2>
                <motion.div
                  className="text-neutral-600 mt-2 max-w-2xl mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-md">
                    नेपाल राष्ट्र बैंकद्वारा प्रकाशित नेपाली रुपैयाँ (NPR) को नवीनतम विनिमय दरहरू।
                    {forexData?.totalRates && ` ${forexData.totalRates} मुद्राहरू सूचीबद्ध छन्।`}
                  </p>
                </motion.div>
              </div>
              
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-100 mb-10 p-4 md:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-semibold text-primary mb-1 text-center md:text-left">
                    विनिमय दरहरू ({currentFormattedNepaliDate})
                  </h3>
                  {ratesDate && formattedApiRatesDate !== currentFormattedNepaliDate && (
                    <p className="text-xs text-gray-500 mb-4 text-center md:text-left">
                      (Exchange rates effective as of: {formattedApiRatesDate})
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
                    {forexData?.totalRates ? `Displaying ${forexData.rates?.length || 0} of ${forexData.totalRates} exchange rates.` : isLoadingNepaliDate || isLoadingForex ? 'Fetching data...' : 'No rates data available.'}
                  </p>
                  {(isLoadingNepaliDate || isLoadingForex) && !forexData ? (
                    <div className="flex flex-col items-center justify-center h-80 bg-slate-50 rounded-lg">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
                      <p className="text-lg text-gray-600">पछिल्लो दरहरू लोड हुँदैछ...</p>
                      <p className="text-sm text-gray-500">Loading latest rates...</p>
                  </div>
                  ) : errorForex ? (
                    <div className="bg-red-50 p-6 rounded-lg text-red-700 text-center h-80 flex flex-col justify-center items-center">
                      <span className="text-4xl mb-3">⚠️</span>
                      <p className="font-semibold text-xl">Forex डाटा लोड गर्न असमर्थ।</p>
                      <p className="text-md">Failed to load Forex data.</p>
                      <p className="text-sm mt-2">कृपया पछि प्रयास गर्नुहोस् वा आफ्नो इन्टरनेट जडान जाँच गर्नुहोस्।</p>
                </div>
                  ) : forexData && forexData.rates && forexData.rates.length > 0 ? (
                    <div className="overflow-x-auto bg-blue-50/30 p-2 sm:p-4 rounded-xl">
                    <DataTable
                      columns={forexColumns}
                        data={forexData.rates}
                        isLoading={isLoadingForex} // For internal DataTable shimmer perhaps
                    />
                    
                      {forexData.totalPages > 1 && (
                        <div className="mt-6 flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                  className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary/10 hover:text-primary'} transition-colors`}
                              />
                            </PaginationItem>
                              
                              {Array.from({ length: Math.min(forexData.totalPages, 5) }, (_, i) => {
                                let pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                                if (forexData.totalPages - currentPage < 2 && currentPage > 3 && forexData.totalPages > 5) {
                                   pageNum = forexData.totalPages - 4 + i;
                                }
                                if (pageNum > 0 && pageNum <= forexData.totalPages) {
                              return (
                                    <PaginationItem key={pageNum}>
                                  <PaginationLink 
                                    onClick={() => handlePageChange(pageNum)}
                                    isActive={currentPage === pageNum}
                                        className={`${currentPage === pageNum ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-primary/10 hover:text-primary'} transition-colors px-3 py-1.5 rounded-md`}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                                }
                                return null;
                            })}
                            
                            <PaginationItem>
                              <PaginationNext 
                                  onClick={() => handlePageChange(Math.min(currentPage + 1, forexData.totalPages))}
                                  className={`${currentPage === forexData.totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary/10 hover:text-primary'} transition-colors`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                ) : (
                    <div className="bg-blue-50 p-6 rounded-lg text-blue-700 text-center h-80 flex flex-col justify-center items-center">
                       <span className="text-4xl mb-3">ℹ️</span>
                      <p className="font-semibold text-xl">आजको लागि कुनै विनिमय दरहरू उपलब्ध छैनन्।</p>
                      <p>No exchange rates available for today.</p>
                      <p className="text-sm mt-2">कृपया पछि फेरि जाँच गर्नुहोस्।</p>
                    </div>
                  )}
                </motion.div>

                {/* Major Currencies Section */}
                <motion.div 
                  className="mb-12 md:mb-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 text-center">प्रमुख मुद्राहरू</h2>
                  <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
                    नेपालमा सामान्यतया प्रयोग हुने केही प्रमुख विदेशी मुद्राहरूको बारेमा संक्षिप्त जानकारी।
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'INR'].map((code) => (
                      <CurrencyInfoCard key={code} currencyCode={code} />
                    ))}
                  </div>
                </motion.div>
                
                {/* About Forex Section */}
                <motion.div 
                  className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-6 text-center">विदेशी विनिमय बारे (About Foreign Exchange)</h3>
                  
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">विदेशी विनिमयको महत्व (Importance of Foreign Exchange)</h4>
                      <p className="mb-2">
                        Foreign exchange (Forex) is crucial for international trade and investment. It allows businesses and individuals to convert one currency to another, facilitating global economic activities.
                        अन्तर्राष्ट्रिय व्यापार र लगानीको लागि विदेशी विनिमय महत्वपूर्ण छ। यसले व्यवसाय र व्यक्तिहरूलाई एक मुद्रालाई अर्कोमा रूपान्तरण गर्न अनुमति दिन्छ, जसले विश्वव्यापी आर्थिक गतिविधिहरूलाई सहज बनाउँछ।
                      </p>
              </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">विनिमय दर निर्धारण (Exchange Rate Determination)</h4>
                      <p className="mb-2">
                        Exchange rates are determined by various factors, including supply and demand in forex markets, interest rates, inflation, political stability, and economic performance. Central banks like Nepal Rastra Bank play a role in managing exchange rates.
                        विनिमय दरहरू विदेशी विनिमय बजारमा माग र आपूर्ति, ब्याज दर, मुद्रास्फीति, राजनीतिक स्थिरता, र आर्थिक प्रदर्शन सहित विभिन्न कारकहरूद्वारा निर्धारण गरिन्छ। नेपाल राष्ट्र बैंक जस्ता केन्द्रीय बैंकहरूले विनिमय दर व्यवस्थापनमा भूमिका खेल्छन्।
                      </p>
            </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">नेपालमा रेमिट्यान्सको प्रभाव (Impact of Remittances in Nepal)</h4>
                      <p className="mb-2">
                        Remittances from Nepalese working abroad are a major source of foreign currency for Nepal, significantly impacting the national economy and foreign exchange reserves.
                        विदेशमा कार्यरत नेपालीहरूबाट प्राप्त हुने रेमिट्यान्स नेपालको लागि विदेशी मुद्राको प्रमुख स्रोत हो, जसले राष्ट्रिय अर्थतन्त्र र विदेशी विनिमय सञ्चितिमा महत्वपूर्ण प्रभाव पार्छ।
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">नेपालमा विदेशी विनिमय सेवाहरू (Forex Services in Nepal)</h4>
                      <p>
                        Banks and licensed money transfer operators provide forex services in Nepal, including currency exchange, international money transfers, and foreign currency accounts, under the regulation of Nepal Rastra Bank.
                        नेपालमा बैंक तथा इजाजतपत्र प्राप्त मुद्रा स्थानान्तरण अपरेटरहरूले विदेशी विनिमय सेवाहरू प्रदान गर्दछन्, जसमा मुद्रा विनिमय, अन्तर्राष्ट्रिय मुद्रा स्थानान्तरण, र विदेशी मुद्रा खाताहरू समावेश छन्, जुन नेपाल राष्ट्र बैंकको नियमन अन्तर्गत पर्दछन्।
                      </p>
            </div>
                  </div>
                </motion.div>
          </div>
        </div>
      </section>
        </FadeIn>
      </div>
    </MainLayout>
  );
};

export default Forex;
