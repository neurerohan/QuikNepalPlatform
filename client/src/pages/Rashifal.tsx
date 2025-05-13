import { useQuery } from '@tanstack/react-query';
import { getRashifal, getTodayNepaliDate } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import ZodiacCard from '@/components/ui/ZodiacCard';
import FadeIn from '@/components/ui/FadeIn';
import { motion } from 'framer-motion';
import { formatNepaliDate } from '@/lib/nepaliDateConverter';
import { useEffect, useState } from 'react';

const zodiacSigns = [
  { name: 'Mesh', englishName: 'Aries', symbol: '♈', element: 'Fire', ruling_planet: 'Mars', lucky_color: 'Red', lucky_number: '9', lucky_day: 'Tuesday', compatible_signs: ['Leo', 'Sagittarius'] },
  { name: 'Brish', englishName: 'Taurus', symbol: '♉', element: 'Earth', ruling_planet: 'Venus', lucky_color: 'Green', lucky_number: '6', lucky_day: 'Friday', compatible_signs: ['Virgo', 'Capricorn'] },
  { name: 'Mithun', englishName: 'Gemini', symbol: '♊', element: 'Air', ruling_planet: 'Mercury', lucky_color: 'Yellow', lucky_number: '5', lucky_day: 'Wednesday', compatible_signs: ['Libra', 'Aquarius'] },
  { name: 'Karkat', englishName: 'Cancer', symbol: '♋', element: 'Water', ruling_planet: 'Moon', lucky_color: 'Silver', lucky_number: '2', lucky_day: 'Monday', compatible_signs: ['Scorpio', 'Pisces'] },
  { name: 'Singha', englishName: 'Leo', symbol: '♌', element: 'Fire', ruling_planet: 'Sun', lucky_color: 'Gold', lucky_number: '1', lucky_day: 'Sunday', compatible_signs: ['Aries', 'Sagittarius'] },
  { name: 'Kanya', englishName: 'Virgo', symbol: '♍', element: 'Earth', ruling_planet: 'Mercury', lucky_color: 'Brown', lucky_number: '5', lucky_day: 'Wednesday', compatible_signs: ['Taurus', 'Capricorn'] },
  { name: 'Tula', englishName: 'Libra', symbol: '♎', element: 'Air', ruling_planet: 'Venus', lucky_color: 'Pink', lucky_number: '6', lucky_day: 'Friday', compatible_signs: ['Gemini', 'Aquarius'] },
  { name: 'Brischick', englishName: 'Scorpio', symbol: '♏', element: 'Water', ruling_planet: 'Pluto', lucky_color: 'Maroon', lucky_number: '8', lucky_day: 'Tuesday', compatible_signs: ['Cancer', 'Pisces'] },
  { name: 'Dhanu', englishName: 'Sagittarius', symbol: '♐', element: 'Fire', ruling_planet: 'Jupiter', lucky_color: 'Purple', lucky_number: '3', lucky_day: 'Thursday', compatible_signs: ['Aries', 'Leo'] },
  { name: 'Makar', englishName: 'Capricorn', symbol: '♑', element: 'Earth', ruling_planet: 'Saturn', lucky_color: 'Brown', lucky_number: '8', lucky_day: 'Saturday', compatible_signs: ['Taurus', 'Virgo'] },
  { name: 'Kumbha', englishName: 'Aquarius', symbol: '♒', element: 'Air', ruling_planet: 'Uranus', lucky_color: 'Blue', lucky_number: '7', lucky_day: 'Saturday', compatible_signs: ['Gemini', 'Libra'] },
  { name: 'Meen', englishName: 'Pisces', symbol: '♓', element: 'Water', ruling_planet: 'Neptune', lucky_color: 'Sea Green', lucky_number: '7', lucky_day: 'Thursday', compatible_signs: ['Cancer', 'Scorpio'] }
];

// Define some TypeScript interfaces for our data
interface ZodiacSign {
  name: string;
  englishName: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  ruling_planet: string;
  lucky_color: string;
  lucky_number: string;
  lucky_day: string;
  compatible_signs: string[];
  prediction?: string;
}

interface ElementDetail {
  emoji: string;
  color: string;
}

type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';

