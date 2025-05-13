import { useQuery } from '@tanstack/react-query';
import { getRashifal, getTodayNepaliDate } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import ZodiacCard from '@/components/ui/ZodiacCard';
import FadeIn from '@/components/ui/FadeIn';
import { motion } from 'framer-motion';
import { formatNepaliDate } from '@/lib/nepaliDateConverter';
import { useEffect, useState } from 'react';

const zodiacSigns = [
  { name: 'Mesh', englishName: 'Aries', symbol: '♈' },
  { name: 'Brish', englishName: 'Taurus', symbol: '♉' },
  { name: 'Mithun', englishName: 'Gemini', symbol: '♊' },
  { name: 'Karkat', englishName: 'Cancer', symbol: '♋' },
  { name: 'Singha', englishName: 'Leo', symbol: '♌' },
  { name: 'Kanya', englishName: 'Virgo', symbol: '♍' },
  { name: 'Tula', englishName: 'Libra', symbol: '♎' },
  { name: 'Brischick', englishName: 'Scorpio', symbol: '♏' },
  { name: 'Dhanu', englishName: 'Sagittarius', symbol: '♐' },
  { name: 'Makar', englishName: 'Capricorn', symbol: '♑' },
  { name: 'Kumbha', englishName: 'Aquarius', symbol: '♒' },
  { name: 'Meen', englishName: 'Pisces', symbol: '♓' }
];

// Particles animation component
const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: Math.random() * 30 + 5,
            height: Math.random() * 30 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const Rashifal = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [nepaliDate, setNepaliDate] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/rashifal'],
    queryFn: () => getRashifal(),
    staleTime: 3600000 // 1 hour
  });
  
  const { data: nepaliDateData } = useQuery({
    queryKey: ['/api/today-nepali-date'],
    queryFn: () => getTodayNepaliDate(),
    staleTime: 3600000 // 1 hour
  });

  useEffect(() => {
    if (nepaliDateData) {
      setNepaliDate(nepaliDateData);
    }
  }, [nepaliDateData]);

  // Merge API data with our zodiac signs array
  const mergedZodiacData = zodiacSigns.map(sign => {
    const apiData = data?.predictions?.find((p: any) => 
      p.sign.toLowerCase() === sign.englishName.toLowerCase()
    );
    
    return {
      ...sign,
      prediction: apiData?.prediction || 'Prediction not available at the moment.'
    };
  });

  const formattedNepaliDate = nepaliDate ? 
    `${nepaliDate.day} ${nepaliDate.month_name} ${nepaliDate.year}` : 
    '30 Baishakh 2082';

  // Split selected sign prediction into paragraphs
  const selectedSignData = selectedSign 
    ? mergedZodiacData.find(sign => sign.englishName === selectedSign) 
    : null;
    
  const paragraphs = selectedSignData?.prediction.split('\n').filter(Boolean) || [];

  return (
    <MainLayout
      title="आजको राशिफल - Today's Horoscope"
      description="Read daily horoscope predictions for all zodiac signs in the Nepali tradition."
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
                  आजको राशिफल
                </motion.h1>
                <motion.h2 
                  className="text-2xl font-semibold text-gray-700 mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Today's Horoscope
                </motion.h2>
                <motion.div
                  className="text-neutral-600 mt-4 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="font-medium text-lg">
                    {formattedNepaliDate}, {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p className="text-sm mt-2 text-gray-600">
                    ज्येष्ठ कृष्णपक्ष प्रतिपदा तिथि। विशाखा नक्षत्र, ८ः३६ बजे उप्रान्त अनुराधा। चन्द्रराशि वृश्चिक।
                  </p>
                  <p className="text-sm mt-2 italic">उपप्रा. लक्ष्मीप्रसाद बराल (फलितज्योतिषाचार्य)</p>
                </motion.div>
              </div>

              <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-blue-100 relative z-10">
                <div className="md:flex">
                  {/* Zodiac Signs List */}
                  <div className="md:w-1/3 bg-gradient-to-br from-primary/10 to-blue-50 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">राशिहरू (Zodiac Signs)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                      {mergedZodiacData.map((sign, index) => (
                        <motion.button
                          key={index}
                          className={`flex items-center p-3 rounded-lg text-left transition-all ${
                            selectedSign === sign.englishName 
                              ? 'bg-primary text-white shadow-md' 
                              : 'bg-white hover:bg-primary/5 shadow-sm'
                          }`}
                          onClick={() => setSelectedSign(sign.englishName)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <span className="text-2xl mr-3">{sign.symbol}</span>
                          <div>
                            <div className="font-medium">{sign.name}</div>
                            <div className="text-xs opacity-80">{sign.englishName}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Prediction Display */}
                  <div className="md:w-2/3 p-6">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 p-4 rounded-lg text-red-800">
                        Failed to load rashifal data. Please try again later.
                      </div>
                    ) : selectedSign ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                      >
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">
                            {mergedZodiacData.find(s => s.englishName === selectedSign)?.symbol}
                          </span>
                          <h3 className="text-2xl font-semibold">
                            {mergedZodiacData.find(s => s.englishName === selectedSign)?.name} ({selectedSign})
                          </h3>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-inner">
                          {paragraphs.map((paragraph: string, i: number) => (
                            <motion.p 
                              key={i} 
                              className="mb-3 last:mb-0 leading-relaxed"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                            >
                              {paragraph}
                            </motion.p>
                          ))}
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-500 italic">
                          * Tap on another sign to read its prediction
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="text-5xl mb-4">✨</div>
                          <h3 className="text-xl font-semibold text-primary mb-2">Your Daily Cosmic Guide</h3>
                          <p className="text-gray-600 mb-4">
                            Select your zodiac sign from the list to see what the stars have in store for you today
                          </p>
                          <div className="flex justify-center gap-2 text-3xl">
                            {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((symbol, i) => (
                              <motion.span 
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                {symbol}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <motion.div 
                className="max-w-4xl mx-auto mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-primary mb-4">About Nepali Rashifal</h3>
                <p className="mb-4">
                  Rashifal is the Nepali term for horoscope predictions. These daily forecasts are based on the movement 
                  of celestial bodies and their effects on different zodiac signs according to Hindu astrology.
                </p>
                <p className="mb-4">
                  In Nepali culture, many people consult their daily rashifal to get insights about their day and 
                  make important decisions accordingly. Each sign is associated with specific characteristics and is 
                  influenced differently by planetary movements.
                </p>
                <p>
                  The predictions cover various aspects of life including career, relationships, health, and general wellbeing. 
                  While some take these predictions seriously, others view them as guidance or entertainment.
                </p>
              </motion.div>
            </div>
          </section>
        </FadeIn>
      </div>
    </MainLayout>
  );
};

export default Rashifal;
