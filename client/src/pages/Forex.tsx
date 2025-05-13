import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForex } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import FadeIn from '@/components/ui/FadeIn';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

// Popular currency information
const currencyInfo = [
  { 
    code: 'USD', 
    name: 'US Dollar',
    flag: '🇺🇸',
    about: 'The US Dollar is the official currency of the United States and several other countries. It is the world\'s primary reserve currency.',
    color: 'from-green-500 to-emerald-400'
  },
  { 
    code: 'EUR', 
    name: 'Euro',
    flag: '🇪🇺',
    about: 'The Euro is the official currency of 19 of the 27 member states of the European Union.',
    color: 'from-blue-500 to-indigo-400'
  },
  { 
    code: 'GBP', 
    name: 'British Pound',
    flag: '🇬🇧',
    about: 'The British Pound is the official currency of the United Kingdom and is the oldest currency still in use.',
    color: 'from-purple-500 to-pink-400'
  },
  { 
    code: 'JPY', 
    name: 'Japanese Yen',
    flag: '🇯🇵',
    about: 'The Japanese Yen is the official currency of Japan and is the third most traded currency in the foreign exchange market.',
    color: 'from-red-500 to-rose-400'
  },
  { 
    code: 'AUD', 
    name: 'Australian Dollar',
    flag: '🇦🇺',
    about: 'The Australian Dollar is the currency of the Commonwealth of Australia and its territories.',
    color: 'from-yellow-500 to-amber-400'
  },
  { 
    code: 'INR', 
    name: 'Indian Rupee',
    flag: '🇮🇳',
    about: 'The Indian Rupee is the official currency of India and is the currency most used by Nepalis for trade and travel.',
    color: 'from-orange-500 to-amber-400'
  }
];

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

// Currency Card component
const CurrencyCard = ({ currency }: { currency: typeof currencyInfo[0] }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`h-2 bg-gradient-to-r ${currency.color}`} />
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{currency.flag}</span>
          <div>
            <h3 className="font-semibold">{currency.code}</h3>
            <p className="text-sm text-gray-600">{currency.name}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700">{currency.about}</p>
      </div>
    </motion.div>
  );
};

const Forex = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/forex', { from: fromDate, to: toDate, page: currentPage, per_page: perPage }],
    queryFn: () => getForex({ from: fromDate, to: toDate, page: currentPage, per_page: perPage }),
    enabled: false, // Don't fetch on component mount
    staleTime: 3600000 // 1 hour
  });

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  // Auto-generate today and a week ago dates for user convenience
  const setDefaultDates = () => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    setToDate(today.toISOString().split('T')[0]);
    setFromDate(oneWeekAgo.toISOString().split('T')[0]);
  };

  const forexColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Currency', accessor: 'currency' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Buying Rate', accessor: 'buyingRate', cell: (value: number) => `Rs. ${value}` },
    { header: 'Selling Rate', accessor: 'sellingRate', cell: (value: number) => `Rs. ${value}` },
    { header: 'Middle Rate', accessor: 'middleRate', cell: (value: number) => `Rs. ${value}` },
  ];

  return (
    <MainLayout
      title="Forex Rates - Foreign Exchange Rates in Nepal"
      description="Track current and historical foreign exchange rates for Nepali Rupee (NPR) against major world currencies. Daily updated rates from Nepal Rastra Bank."
    >
      <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
        <BackgroundParticles />
        
        <FadeIn>
          <section className="py-12 relative z-10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <motion.h1 
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  विदेशी मुद्रा विनिमय दर
                </motion.h1>
                <motion.h2 
                  className="text-2xl font-semibold text-gray-700 mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Foreign Exchange Rates
                </motion.h2>
                <motion.div
                  className="text-neutral-600 mt-4 max-w-2xl mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-lg">
                    Current and historical exchange rates for Nepali Rupee (NPR)
                  </p>
                  <p className="text-sm mt-2 text-gray-600">
                    Data source: Nepal Rastra Bank
                  </p>
                </motion.div>
              </div>

              <div className="max-w-6xl mx-auto">
                <motion.div 
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-blue-100 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
                    <h2 className="text-xl font-semibold">Search Foreign Exchange Rates</h2>
                    <p className="text-white/80 text-sm">Filter by date range to find historical rates</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <Label htmlFor="from-date" className="mb-1 block">From Date</Label>
                        <Input 
                          id="from-date" 
                          type="date" 
                          value={fromDate} 
                          onChange={(e) => setFromDate(e.target.value)}
                          className="border-blue-200 focus:border-primary"
                        />
                      </div>
                      <div>
                        <Label htmlFor="to-date" className="mb-1 block">To Date</Label>
                        <Input 
                          id="to-date" 
                          type="date" 
                          value={toDate} 
                          onChange={(e) => setToDate(e.target.value)}
                          className="border-blue-200 focus:border-primary"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button 
                          onClick={handleSearch} 
                          className="bg-primary hover:bg-primary-dark"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                        <Button
                          onClick={setDefaultDates}
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary/5"
                        >
                          Last 7 Days
                        </Button>
                      </div>
                    </div>

                    {data ? (
                      <div className="bg-blue-50/50 p-4 rounded-xl">
                        <DataTable
                          columns={forexColumns}
                          data={data.rates || []}
                          isLoading={isLoading}
                        />
                        
                        {data.totalPages > 1 && (
                          <div className="mt-4 flex justify-center">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious 
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  />
                                </PaginationItem>
                                
                                {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                                  // Show pages around current page
                                  let pageNum = currentPage - 2 + i;
                                  if (pageNum < 1) pageNum += 5;
                                  if (pageNum > data.totalPages) pageNum -= 5;
                                  
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationLink 
                                        onClick={() => handlePageChange(pageNum)}
                                        isActive={currentPage === pageNum}
                                      >
                                        {pageNum}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                })}
                                
                                <PaginationItem>
                                  <PaginationNext 
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, data.totalPages))}
                                    className={currentPage === data.totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        )}
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 p-4 rounded-lg text-red-800">
                        Failed to load forex data. Please try again later.
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <div className="text-5xl mb-4">💱</div>
                        <h3 className="text-xl font-semibold text-primary mb-2">Foreign Exchange Rates</h3>
                        <p className="text-gray-600 mb-4">
                          Set a date range and click Search to view current and historical forex rates for Nepali Rupee (NPR)
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Popular currencies section */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-4">प्रमुख विदेशी मुद्राहरू (Major Currencies)</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {currencyInfo.map((currency, i) => (
                      <CurrencyCard 
                        key={currency.code} 
                        currency={currency} 
                      />
                    ))}
                  </div>
                </motion.div>

                {/* About Forex section */}
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
