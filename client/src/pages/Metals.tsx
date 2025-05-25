import { useQuery } from '@tanstack/react-query';
import { getMetals } from '@/api';
import MainLayout from '@/components/layout/MainLayout';
import FadeIn from '@/components/ui/FadeIn';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { FaInfoCircle, FaCoins } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getFormattedKathmanduTime } from '@/lib/nepaliDateConverter';
import SEO from '@/components/SEO';

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
  const { data: metalPrices, isLoading, error } = useQuery({
    queryKey: ['/prices/metals'],
    queryFn: getMetals,
    staleTime: 1800000, // 30 minutes
    refetchOnWindowFocus: true,
    retry: 2, // Try up to 2 additional times if the request fails
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Debug logging to see what data we're getting
  useEffect(() => {
    console.log('Metals data:', metalPrices);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
  }, [metalPrices, isLoading, error]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching metal prices:', error);
      setErrorMessage(error?.message || 'Failed to load metal prices');
    } else if (metalPrices && !isLoading && !hasRealData()) {
      setErrorMessage('No metal price data available at the moment');
    }
  }, [metalPrices, isLoading, error]);

  // SEO optimization
  const kathmanduTime = getFormattedKathmanduTime();
  const modifiedDate = new Date().toISOString();
  const pageKeywords = "gold price in nepal, cost of gold in nepal, gold value in nepal, gold, gold price, gold price today, gold rate today, cost of gold today, 1 tola gold price nepal, gold price at nepal today";

  interface MetalPrice {
    metal_type: string;
    hallmark?: string;
    price_per_tola: number;
    price_per_10_grams: number;
    source?: string;
  }

  const goldPrices = metalPrices?.filter((m: MetalPrice) => m.metal_type.toLowerCase().includes('gold')) || [];
  const silverPrices = metalPrices?.filter((m: MetalPrice) => m.metal_type.toLowerCase().includes('silver')) || [];

  // Helper function to check if we have real data (non-zero values)
  const hasRealData = () => {
    if (!metalPrices || metalPrices.length === 0) return false;
    return metalPrices.some((metal: MetalPrice) => metal.price_per_tola > 0);
  };

  // Use Kathmandu time for the date if no specific date is provided in the data
  const lastUpdated = metalPrices?.[0]?.updated_at
    ? format(parseISO(metalPrices[0].updated_at), "EEEE, MMMM d, yyyy h:mm a 'NPT'")
    : 'N/A';
  const pageTitle = `सुन चाँदीको मूल्य (${lastUpdated}) - Gold/Silver Prices Nepal`;
  const pageDescription = `नेपालमा ${lastUpdated}को लागि नवीनतम सुन (Fine Gold, Tejabi Gold) र चाँदीको मूल्यहरू। FENEGOSIDA द्वारा प्रकाशित।`;

  // Update page title and description with SEO-optimized versions
  const seoTitle = "Gold Price in Nepal Today | 1 Tola Gold Rate | Gold Value in Nepal";
  const seoDescription = "Check today's gold price in Nepal with real-time updates. Current gold rate today in Nepal per tola and gram. Daily gold and silver price updates from FENEGOSIDA.";
  
  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={pageKeywords}
        publishedDate="2024-01-01"
        modifiedDate={modifiedDate}
        canonicalUrl="https://quiknepal.com"
        pathname="/gold-and-silver-in-nepal"
        ogImage="https://quiknepal.com/og-images/gold-price-nepal.jpg"
        ogType="website"
        twitterCardType="summary_large_image"
        schemaType="WebPage"
        hrefLangs={[
          { lang: "en", url: "https://quiknepal.com/en/gold-and-silver-in-nepal" },
          { lang: "ne", url: "https://quiknepal.com/ne/gold-and-silver-in-nepal" }
        ]}
      >
        {/* Product Schema for Gold */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Gold in Nepal",
            "description": "Current gold prices in Nepal including fine gold and tejabi gold rates.",
            "image": "https://quiknepal.com/images/gold-nepal.jpg",
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": goldPrices[0]?.price_per_tola || "0",
              "highPrice": goldPrices[0]?.price_per_tola || "0",
              "priceCurrency": "NPR",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
            },
            "brand": {
              "@type": "Brand",
              "name": "FENEGOSIDA"
            }
          })}
        </script>
        
        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Gold Price in Nepal Today - Daily Updates",
            "image": "https://quiknepal.com/og-images/gold-price-nepal.jpg",
            "datePublished": "2024-01-01",
            "dateModified": modifiedDate,
            "author": {
              "@type": "Organization",
              "name": "QuikNepal",
              "url": "https://quiknepal.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "QuikNepal",
              "logo": {
                "@type": "ImageObject",
                "url": "https://quiknepal.com/logo.png"
              }
            },
            "description": seoDescription
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
                "name": "What is the current gold price in Nepal?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The current price of fine gold (24K) in Nepal is NPR ${goldPrices[0]?.price_per_tola || "N/A"} per tola, while tejabi gold (22K) is NPR ${goldPrices[0]?.price_per_tola || "N/A"} per tola. These rates are updated daily based on international market prices and local factors.`
                }
              },
              {
                "@type": "Question",
                "name": "What factors affect gold prices in Nepal?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Gold prices in Nepal are influenced by international market rates, USD exchange rates, government taxes and duties, and local market demand and supply. The Federation of Nepal Gold and Silver Dealers' Association (FENEGOSIDA) publishes these rates daily."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between fine gold and tejabi gold?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Fine gold refers to 24 karat (99.99% pure) gold, while tejabi gold refers to 22 karat (91.6% pure) gold which is commonly used for jewelry making. Fine gold is more expensive due to its higher purity level."
                }
              }
            ]
          })}
        </script>
      </SEO>
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
                  Gold & Silver Prices for {kathmanduTime}
                </motion.h2>
                <motion.p 
                  className="text-md text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA) द्वारा प्रकाशित नवीनतम दरहरू।
                  {metalPrices?.[0]?.source && (
                    <span className={`block text-xs mt-1 ${metalPrices[0].source.includes('Fallback') || metalPrices[0].source.includes('Error') ? 'text-amber-600' : 'text-green-600'}`}>
                      <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ backgroundColor: metalPrices[0].source.includes('Fallback') || metalPrices[0].source.includes('Error') ? '#f59e0b' : '#10b981' }}></span>
                      Source: {metalPrices[0].source}
                    </span>
                  )}
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
                  <p className="text-sm mt-2 text-red-600">{errorMessage}</p>
                </div>
              ) : metalPrices && hasRealData() ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
                  {/* Gold Prices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goldPrices.map((gold: MetalPrice, index: number) => (
                      <MetalDisplayCard
                        key={gold.metal_type}
                        metalName={gold.hallmark || 'Gold'}
                        icon={<FaCoins />}
                        prices={[
                          { label: 'Per Tola', value: gold.price_per_tola },
                          { label: 'Per 10g', value: gold.price_per_10_grams }
                        ]}
                        bgColorClass={index === 0 ? 'bg-amber-50' : 'bg-amber-50/80'}
                        borderColorClass="border-amber-200"
                        textColorClass="text-amber-600"
                        animationDelay={0.1 * (index + 1)}
                      />
                    ))}
                  </div>
                  {/* Silver Prices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {silverPrices.map((silver: MetalPrice, index: number) => (
                      <MetalDisplayCard
                        key={silver.metal_type}
                        metalName={silver.hallmark || 'Silver'}
                        icon={<FaCoins />}
                        prices={[
                          { label: 'Per Tola', value: silver.price_per_tola },
                          { label: 'Per 10g', value: silver.price_per_10_grams }
                        ]}
                        bgColorClass={index === 0 ? 'bg-gray-50' : 'bg-gray-50/80'}
                        borderColorClass="border-slate-200"
                        textColorClass="text-slate-600"
                        animationDelay={0.1 * (index + 1)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
                  <FaInfoCircle className="text-3xl mx-auto mb-3" />
                  <p className="font-bold text-xl">आजको लागि कुनै धातु मूल्य उपलब्ध छैन।</p>
                  <p>No metal prices available for today. Please check back later.</p>
                  <p className="text-sm mt-2 text-blue-600">{errorMessage}</p>
                  <button 
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Data
                  </button>
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
    </>
  );
};

export default Metals;
