import { useQuery } from '@tanstack/react-query';
import { getMetals } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import FadeIn from '@/components/ui/FadeIn';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { FaInfoCircle, FaCoins } from 'react-icons/fa'; // Using FaCoins for gold/silver, FaInfoCircle from fa
import { useEffect } from 'react';

// Background particles (similar to other pages)
const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-300/30"
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

// Metal Price Display Card Component
interface MetalDisplayCardProps {
  metalName: string;
  icon: React.ReactElement;
  prices: Array<{ label: string; value: string | number; unit?: string }>;
  bgColorClass: string;
  borderColorClass: string;
  textColorClass: string;
  animationDelay?: number;
}

const MetalDisplayCard: React.FC<MetalDisplayCardProps> = ({ 
  metalName, icon, prices, bgColorClass, borderColorClass, textColorClass, animationDelay = 0 
}) => {
  // Format price to ensure it displays properly
  const formatPrice = (value: string | number): string => {
    // If value is "0" or "0.00" or 0, return "N/A"
    if (value === '0' || value === '0.00' || value === 0 || value === 0.00) {
      return 'N/A';
    }
    // If value is already a string that's not a number, return it directly
    if (typeof value === 'string' && isNaN(Number(value))) {
      return value;
    }
    // Otherwise format the number
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <motion.div 
      className={`rounded-xl shadow-lg overflow-hidden border ${borderColorClass} ${bgColorClass}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: animationDelay }}
      whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <div className={`p-5 md:p-6 flex items-center justify-between ${borderColorClass} border-b-2`}>
        <h3 className={`text-xl md:text-2xl font-bold ${textColorClass}`}>{metalName}</h3>
        <span className={`text-3xl md:text-4xl ${textColorClass}`}>{icon}</span>
      </div>
      <div className="p-5 md:p-6 space-y-3">
        {prices.map((price, index) => (
          <div key={index} className="flex justify-between items-baseline">
            <span className="text-md text-gray-700 font-medium">{price.label}:</span>
            <span className={`text-lg md:text-xl font-semibold ${textColorClass}`}>
              {formatPrice(price.value) === 'N/A' 
                ? <span className="text-gray-500">N/A</span>
                : <>Rs. {formatPrice(price.value)}<span className="text-xs text-gray-500 ml-1">{price.unit || '/ Tola'}</span></>
              }
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Metals = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/metals'],
    queryFn: getMetals,
    staleTime: 1800000, // 30 minutes
    refetchOnWindowFocus: true,
    retry: 2, // Try up to 2 additional times if the request fails
  });

  // Debug logging to see what data we're getting
  useEffect(() => {
    console.log('Metals data:', data);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
    
    if (data) {
      console.log('Gold data:', data.gold);
      console.log('Silver data:', data.silver);
      console.log('Date:', data.date);
      console.log('Source:', data.source);
    }
  }, [data, isLoading, error]);

  // Helper function to check if we have real data (non-zero values)
  const hasRealData = () => {
    if (!data) return false;
    
    const goldFine = parseFloat(data.gold?.fineGold || '0');
    const goldTejabi = parseFloat(data.gold?.tejabiGold || '0');
    const silver = parseFloat(data.silver?.standardSilver || '0');
    
    // Return true if at least one price is not zero
    return goldFine > 0 || goldTejabi > 0 || silver > 0;
  };

  const pricesDate = data?.date ? format(parseISO(data.date), 'MMMM dd, yyyy') : "Today";
  const pageTitle = `सुन चाँदीको मूल्य (${pricesDate}) - Gold/Silver Prices Nepal`;
  const pageDescription = `नेपालमा ${pricesDate}को लागि नवीनतम सुन (Fine Gold, Tejabi Gold) र चाँदीको मूल्यहरू। FENEGOSIDA द्वारा प्रकाशित।`;

  return (
    <MainLayout title={pageTitle} description={pageDescription}>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200">
        <BackgroundParticles />
      <FadeIn>
          <section className="py-12 md:py-16 relative z-10">
          <div className="container mx-auto px-4">
              <div className="text-center mb-10 md:mb-14">
                <motion.h1 
                  className="text-4xl md:text-5xl font-extrabold text-amber-500 mb-3 tracking-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  सुन चाँदीको मूल्य
                </motion.h1>
                <motion.h2 
                  className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Gold & Silver Prices for {pricesDate}
                </motion.h2>
                <motion.p 
                  className="text-md text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA) द्वारा प्रकाशित नवीनतम दरहरू।
                  {data?.source && <span className="block text-xs mt-1">Source: {data.source}</span>}
                </motion.p>
              </div>
              
              {/* Prices Display Section */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white/50 backdrop-blur-sm shadow-md rounded-xl p-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mb-4"></div>
                  <p className="text-lg text-gray-700 font-medium">मूल्यहरू लोड हुँदैछ...</p>
                  <p className="text-sm text-gray-500">Loading latest prices...</p>
                </div>
              ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
                  <FaInfoCircle className="text-3xl mx-auto mb-3" />
                  <p className="font-bold text-xl">मूल्यहरू लोड गर्न असमर्थ।</p>
                  <p>Could not load metal prices. Please try again later.</p>
                  </div>
              ) : data && hasRealData() ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
                  <MetalDisplayCard 
                    metalName="सुन (Gold)"
                    icon={<FaCoins />}
                    prices= {[
                      { label: 'फाइन गोल्ड (Fine Gold)', value: data.gold.fineGold || 'N/A' },
                      { label: 'तेजाबी गोल्ड (Tejabi Gold)', value: data.gold.tejabiGold || 'N/A' },
                    ]}
                    bgColorClass="bg-gradient-to-br from-yellow-50 via-amber-100 to-yellow-100"
                    borderColorClass="border-amber-400"
                    textColorClass="text-amber-600"
                    animationDelay={0.1}
                  />
                  <MetalDisplayCard 
                    metalName="चाँदी (Silver)"
                    icon={<FaCoins />}
                    prices={[
                      { label: 'स्ट्यान्डर्ड चाँदी (Standard Silver)', value: data.silver.standardSilver || 'N/A' }
                    ]}
                    bgColorClass="bg-gradient-to-br from-gray-50 via-slate-100 to-gray-100"
                    borderColorClass="border-slate-400"
                    textColorClass="text-slate-600"
                    animationDelay={0.25}
                  />
                </div>
              ) : (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
                  <FaInfoCircle className="text-3xl mx-auto mb-3" />
                  <p className="font-bold text-xl">आजको लागि कुनै धातु मूल्य उपलब्ध छैन।</p>
                  <p>No metal prices available for today. Please check back later.</p>
                  <p className="text-sm mt-2 text-blue-600">API response received, but no valid price data was found.</p>
                </div>
              )}

              {/* SEO Content Section */}
              <motion.div 
                className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-primary mb-6 text-center">नेपालमा सुन र चाँदी बारे जानकारी</h3>
                
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <div>
                    <h4 className="text-xl font-semibold text-amber-600 mb-2">सुनको महत्व (Significance of Gold)</h4>
                    <p className="mb-2">
                      नेपाली संस्कृतिमा सुनको विशेष महत्व छ। यो शुभ कार्य, विवाह, चाडपर्व, र उपहार आदानप्रदानमा प्रयोग गरिन्छ। सुनलाई धन, समृद्धि, र सौभाग्यको प्रतीक मानिन्छ।
                      In Nepali culture, gold holds immense significance. It is widely used in auspicious ceremonies, weddings, festivals, and as gifts, symbolizing wealth, prosperity, and good fortune.
                    </p>
                    <p>
                      लगानीको रूपमा पनि सुन लोकप्रिय छ, किनकि यसलाई आर्थिक अनिश्चितताको समयमा सुरक्षित मानिन्छ।
                      Gold is also a popular form of investment, considered a safe haven during times of economic uncertainty.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-slate-600 mb-2">चाँदीको प्रयोग (Uses of Silver)</h4>
                    <p className="mb-2">
                      चाँदी पनि नेपाली समाजमा महत्वपूर्ण धातु हो। यो विभिन्न प्रकारका गहना, भाँडाकुँडा, र पूजा सामग्री बनाउन प्रयोग हुन्छ। चाँदीलाई शुद्धता र शीतलताको प्रतीक मानिन्छ।
                      Silver is another important metal in Nepali society, used for various ornaments, utensils, and religious items. It is often associated with purity and coolness.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">गुणस्तर र मापन (Purity and Measurement)</h4>
                    <p className="mb-2">
                      नेपालमा सुन सामान्यतया तोला (Tola) मा मापिन्छ, जहाँ १ तोला लगभग ११.६६ ग्राम बराबर हुन्छ। फाइन गोल्ड (Fine Gold) वा छापावाल सुन सामान्यतया ९९.९% शुद्ध हुन्छ, जबकि तेजाबी गोल्ड (Tejabi Gold) सामान्यतया ९९.५% शुद्ध हुन्छ र यो गहना बनाउन बढी प्रयोग गरिन्छ।
                      Gold in Nepal is typically measured in Tolas (1 Tola ≈ 11.66 grams). Fine Gold (Chhapawal) is usually 99.9% pure, while Tejabi Gold is about 99.5% pure and more commonly used for jewelry making.
                    </p>
                     <p className="mb-2">
                      चाँदीको गुणस्तर पनि प्रतिशतमा मापिन्छ, र यो पनि तोला वा ग्राममा कारोबार हुन्छ। हलमार्क (Hallmark) गरिएका गहनाहरूले शुद्धताको सुनिश्चितता प्रदान गर्दछन्।
                      Silver purity is also measured in percentages, and it's traded in Tolas or grams. Hallmarked jewelry provides assurance of purity.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">मूल्य निर्धारण (Price Determination)</h4>
                    <p className="mb-2">
                      नेपालमा सुनचाँदीको मूल्य अन्तर्राष्ट्रिय बजार दर, अमेरिकी डलरको विनिमय दर, सरकारी कर तथा शुल्क, र स्थानीय बजारको माग तथा आपूर्तिमा आधारित हुन्छ। नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA) ले दैनिक रूपमा यी मूल्यहरू प्रकाशित गर्दछ।
                      The price of gold and silver in Nepal is influenced by international market rates, the USD exchange rate, government taxes and duties, and local market demand and supply. The Federation of Nepal Gold and Silver Dealers' Association (FENEGOSIDA) typically publishes these rates daily.
                    </p>
            </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">खरिद गर्दा ध्यान दिनुपर्ने कुराहरू (Tips for Buying)</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>विश्वसनीय र आधिकारिक पसलबाट मात्र खरिद गर्नुहोस्। (Always buy from trusted and authorized dealers.)</li>
                      <li>शुद्धता (Purity) र तौल (Weight) जाँच गर्नुहोस्। (Check for purity and weight.)</li>
                      <li>हलमार्क (Hallmark) भए नभएको सुनिश्चित गर्नुहोस्। (Ensure items are hallmarked if possible.)</li>
                      <li>खरिद बिल (Purchase Bill) लिन नबिर्सनुहोस्। (Don't forget to take a purchase bill.)</li>
                    </ul>
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

export default Metals;
