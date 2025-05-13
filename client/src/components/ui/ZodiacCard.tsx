import { motion } from 'framer-motion';

interface ZodiacCardProps {
  sign: {
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
  };
}

// Map of elements to emojis and colors
const elementDetails = {
  'Fire': { emoji: '🔥', color: 'from-red-500 to-orange-400' },
  'Earth': { emoji: '🌱', color: 'from-green-500 to-emerald-400' },
  'Air': { emoji: '💨', color: 'from-blue-400 to-indigo-300' },
  'Water': { emoji: '💧', color: 'from-blue-500 to-cyan-400' }
};

const ZodiacCard = ({ sign }: ZodiacCardProps) => {
  // Map Nepali names of planets
  const getPlanetName = (name: string) => {
    const planetMap: { [key: string]: string } = {
      'Mars': 'मंगल (Mangal)',
      'Venus': 'शुक्र (Shukra)',
      'Mercury': 'बुध (Budha)',
      'Moon': 'चन्द्र (Chandra)',
      'Sun': 'सूर्य (Surya)',
      'Jupiter': 'बृहस्पति (Brihaspati)',
      'Saturn': 'शनि (Shani)',
      'Pluto': 'यम (Yama)',
      'Uranus': 'वरुण (Varuna)',
      'Neptune': 'नेप्च्युन (Neptune)'
    };
    
    return planetMap[name] || name;
  };

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">{sign.symbol}</span>
          <div>
            <h3 className="text-xl font-semibold">{sign.name}</h3>
            <p className="text-sm text-gray-600">{sign.englishName}</p>
          </div>
        </div>

        {/* Element Badge */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${elementDetails[sign.element].color} text-white mb-4`}>
          <span className="mr-1">{elementDetails[sign.element].emoji}</span>
          <span className="font-medium">{sign.element} Element</span>
        </div>
        
        {/* Prediction */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-inner mb-4 min-h-[100px]">
          <p className="text-sm leading-relaxed">{sign.prediction}</p>
        </div>
        
        {/* Zodiac Details */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-indigo-50 rounded-lg p-2 text-center">
            <div className="text-xs font-medium text-gray-700">शुभ दिन (Lucky Day)</div>
            <div className="text-sm font-semibold text-indigo-700">{sign.lucky_day}</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-2 text-center">
            <div className="text-xs font-medium text-gray-700">शुभ अंक (Lucky Number)</div>
            <div className="text-sm font-semibold text-indigo-700">{sign.lucky_number}</div>
          </div>
        </div>
        
        {/* Planet & Compatibility */}
        <div className="flex justify-between">
          <div className="text-sm">
            <span className="font-medium">ग्रह (Planet): </span>
            <span>{getPlanetName(sign.ruling_planet)}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Compatible: </span>
            <span>{sign.compatible_signs.join(', ')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ZodiacCard;