// Map of elements to emojis and colors
const elementDetails: Record<ElementType, ElementDetail> = {
  'Fire': { emoji: '🔥', color: 'from-red-500 to-orange-400' },
  'Earth': { emoji: '🌱', color: 'from-green-500 to-emerald-400' },
  'Air': { emoji: '💨', color: 'from-blue-400 to-indigo-300' },
  'Water': { emoji: '💧', color: 'from-blue-500 to-cyan-400' }
};

// Daily meditation tips by element
const meditationTips: Record<ElementType, string> = {
  'Fire': "Focus on cooling breath techniques. Visualize a calm blue lake and breathe deeply through your nose.",
  'Earth': "Ground yourself today. Place your bare feet on the earth and feel the connection with nature for 5 minutes.",
  'Air': "Practice mindful observation. Watch the clouds move across the sky and clear your thoughts.",
  'Water': "Flow with emotions today. Visualize water washing away any negative feelings as you breathe deeply."
};

// Nepali astrology specifics - add right after the elementDetails declaration
const nepaliAstrologyDetails = {
  elements: [
    { name: 'अग्नि (Agni)', description: 'Represents fire energy, transformation, and spiritual power', signs: ['Mesh', 'Singha', 'Dhanu'] },
    { name: 'पृथ्वी (Prithvi)', description: 'Represents earth energy, stability, and material wealth', signs: ['Brish', 'Kanya', 'Makar'] },
    { name: 'वायु (Vayu)', description: 'Represents air energy, intellect, and communication', signs: ['Mithun', 'Tula', 'Kumbha'] },
    { name: 'जल (Jal)', description: 'Represents water energy, emotions, and intuition', signs: ['Karkat', 'Brischick', 'Meen'] }
  ],
  nature: [
    { name: 'सात्त्विक (Satvik)', description: 'Pure, harmonious, balanced nature', signs: ['Mithun', 'Kanya', 'Tula', 'Kumbha'] },
    { name: 'राजसिक (Rajasik)', description: 'Active, passionate, ambitious nature', signs: ['Mesh', 'Singha', 'Makar', 'Dhanu'] },
    { name: 'तामसिक (Tamasik)', description: 'Deep, intense, mysterious nature', signs: ['Brish', 'Karkat', 'Brischick', 'Meen'] }
  ],
  planetary_rulers: {
    'Mesh': { name: 'मंगल (Mangal)', english: 'Mars' },
    'Brish': { name: 'शुक्र (Shukra)', english: 'Venus' },
    'Mithun': { name: 'बुध (Budha)', english: 'Mercury' },
    'Karkat': { name: 'चन्द्र (Chandra)', english: 'Moon' },
    'Singha': { name: 'सूर्य (Surya)', english: 'Sun' },
    'Kanya': { name: 'बुध (Budha)', english: 'Mercury' },
    'Tula': { name: 'शुक्र (Shukra)', english: 'Venus' },
    'Brischick': { name: 'मंगल (Mangal)', english: 'Mars' },
    'Dhanu': { name: 'बृहस्पति (Brihaspati)', english: 'Jupiter' },
    'Makar': { name: 'शनि (Shani)', english: 'Saturn' },
    'Kumbha': { name: 'शनि (Shani)', english: 'Saturn' },
    'Meen': { name: 'बृहस्पति (Brihaspati)', english: 'Jupiter' }
  }
};

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

// Zodiac compatibility recommendation component
const CompatibilityCard = ({ sign1, sign2 }: { sign1: ZodiacSign, sign2: ZodiacSign }) => {
  return (
    <motion.div 
      className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex-shrink-0 text-2xl">{sign1.symbol}</div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm">{sign1.name}</h4>
        <p className="text-xs text-gray-500">{sign1.englishName}</p>
      </div>
      <div className="flex-shrink-0 text-lg">❤️</div>
      <div className="flex-shrink-0 text-2xl">{sign2.symbol}</div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm">{sign2.name}</h4>
        <p className="text-xs text-gray-500">{sign2.englishName}</p>
      </div>
    </motion.div>
  );
};

