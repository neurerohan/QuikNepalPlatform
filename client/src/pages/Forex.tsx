import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForex } from '@/lib/api';
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

  const { data, isLoading, error } = useQuery({
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

  const ratesDate = data?.rates && data.rates.length > 0 ? data.rates[0].date : null;
  const formattedRatesDate = ratesDate ? format(parseISO(ratesDate), 'MMMM dd, yyyy') : "Today";

  return (
    <MainLayout
      title={`आजको विदेशी मुद्रा विनिमय दर (${formattedRatesDate}) - Forex Rates Nepal`}
      description={`Check ${formattedRatesDate}'s latest foreign exchange rates for Nepali Rupee (NPR) from Nepal Rastra Bank.`}
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
                  Foreign Exchange Rates for {formattedRatesDate}
                </motion.h2>
                <motion.div
                  className="text-neutral-600 mt-2 max-w-2xl mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-md">
                    नेपाल राष्ट्र बैंकद्वारा प्रकाशित नेपाली रुपैयाँ (NPR) को नवीनतम विनिमय दरहरू।
                    {data?.totalRates && ` ${data.totalRates} मुद्राहरू सूचीबद्ध छन्।`}
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
                  <h3 className="text-xl md:text-2xl font-semibold text-primary mb-2 text-center md:text-left">
                     विनिमय दरहरू {ratesDate ? `(${formattedRatesDate})` : '(Latest)'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
                    {data?.totalRates ? `Displaying ${data.rates?.length || 0} of ${data.totalRates} exchange rates.` : 'Fetching latest rates...'}
                  </p>
                  {isLoading && !data ? (
                    <div className="flex flex-col items-center justify-center h-80 bg-slate-50 rounded-lg">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
                      <p className="text-lg text-gray-600">पछिल्लो दरहरू लोड हुँदैछ...</p>
                      <p className="text-sm text-gray-500">Loading latest rates...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 p-6 rounded-lg text-red-700 text-center h-80 flex flex-col justify-center items-center">
                      <span className="text-4xl mb-3">⚠️</span>
                      <p className="font-semibold text-xl">Forex डाटा लोड गर्न असमर्थ।</p>
                      <p className="text-md">Failed to load Forex data.</p>
                      <p className="text-sm mt-2">कृपया पछि प्रयास गर्नुहोस् वा आफ्नो इन्टरनेट जडान जाँच गर्नुहोस्।</p>
                    </div>
                  ) : data && data.rates && data.rates.length > 0 ? (
                    <div className="overflow-x-auto bg-blue-50/30 p-2 sm:p-4 rounded-xl">
                      <DataTable
                        columns={forexColumns}
                        data={data.rates}
                        isLoading={isLoading} // For internal DataTable shimmer perhaps
                        />
                      
                      {data.totalPages > 1 && (
                        <div className="mt-6 flex justify-center">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                  className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary/10 hover:text-primary'} transition-colors`}
                                />
                              </PaginationItem>
                              
                              {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                                let pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                                if (data.totalPages - currentPage < 2 && currentPage > 3 && data.totalPages > 5) {
                                   pageNum = data.totalPages - 4 + i;
                                }
                                if (pageNum > 0 && pageNum <= data.totalPages) {
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
                                  onClick={() => handlePageChange(Math.min(currentPage + 1, data.totalPages))}
                                  className={`${currentPage === data.totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary/10 hover:text-primary'} transition-colors`}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-6 rounded-lg text-yellow-700 text-center h-80 flex flex-col justify-center items-center">
                       <span className="text-4xl mb-3">ℹ️</span>
                      <p className="font-semibold text-xl">आजको लागि कुनै Forex डाटा उपलब्ध छैन।</p>
                      <p className="text-md">No Forex Data Available for Today.</p>
                      <p className="text-sm mt-2">नेपाल राष्ट्र बैंकले आजको दरहरू प्रकाशित नगरेको हुन सक्छ। कृपया पछि फेरि जाँच गर्नुहोस्।</p>
                    </div>
                  )}
                </motion.div>

                {/* Popular currencies section - now uses CurrencyInfoCard */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-4">प्रमुख विदेशी मुद्राहरू (Major Currencies)</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'INR'].map((code) => (
                      <CurrencyInfoCard 
                        key={code} 
                        currencyCode={code} 
                      />
                    ))}
                  </div>
                </motion.div>

                {/* About Forex section (remains the same) */}
                <motion.div 
                  className="max-w-4xl mx-auto mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-4">नेपालमा विदेशी मुद्रा विनिमय (Foreign Exchange in Nepal)</h3>
                  <p className="mb-4">
                    विदेशी मुद्रा विनिमय दरहरू नेपाल राष्ट्र बैंक द्वारा प्रकाशित आधिकारिक दरहरू हुन्। यी दरहरू नेपालभित्र मुद्रा विनिमय र अन्तर्राष्ट्रिय कारोबारहरूका लागि लागू हुन्छन्।
                  </p>
                  <p className="mb-4">
                    The foreign exchange rates displayed here are the official rates published by Nepal Rastra Bank, the central bank of Nepal. These rates are applicable for currency exchange and international transactions within Nepal.
                  </p>
                  <p className="mb-4">
                    The buying rate is applicable when you sell foreign currency, and the selling rate applies when you buy foreign currency against Nepali Rupees (NPR).
                  </p>
                  
                  <h4 className="text-lg font-semibold text-primary mt-6 mb-3">विदेशी मुद्राको महत्व (Importance of Foreign Exchange)</h4>
                  <p className="mb-4">
                    Foreign exchange rates play a crucial role in Nepal's economy. As a country heavily dependent on remittances, tourism, and imports, exchange rate fluctuations significantly impact the national economy and individual finances.
                  </p>
                  <p className="mb-4">
                    For businesses involved in international trade, monitoring exchange rates is essential for managing costs and pricing. For individuals, exchange rates affect the value of remittances, travel expenses, and imported goods.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-primary mt-6 mb-3">विनिमय दर निर्धारण (Exchange Rate Determination)</h4>
                  <p className="mb-4">
                    Nepal Rastra Bank determines the exchange rates for Nepali Rupee against foreign currencies based on various factors:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Market supply and demand for foreign currencies</li>
                    <li>International currency market trends</li>
                    <li>Foreign currency reserves of Nepal</li>
                    <li>Indian Rupee exchange rate (Nepal's currency is pegged to the Indian Rupee)</li>
                    <li>Balance of payments situation</li>
                  </ul>
                  
                  <h4 className="text-lg font-semibold text-primary mt-6 mb-3">रेमिट्यान्सको प्रभाव (Impact of Remittances)</h4>
                  <p className="mb-4">
                    Remittances from Nepali workers abroad constitute a significant portion of Nepal's GDP. Exchange rate fluctuations directly impact the value of these remittances when converted to Nepali Rupees.
                  </p>
                  <p className="mb-4">
                    As one of the world's top remittance-receiving countries relative to GDP, Nepal's economy is particularly sensitive to changes in the exchange rates of major currencies like the US Dollar, UAE Dirham, Qatari Riyal, and Malaysian Ringgit.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-primary mt-6 mb-3">विदेशी मुद्रा विनिमय सेवाहरू (Foreign Exchange Services in Nepal)</h4>
                  <p className="mb-4">
                    Various institutions provide foreign exchange services in Nepal:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Commercial Banks</li>
                    <li>Money Changers & Remittance Companies</li>
                    <li>Hotels (for tourists, usually at less favorable rates)</li>
                    <li>Authorized Foreign Exchange Dealers</li>
                  </ul>
                  <p className="text-sm text-gray-600 italic">
                    Note: Always use authorized channels for foreign currency exchange to ensure legal compliance and fair rates.
                  </p>
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
