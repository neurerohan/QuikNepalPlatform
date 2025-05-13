import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVegetables } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import FadeIn from '@/components/ui/FadeIn';
import { Input } from '@/components/ui/input';
import { FaInfoCircle, FaLeaf, FaFilter, FaSort, FaSyncAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getCurrentNepaliDate } from '@/lib/nepaliDateConverter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define types for our vegetable data
interface VegetableData {
  name: string;
  name_nepali?: string;
  unit: string;
  min_price: string;
  max_price: string;
  avg_price: string;
}

interface FormattedVegetable {
  name: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  priceRange?: number;
  priceChangePercent?: number;
}

// Background particles for visual appeal
const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-green-300/30"
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

// Featured vegetable card component
interface FeaturedVegetableCardProps {
  item: FormattedVegetable;
}

const FeaturedVegetableCard = ({ item }: FeaturedVegetableCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200 hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-green-800">{item.name}</h3>
        <span className="text-2xl text-green-600"><FaLeaf /></span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Average Price:</span>
          <span className="font-medium">Rs. {item.avgPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Price Range:</span>
          <span className="font-medium">Rs. {item.minPrice.toFixed(2)} - {item.maxPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <span className="text-gray-600">Trend:</span>
          <span className="flex items-center">
            {item.priceTrend === 'up' && <span className="text-red-500 flex items-center"><span className="mr-1">↑</span> Rising</span>}
            {item.priceTrend === 'down' && <span className="text-green-500 flex items-center"><span className="mr-1">↓</span> Falling</span>}
            {item.priceTrend === 'stable' && <span className="text-gray-500 flex items-center"><span className="mr-1">→</span> Stable</span>}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Vegetables = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [nepaliDate, setNepaliDate] = useState('');
  const [filterByTrend, setFilterByTrend] = useState<'all' | 'up' | 'down' | 'stable'>('all');
  
  // Get current Nepali date
  useEffect(() => {
    async function fetchNepaliDate() {
      try {
        const dateInfo = await getCurrentNepaliDate();
        setNepaliDate(`${dateInfo.year} ${dateInfo.month_name} ${dateInfo.day}`);
      } catch (error) {
        console.error("Error fetching Nepali date:", error);
      }
    }
    
    fetchNepaliDate();
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vegetables'],
    queryFn: getVegetables,
    staleTime: 3600000, // 1 hour
    retry: 2, // retry 2 times if failed
    refetchOnWindowFocus: false,
  });

  // Debug logging for API response
  useEffect(() => {
    console.log("Vegetables data:", data);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
  }, [data, isLoading, error]);

  // Filter data based on search term and trend filter
  const filteredData = data?.filter((item: VegetableData) => {
    const matchesSearch = (
      (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.name_nepali?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (filterByTrend === 'all') return matchesSearch;
    
    const trend = calculateTrend(parseFloat(item.min_price), parseFloat(item.max_price));
    return matchesSearch && trend === filterByTrend;
  }) || [];

  // Remove duplicates by creating a map with unique keys based on name
  const uniqueVegetablesMap = new Map();
  filteredData.forEach((item: VegetableData) => {
    if (!uniqueVegetablesMap.has(item.name.toLowerCase())) {
      uniqueVegetablesMap.set(item.name.toLowerCase(), item);
    }
  });

  // Get the unique vegetables array back from the map
  const uniqueVegetables = Array.from(uniqueVegetablesMap.values());

  // Sort the filtered data
  const sortedData = [...uniqueVegetables].sort((a: VegetableData, b: VegetableData) => {
    let valA, valB;
    
    if (sortBy === 'name') {
      valA = a.name?.toLowerCase() || '';
      valB = b.name?.toLowerCase() || '';
    } else if (sortBy === 'minPrice') {
      valA = parseFloat(a.min_price);
      valB = parseFloat(b.min_price);
    } else if (sortBy === 'maxPrice') {
      valA = parseFloat(a.max_price);
      valB = parseFloat(b.max_price);
    } else if (sortBy === 'avgPrice') {
      valA = parseFloat(a.avg_price);
      valB = parseFloat(b.avg_price);
    } else {
      valA = '';
      valB = '';
    }
    
    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  // Map API data to our component expected format
  const formattedData: FormattedVegetable[] = sortedData.map((item: VegetableData) => ({
    name: item.name_nepali ? `${item.name} (${item.name_nepali})` : item.name,
    unit: item.unit,
    minPrice: parseFloat(item.min_price),
    maxPrice: parseFloat(item.max_price),
    avgPrice: parseFloat(item.avg_price),
    priceTrend: calculateTrend(parseFloat(item.min_price), parseFloat(item.max_price))
  }));

  // Select featured vegetables (top 3 by price change percentage)
  const featuredVegetables = formattedData
    .map(item => ({
      ...item,
      priceRange: item.maxPrice - item.minPrice,
      priceChangePercent: ((item.maxPrice - item.minPrice) / item.minPrice) * 100
    }))
    .filter(item => !isNaN(item.priceChangePercent || 0) && isFinite(item.priceChangePercent || 0))
    .sort((a, b) => (b.priceChangePercent || 0) - (a.priceChangePercent || 0))
    .slice(0, 3);

  function calculateTrend(min: number, max: number): 'up' | 'down' | 'stable' {
    // More sophisticated trend calculation
    const diff = max - min;
    const percentChange = min > 0 ? (diff / min) * 100 : 0;
    
    if (percentChange > 15) return 'up';
    if (percentChange < 5) return 'down';
    return 'stable';
  }

  // Handle sort click
  const handleSortClick = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set to asc
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const vegetableColumns = [
    { 
      header: 'Item', 
      accessor: 'name',
      cell: (value: string) => (
        <div className="flex items-center">
          <FaLeaf className="text-green-500 mr-2" />
          <span>{value}</span>
        </div>
      ),
      onClick: () => handleSortClick('name')
    },
    { header: 'Unit', accessor: 'unit' },
    { 
      header: 'Min Price', 
      accessor: 'minPrice', 
      cell: (value: number) => `Rs. ${value.toFixed(2)}`,
      onClick: () => handleSortClick('minPrice')
    },
    { 
      header: 'Max Price', 
      accessor: 'maxPrice', 
      cell: (value: number) => `Rs. ${value.toFixed(2)}`,
      onClick: () => handleSortClick('maxPrice')
    },
    { 
      header: 'Avg Price', 
      accessor: 'avgPrice', 
      cell: (value: number) => `Rs. ${value.toFixed(2)}`,
      onClick: () => handleSortClick('avgPrice')
    },
    { 
      header: 'Trend', 
      accessor: 'priceTrend', 
      cell: (value: 'up' | 'down' | 'stable') => {
        if (value === 'up') return <span className="flex items-center text-red-500"><FaSort className="mr-1" /> Rising</span>;
        if (value === 'down') return <span className="flex items-center text-green-500"><FaSort className="mr-1 rotate-180" /> Falling</span>;
        return <span className="flex items-center text-gray-500"><FaSort className="mr-1 rotate-90" /> Stable</span>;
      } 
    },
  ];

  // Handle filtering by trend
  const handleTrendFilter = (trend: 'all' | 'up' | 'down' | 'stable') => {
    setFilterByTrend(trend);
  };

  return (
    <MainLayout
      title="तरकारी मूल्य - Vegetable Prices Nepal"
      description="नेपालमा ताजा तरकारीको मूल्य। Track current vegetable prices from Kalimati market to make informed shopping decisions."
    >
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-slate-100">
        <BackgroundParticles />
        <FadeIn>
          <section className="py-12 md:py-16 relative z-10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10 md:mb-14">
                <motion.h1 
                  className="text-4xl md:text-5xl font-extrabold text-green-600 mb-3 tracking-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  तरकारी मूल्य
                </motion.h1>
                <motion.h2 
                  className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Fresh Vegetable Prices
                </motion.h2>
                <motion.p 
                  className="text-md text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  कालिमाटी फलफूल तथा तरकारी बजारको आजको मूल्य सूची। अपडेट: {nepaliDate || "आज"}
                </motion.p>
              </div>

              {/* Featured Vegetables */}
              {!isLoading && !error && featuredVegetables.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Featured Vegetables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {featuredVegetables.map((item, index) => (
                      <FeaturedVegetableCard key={index} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-8">
                <Tabs defaultValue="prices" className="w-full">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="prices">Prices</TabsTrigger>
                      <TabsTrigger value="info">Market Info</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="prices" className="p-0">
                    {/* Filters & Search */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-green-700">Today's Vegetable Prices</h2>
                          <div className="flex items-center text-sm text-gray-500">
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent hover:text-green-600" onClick={() => refetch()}>
                              <FaSyncAlt className="mr-1" /> Refresh
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-2 md:items-center">
                          <div className="flex items-center space-x-2">
                            <FaFilter className="text-gray-400" />
                            <select 
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                              value={filterByTrend}
                              onChange={(e) => handleTrendFilter(e.target.value as 'all' | 'up' | 'down' | 'stable')}
                            >
                              <option value="all">All Trends</option>
                              <option value="up">Price Rising</option>
                              <option value="down">Price Falling</option>
                              <option value="stable">Price Stable</option>
                            </select>
                          </div>
                          
                          <Input
                            type="text"
                            placeholder="Search vegetables..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Data Table */}
                    {error ? (
                      <div className="p-6 text-center">
                        <div className="bg-red-50 p-4 rounded-lg text-red-800 mx-auto max-w-md">
                          <FaInfoCircle className="text-3xl mx-auto mb-2" />
                          <p className="font-bold text-lg">तरकारी मूल्य लोड गर्न असमर्थ</p>
                          <p>Failed to load vegetable prices. Please try again later.</p>
                          <Button onClick={() => refetch()} className="mt-4 bg-red-600 hover:bg-red-700">
                            Try Again
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <DataTable
                          columns={vegetableColumns}
                          data={formattedData}
                          isLoading={isLoading}
                          sortBy={sortBy}
                          sortDirection={sortDirection}
                        />
                        
                        {/* Results summary */}
                        <div className="p-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
                          Showing {formattedData.length} vegetables
                          {searchTerm && ` matching "${searchTerm}"`}
                          {filterByTrend !== 'all' && ` with ${filterByTrend} price trend`}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="info" className="p-6 space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-green-700 mb-2">कालिमाटी बजार (Kalimati Market)</h3>
                        <p className="text-gray-700 mb-3">
                          कालिमाटी फलफूल तथा तरकारी बजार नेपालमा सबैभन्दा ठूलो थोक तरकारी बजार हो। यो काठमाडौंको दक्षिण-पश्चिम क्षेत्रमा स्थित छ र यसले नेपालको विभिन्न क्षेत्रबाट आउने ताजा तरकारीहरू वितरण गर्छ।
                        </p>
                        <p className="text-gray-700">
                          Kalimati Fruits and Vegetables Market is the largest wholesale vegetable market in Nepal. Located in the south-western part of Kathmandu, it serves as a distribution hub for fresh produce coming from various regions of Nepal.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-green-700 mb-2">मौसमी तरकारीहरू (Seasonal Vegetables)</h3>
                        <p className="text-gray-700 mb-3">
                          नेपालमा मौसम अनुसार फरक-फरक तरकारीहरू उपलब्ध हुन्छन्। ग्रीष्म ऋतुमा लौका, करेला, परवल, भिन्डी, बोडी, भटमास, र फर्सी जस्ता तरकारीहरू प्रचुर मात्रामा पाइन्छन्। हिउँदमा बन्दा, काउली, ब्रोकोली, मूला, गाजर, र पालुङ्गो जस्ता तरकारीहरू बढी उपलब्ध हुन्छन्।
                        </p>
                        <p className="text-gray-700">
                          Nepal has different vegetables available according to seasons. Summer vegetables include bottle gourd, bitter gourd, pointed gourd, okra, beans, soybeans, and pumpkins in abundance. Winter sees more cabbage, cauliflower, broccoli, radish, carrots, and spinach.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-green-700 mb-2">मूल्य निर्धारण (Price Determination)</h3>
                        <p className="text-gray-700 mb-3">
                          तरकारीको मूल्य विभिन्न कारकहरूद्वारा निर्धारित हुन्छ, जस्तै मौसम, उत्पादन लागत, आपूर्ति र माग, यातायात लागत, र बजार मध्यस्थताहरू। मूल्य दैनिक रूपमा परिवर्तन हुन सक्छ र प्रायः बिहानीपख सबैभन्दा कम हुन्छ जब ताजा आपूर्ति आइपुग्छ।
                        </p>
                        <p className="text-gray-700">
                          Vegetable prices are determined by various factors such as season, production costs, supply and demand, transportation costs, and market intermediaries. Prices can change daily and are often lowest in the early morning when fresh supplies arrive.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-green-700 mb-2">स्थानीय उत्पादन र आयात (Local Production & Imports)</h3>
                        <p className="text-gray-700 mb-3">
                          धेरैजसो तरकारीहरू नेपालको विभिन्न क्षेत्रहरूबाट आउँछन्, विशेष गरी काठमाडौं उपत्यकाको वरिपरिको पहाडी क्षेत्रहरू, तराई, र नजिकको पहाडी क्षेत्रहरूबाट। केही बेमौसमी तरकारीहरू र गैर-स्थानीय किसिमका तरकारीहरू भारतबाट आयात गरिन्छन्।
                        </p>
                        <p className="text-gray-700">
                          Most vegetables come from various regions of Nepal, particularly the hilly areas around Kathmandu Valley, the Terai, and nearby mountainous regions. Some off-season vegetables and non-native varieties are imported from India.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-green-700 mb-2">खरिद सुझावहरू (Shopping Tips)</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          <li>सकेसम्म बिहानै खरिद गर्नुहोस् जब तरकारीहरू ताजा र मूल्य कम हुन्छ।</li>
                          <li>तरकारीको गुणस्तर जाँच्न रङ, बनावट, र खड्किलोपन हेर्नुहोस्।</li>
                          <li>थोक बजारमा किन्दा बढी छुट पाइन्छ।</li>
                          <li>मौसमी तरकारीहरू छनोट गर्नुहोस्, जुन ताजा र कम मूल्यमा उपलब्ध हुन्छन्।</li>
                          <li>स्थानीय हाट बजारहरूबाट खरिद गर्नुहोस् जहाँ तरकारीहरू सिधै किसानहरूबाट आउँछन्।</li>
                        </ul>
                        <p className="mt-3 text-gray-700">
                          Buy early in the morning when vegetables are fresh and prices are lower. Check the quality of vegetables by examining their color, texture, and firmness. Buying in bulk offers better discounts. Choose seasonal vegetables that are fresh and available at lower prices. Purchase from local farmers' markets where produce comes directly from farmers.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Nutritional Information Section */}
              <motion.div 
                className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-3">तरकारीको पोषक महत्व</h3>
                  <h4 className="text-xl text-gray-800">Nutritional Benefits of Vegetables</h4>
                  <div className="mt-3 flex justify-center space-x-2">
                    <span className="inline-block h-1 w-10 rounded bg-green-500"></span>
                    <span className="inline-block h-1 w-16 rounded bg-green-400"></span>
                    <span className="inline-block h-1 w-10 rounded bg-green-500"></span>
                  </div>
                </div>
                
                {/* Feature Cards - Vegetable Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {/* Leafy Greens Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-md overflow-hidden border border-green-200"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="p-4 border-b border-green-200 flex justify-between items-center">
                      <div>
                        <h5 className="text-xl font-bold text-green-800">हरियो पत्तेदार तरकारीहरू</h5>
                        <h6 className="text-gray-700 italic">Leafy Greens</h6>
                      </div>
                      <svg className="w-14 h-14 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
                        <path d="M7 8.5C7 8.5 9.5 7 12 9.5C14.5 12 13.5 15.5 13.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M16 15C16 15 14 13.5 12 15.5C10 17.5 9 17.5 9 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M12 22V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M4.5 14C4.5 14 6.5 15.5 9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="p-5">
                      <div className="flex mb-3">
                        <div className="py-1 px-2 bg-green-200 text-green-800 rounded text-xs mr-2">पालुङ्गो</div>
                        <div className="py-1 px-2 bg-green-200 text-green-800 rounded text-xs mr-2">रायो</div>
                        <div className="py-1 px-2 bg-green-200 text-green-800 rounded text-xs mr-2">मेथी</div>
                        <div className="py-1 px-2 bg-green-200 text-green-800 rounded text-xs">धनियाँ</div>
                      </div>
                      <p className="text-gray-700 text-sm">
                        पालुङ्गो, रायो, मेथी, र धनियाँ जस्ता हरियो पत्तेदार तरकारीहरूमा भिटामिन K, A, C, फोलेट, आइरन, क्याल्सियम र फाइबर प्रचुर मात्रामा पाइन्छन्।
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        Spinach, mustard greens, fenugreek leaves, and coriander are rich in vitamins K, A, C, folate, iron, calcium, and fiber.
                      </p>
                      
                      <div className="mt-4 border-t border-green-200 pt-3">
                        <h6 className="font-medium text-green-800 mb-2">Key Benefits:</h6>
                        <ul className="space-y-1">
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Blood formation and improved circulation
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Strong bone development
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Enhanced immune system
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Root Vegetables Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl shadow-md overflow-hidden border border-orange-200"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="p-4 border-b border-orange-200 flex justify-between items-center">
                      <div>
                        <h5 className="text-xl font-bold text-orange-800">जरे तरकारीहरू</h5>
                        <h6 className="text-gray-700 italic">Root Vegetables</h6>
                      </div>
                      <svg className="w-14 h-14 text-orange-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
                        <path d="M12 7V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M12 7C9 7 7 9 7 12C7 15 9 17 12 17C15 17 17 15 17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M12 17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="p-5">
                      <div className="flex mb-3">
                        <div className="py-1 px-2 bg-orange-200 text-orange-800 rounded text-xs mr-2">गाजर</div>
                        <div className="py-1 px-2 bg-orange-200 text-orange-800 rounded text-xs mr-2">मूला</div>
                        <div className="py-1 px-2 bg-orange-200 text-orange-800 rounded text-xs mr-2">शकरखण्ड</div>
                        <div className="py-1 px-2 bg-orange-200 text-orange-800 rounded text-xs">सुठुनी</div>
                      </div>
                      <p className="text-gray-700 text-sm">
                        गाजर, मूला, शकरखण्ड, र सुठुनीमा एन्टिअक्सिडेन्ट्स, भिटामिन A, C, पोटासियम, र फाइबर पाइन्छन्।
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        Carrots, radishes, sweet potatoes, and beetroot contain antioxidants, vitamins A, C, potassium, and fiber.
                      </p>
                      
                      <div className="mt-4 border-t border-orange-200 pt-3">
                        <h6 className="font-medium text-orange-800 mb-2">Key Benefits:</h6>
                        <ul className="space-y-1">
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Improved eye health and vision
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Digestive system support
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Blood pressure regulation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                
                  {/* Cruciferous Vegetables Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-md overflow-hidden border border-purple-200"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="p-4 border-b border-purple-200 flex justify-between items-center">
                      <div>
                        <h5 className="text-xl font-bold text-purple-800">क्रूसिफेरस तरकारीहरू</h5>
                        <h6 className="text-gray-700 italic">Cruciferous Vegetables</h6>
                      </div>
                      <svg className="w-14 h-14 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
                        <path d="M12 6C8 6 7 9 7 12C7 15 9 18 12 18C15 18 17 15 17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M12 6V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M7 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="p-5">
                      <div className="flex mb-3">
                        <div className="py-1 px-2 bg-purple-200 text-purple-800 rounded text-xs mr-2">काउली</div>
                        <div className="py-1 px-2 bg-purple-200 text-purple-800 rounded text-xs mr-2">बन्दा</div>
                        <div className="py-1 px-2 bg-purple-200 text-purple-800 rounded text-xs mr-2">ब्रोकोली</div>
                        <div className="py-1 px-2 bg-purple-200 text-purple-800 rounded text-xs">गाँठकोभी</div>
                      </div>
                      <p className="text-gray-700 text-sm">
                        काउली, बन्दा, ब्रोकोली, र गाँठकोबीमा भिटामिन C, K, फोलेट, र फाइटोन्युट्रिएन्ट्स प्रचुर मात्रामा पाइन्छन्।
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        Cauliflower, cabbage, broccoli, and Brussels sprouts are rich in vitamins C, K, folate, and phytonutrients.
                      </p>
                      
                      <div className="mt-4 border-t border-purple-200 pt-3">
                        <h6 className="font-medium text-purple-800 mb-2">Key Benefits:</h6>
                        <ul className="space-y-1">
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Reduced cancer risk
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Decreased inflammation
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Improved heart health
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                
                  {/* Nightshade Vegetables Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl shadow-md overflow-hidden border border-red-200"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="p-4 border-b border-red-200 flex justify-between items-center">
                      <div>
                        <h5 className="text-xl font-bold text-red-800">नाइट्रेटसेड तरकारीहरू</h5>
                        <h6 className="text-gray-700 italic">Nightshade Vegetables</h6>
                      </div>
                      <svg className="w-14 h-14 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
                        <path d="M12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M7.5 4C8.5 7 10 8.5 13 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M11 13C12.5 15 15 16.5 18 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="p-5">
                      <div className="flex mb-3">
                        <div className="py-1 px-2 bg-red-200 text-red-800 rounded text-xs mr-2">गोलभेंडा</div>
                        <div className="py-1 px-2 bg-red-200 text-red-800 rounded text-xs mr-2">भण्टा</div>
                        <div className="py-1 px-2 bg-red-200 text-red-800 rounded text-xs mr-2">खुर्सानी</div>
                        <div className="py-1 px-2 bg-red-200 text-red-800 rounded text-xs">आलु</div>
                      </div>
                      <p className="text-gray-700 text-sm">
                        गोलभेंडा, भण्टा, र खुर्सानीमा लाइकोपिन, एन्थोसायनिन, र विभिन्न एन्टिअक्सिडेन्ट्स पाइन्छन्।
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        Tomatoes, eggplants, and peppers contain lycopene, anthocyanins, and various antioxidants.
                      </p>
                      
                      <div className="mt-4 border-t border-red-200 pt-3">
                        <h6 className="font-medium text-red-800 mb-2">Key Benefits:</h6>
                        <ul className="space-y-1">
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Heart health support
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Reduced cancer risk
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Strengthened immune system
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Nutritional Overview Section */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-50 rounded-xl p-6 shadow-md mb-8">
                  <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    तरकारीहरूमा पाइने मुख्य पोषक तत्वहरू
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <span className="text-lg font-bold text-red-600">A</span>
                      </div>
                      <h6 className="font-medium">भिटामिन A</h6>
                      <p className="text-xs text-gray-600 text-center mt-1">आँखा र छालाको स्वास्थ्यका लागि</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                        <span className="text-lg font-bold text-orange-600">C</span>
                      </div>
                      <h6 className="font-medium">भिटामिन C</h6>
                      <p className="text-xs text-gray-600 text-center mt-1">प्रतिरक्षा प्रणालीका लागि</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <span className="text-lg font-bold text-green-600">K</span>
                      </div>
                      <h6 className="font-medium">भिटामिन K</h6>
                      <p className="text-xs text-gray-600 text-center mt-1">रगत जम्ने प्रक्रियाका लागि</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <span className="text-lg font-bold text-blue-600">Fe</span>
                      </div>
                      <h6 className="font-medium">आइरन</h6>
                      <p className="text-xs text-gray-600 text-center mt-1">रगत निर्माणका लागि</p>
                    </div>
                  </div>
                </div>
                
                {/* Healthy Eating Tips Section */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
                  <h4 className="text-xl font-bold text-green-800 mb-4 text-center">स्वस्थ भोजनको लागि सुझावहरू</h4>
                  <h5 className="text-md text-gray-700 italic mb-4 text-center">Tips for Healthy Eating</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 flex">
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">दैनिक कम्तिमा पाँच प्रकारका फरक रंगका तरकारीहरू समावेश गर्नुहोस्।</p>
                        <p className="text-xs text-gray-600 mt-1">Include at least five different colored vegetables daily.</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 flex">
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">तरकारीहरूलाई धेरै नपकाउनुहोस् जसले पोषक तत्वहरू नष्ट गर्दछ।</p>
                        <p className="text-xs text-gray-600 mt-1">Avoid overcooking vegetables which destroys nutrients.</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 flex">
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">ताजा, मौसमी, र स्थानीय तरकारीहरू छनोट गर्नुहोस्।</p>
                        <p className="text-xs text-gray-600 mt-1">Choose fresh, seasonal, and local produce.</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 flex">
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">विविध प्रकारका तरकारीहरू प्रयोग गर्नुहोस्।</p>
                        <p className="text-xs text-gray-600 mt-1">Use a variety of vegetables - leafy greens, root vegetables, fruiting vegetables, and cruciferous vegetables.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </FadeIn>
      </div>
    </MainLayout>
  );
};

export default Vegetables;