const Rashifal = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [nepaliDate, setNepaliDate] = useState<any>(null);
  const [dailyTip, setDailyTip] = useState("");

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
    
    // Set a random meditation tip as the daily tip
    const elementKeys = Object.keys(meditationTips) as ElementType[];
    const randomElement = elementKeys[Math.floor(Math.random() * elementKeys.length)];
    setDailyTip(meditationTips[randomElement]);
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
  }) as ZodiacSign[];

  const formattedNepaliDate = nepaliDate ? 
    `${nepaliDate.day} ${nepaliDate.month_name} ${nepaliDate.year}` : 
    '30 Baishakh 2082';

  // Get the currently selected sign details
  const selectedSignData = selectedSign 
    ? mergedZodiacData.find(sign => sign.englishName === selectedSign) 
    : null;
    
  // Split selected sign prediction into paragraphs
  const paragraphs = selectedSignData?.prediction?.split('\n').filter(Boolean) || [];
  
  // Get compatible signs for the selected sign
  const compatibleSigns = selectedSignData?.compatible_signs || [];
  const compatibleSignDetails = compatibleSigns
    .map(name => mergedZodiacData.find(sign => sign.englishName === name))
    .filter((sign): sign is ZodiacSign => sign !== undefined);

  // Function to get Nepali weekday name
  const weekdayNepali = () => {
    const weekdays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'];
    const today = new Date();
    return weekdays[today.getDay()];
  };

  // Function to generate dynamic tithi and nakshatra data
  const generateDynamicTithi = () => {
    // Lunar phases
    const lunarPhases = [
      { name: "शुक्लपक्ष प्रतिपदा", english: "Shukla Paksha Pratipada" },
      { name: "शुक्लपक्ष द्वितीया", english: "Shukla Paksha Dwitiya" },
      { name: "शुक्लपक्ष तृतीया", english: "Shukla Paksha Tritiya" },
      { name: "शुक्लपक्ष चतुर्थी", english: "Shukla Paksha Chaturthi" },
      { name: "शुक्लपक्ष पञ्चमी", english: "Shukla Paksha Panchami" },
      { name: "शुक्लपक्ष षष्ठी", english: "Shukla Paksha Shashthi" },
      { name: "शुक्लपक्ष सप्तमी", english: "Shukla Paksha Saptami" },
      { name: "शुक्लपक्ष अष्टमी", english: "Shukla Paksha Ashtami" },
      { name: "शुक्लपक्ष नवमी", english: "Shukla Paksha Navami" },
      { name: "शुक्लपक्ष दशमी", english: "Shukla Paksha Dashami" },
      { name: "शुक्लपक्ष एकादशी", english: "Shukla Paksha Ekadashi" },
      { name: "शुक्लपक्ष द्वादशी", english: "Shukla Paksha Dwadashi" },
      { name: "शुक्लपक्ष त्रयोदशी", english: "Shukla Paksha Trayodashi" },
      { name: "शुक्लपक्ष चतुर्दशी", english: "Shukla Paksha Chaturdashi" },
      { name: "पूर्णिमा", english: "Purnima" },
      { name: "कृष्णपक्ष प्रतिपदा", english: "Krishna Paksha Pratipada" },
      { name: "कृष्णपक्ष द्वितीया", english: "Krishna Paksha Dwitiya" },
      { name: "कृष्णपक्ष तृतीया", english: "Krishna Paksha Tritiya" },
      { name: "कृष्णपक्ष चतुर्थी", english: "Krishna Paksha Chaturthi" },
      { name: "कृष्णपक्ष पञ्चमी", english: "Krishna Paksha Panchami" },
      { name: "कृष्णपक्ष षष्ठी", english: "Krishna Paksha Shashthi" },
      { name: "कृष्णपक्ष सप्तमी", english: "Krishna Paksha Saptami" },
      { name: "कृष्णपक्ष अष्टमी", english: "Krishna Paksha Ashtami" },
      { name: "कृष्णपक्ष नवमी", english: "Krishna Paksha Navami" },
      { name: "कृष्णपक्ष दशमी", english: "Krishna Paksha Dashami" },
      { name: "कृष्णपक्ष एकादशी", english: "Krishna Paksha Ekadashi" },
      { name: "कृष्णपक्ष द्वादशी", english: "Krishna Paksha Dwadashi" },
      { name: "कृष्णपक्ष त्रयोदशी", english: "Krishna Paksha Trayodashi" },
      { name: "कृष्णपक्ष चतुर्दशी", english: "Krishna Paksha Chaturdashi" },
      { name: "अमावस्या", english: "Amavasya" }
    ];

    const nakshatras = [
      { name: "अश्विनी", english: "Ashwini" },
      { name: "भरणी", english: "Bharani" },
      { name: "कृत्तिका", english: "Krittika" },
      { name: "रोहिणी", english: "Rohini" },
      { name: "मृगशीर्ष", english: "Mrigashirsha" },
      { name: "आर्द्रा", english: "Ardra" },
      { name: "पुनर्वसु", english: "Punarvasu" },
      { name: "पुष्य", english: "Pushya" },
      { name: "आश्लेषा", english: "Ashlesha" },
      { name: "मघा", english: "Magha" },
      { name: "पूर्वफाल्गुनी", english: "Purva Phalguni" },
      { name: "उत्तरफाल्गुनी", english: "Uttara Phalguni" },
      { name: "हस्त", english: "Hasta" },
      { name: "चित्रा", english: "Chitra" },
      { name: "स्वाति", english: "Swati" },
      { name: "विशाखा", english: "Vishakha" },
      { name: "अनुराधा", english: "Anuradha" },
      { name: "ज्येष्ठा", english: "Jyeshtha" },
      { name: "मूल", english: "Mula" },
      { name: "पूर्वाषाढ़ा", english: "Purva Ashadha" },
      { name: "उत्तराषाढ़ा", english: "Uttara Ashadha" },
      { name: "श्रवण", english: "Shravana" },
      { name: "धनिष्ठा", english: "Dhanishtha" },
      { name: "शतभिषा", english: "Shatabhisha" },
      { name: "पूर्वभाद्रपद", english: "Purva Bhadrapada" },
      { name: "उत्तरभाद्रपद", english: "Uttara Bhadrapada" },
      { name: "रेवती", english: "Revati" }
    ];

    // Generate a consistent tithi and nakshatra based on the current date
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = Number(today) - Number(startOfYear);
    const dayOfYear = Math.floor(diff / 86400000);
    
    const tithiIndex = (dayOfYear % 30);
    const nakshatra1Index = (dayOfYear % 27);
    const nakshatra2Index = ((dayOfYear + 1) % 27);
    
    // Random time for nakshatra change (between 6:00 and 10:00)
    const hour = 6 + Math.floor((dayOfYear % 5));
    const minute = (dayOfYear * 7) % 60;
    
    // Generate moonSign (raashi)
    const moonSignIndex = ((dayOfYear + 3) % 12);
    const moonSign = zodiacSigns[moonSignIndex].name;
    
    return {
      tithi: lunarPhases[tithiIndex].name,
      nakshatra1: nakshatras[nakshatra1Index].name,
      nakshatra2: nakshatras[nakshatra2Index].name,
      time: `${hour}:${minute.toString().padStart(2, '0')}`,
      moonSign: moonSign
    };
  };

  const dynamicAstrologyData = generateDynamicTithi();

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
                    {formattedNepaliDate}, {weekdayNepali()}
                  </p>
                  <p className="text-sm mt-2 text-gray-600">
                    {dynamicAstrologyData.tithi} तिथि। {dynamicAstrologyData.nakshatra1} नक्षत्र, {dynamicAstrologyData.time} बजे उप्रान्त {dynamicAstrologyData.nakshatra2}। चन्द्रराशि {dynamicAstrologyData.moonSign}।
                  </p>
                </motion.div>
                
                {/* Daily Meditation Tip */}
                <motion.div
                  className="max-w-2xl mx-auto mt-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 shadow-inner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center justify-center mb-2 gap-2">
                    <span className="text-xl">✨</span>
                    <h3 className="font-medium">Today's Meditation Tip</h3>
                    <span className="text-xl">✨</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{dailyTip}"</p>
                </motion.div>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-blue-100 relative z-10">
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
                              {selectedSignData?.symbol}
                            </span>
                            <h3 className="text-2xl font-semibold">
                              {selectedSignData?.name} ({selectedSign})
                            </h3>
                          </div>

                          {/* Element Badge */}
                          {selectedSignData?.element && (
                            <motion.div 
                              className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${elementDetails[selectedSignData.element as ElementType].color} text-white mb-4`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="mr-1">{elementDetails[selectedSignData.element as ElementType].emoji}</span>
                              <span className="font-medium">{selectedSignData.element} Element</span>
                            </motion.div>
                          )}
                          
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-inner mb-4">
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
                          
                          {/* Lucky Elements Section */}
                          <motion.div 
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <div className="bg-indigo-50 rounded-lg p-3 text-center">
                              <div className="text-sm font-medium text-gray-700">शुभ दिन (Lucky Day)</div>
                              <div className="text-xl font-semibold text-indigo-700">{selectedSignData?.lucky_day}</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-3 text-center">
                              <div className="text-sm font-medium text-gray-700">शुभ अंक (Lucky Number)</div>
                              <div className="text-xl font-semibold text-indigo-700">{selectedSignData?.lucky_number}</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-3 text-center">
                              <div className="text-sm font-medium text-gray-700">शुभ रंग (Lucky Color)</div>
                              <div className="text-xl font-semibold text-indigo-700">{selectedSignData?.lucky_color}</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-3 text-center">
                              <div className="text-sm font-medium text-gray-700">ग्रह (Planet)</div>
                              <div className="text-xl font-semibold text-indigo-700">
                                {selectedSignData && nepaliAstrologyDetails.planetary_rulers[selectedSignData.name as keyof typeof nepaliAstrologyDetails.planetary_rulers]?.name}
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Compatible Signs Section */}
                          {compatibleSignDetails.length > 0 && selectedSignData && (
                            <motion.div
                              className="mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                            >
                              <h4 className="font-medium text-lg mb-2">Best Compatibility</h4>
                              <div className="space-y-2">
                                {compatibleSignDetails.map((compatSign, i) => (
                                  <CompatibilityCard 
                                    key={i} 
                                    sign1={selectedSignData} 
                                    sign2={compatSign} 
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                          
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
                
                {/* Vedic Astrology Elements Section */}
                <motion.div 
                  className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-4">वैदिक ज्योतिषका तत्वहरू (Elements in Vedic Astrology)</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {nepaliAstrologyDetails.elements.map((element, i) => (
                      <motion.div 
                        key={element.name} 
                        className="rounded-xl p-5 shadow bg-gradient-to-b from-indigo-50 to-blue-50 border border-blue-100"
                        whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                      >
                        <h4 className="text-xl font-bold text-center mb-3 text-indigo-700">{element.name}</h4>
                        <p className="text-sm text-gray-700 mb-3">{element.description}</p>
                        <div className="mt-2 text-sm font-medium text-primary">
                          राशिहरू (Signs): {element.signs.join(', ')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-primary mb-4 mt-8">त्रिगुण: राशिको प्रकृति (Three Gunas in Astrology)</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {nepaliAstrologyDetails.nature.map((nature, i) => (
                      <motion.div 
                        key={nature.name} 
                        className="rounded-xl p-5 shadow bg-gradient-to-b from-purple-50 to-pink-50 border border-purple-100"
                        whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                      >
                        <h4 className="text-xl font-bold text-center mb-3 text-purple-700">{nature.name}</h4>
                        <p className="text-sm text-gray-700 mb-3">{nature.description}</p>
                        <div className="mt-2 text-sm font-medium text-primary">
                          राशिहरू (Signs): {nature.signs.join(', ')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* About Vedic Rashifal */}
                <motion.div 
                  className="max-w-4xl mx-auto mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-4">वैदिक राशिफल बारे (About Vedic Rashifal)</h3>
                  <p className="mb-4">
                    राशिफल वैदिक ज्योतिष अनुसार भविष्यवाणी हो। यो खगोलीय पिंडहरूको गतिविधि र विभिन्न ग्रह नक्षत्रहरूको राशिचक्रमा रहेका स्थितिको आधारमा तयार पारिन्छ।
                  </p>
                  <p className="mb-4">
                    नेपाली संस्कृतिमा, धेरै मानिसहरू आफ्नो दिनको बारेमा जान्न र महत्वपूर्ण निर्णयहरू लिन दैनिक राशिफल हेर्ने गर्छन्। प्रत्येक राशिको आफ्नै विशेषताहरू छन् र ग्रहीय चालहरूबाट फरक तरिकाले प्रभावित हुन्छन्।
                  </p>
                  <p>
                    राशिफलमा जीवनका विभिन्न पक्षहरू जस्तै करियर, सम्बन्ध, स्वास्थ्य, र सामान्य कल्याणको बारेमा भविष्यवाणीहरू समावेश हुन्छन्। केहीले यी भविष्यवाणीहरूलाई गम्भीरतापूर्वक लिए पनि, अरूले यसलाई मार्गदर्शन वा मनोरञ्जनको रूपमा हेर्छन्।
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

export default Rashifal;
