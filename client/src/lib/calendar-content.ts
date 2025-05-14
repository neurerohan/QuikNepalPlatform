// Dynamic content for calendar months and events
interface MonthContent {
  name: string;
  nepaliName: string;
  gregorianMonths: string;
  temperature: string;
  highlights: string;
  days: number;
  agriculture: string;
  festivals: string[];
  description: string;
  culturalNotes: string;
}

interface FestivalEvent {
  name: string;
  nepaliName: string;
  description: string;
  month: number;
  approximateDay?: string;
  importance: 'major' | 'medium' | 'minor';
  type: 'cultural' | 'religious' | 'national' | 'international';
  movable: boolean;
}

// Month-specific dynamic content
export const getMonthContent = (month: number, year: number): MonthContent => {
  const monthsData: MonthContent[] = [
    {
      name: 'Baishakh',
      nepaliName: 'बैशाख',
      gregorianMonths: 'April-May',
      temperature: '18-30°C in the Terai region and 12-22°C in the hilly regions',
      highlights: 'the start of summer and the celebration of Nepali New Year',
      days: 31,
      agriculture: 'preparation of fields for rice cultivation and harvesting of wheat',
      festivals: ['Nepali New Year (Navavarsha)', 'Buddha Jayanti', 'Mata Tirtha Ausi (Mother\'s Day)'],
      description: 'Baishakh marks the beginning of the Nepali calendar year and is a time of celebration and fresh starts.',
      culturalNotes: 'Many people visit temples and make donations to start the new year with good karma.'
    },
    {
      name: 'Jestha',
      nepaliName: 'जेठ',
      gregorianMonths: 'May-June',
      temperature: '22-35°C in the Terai region and 15-25°C in the hilly regions',
      highlights: 'increasing heat as summer progresses and pre-monsoon showers',
      days: 31,
      agriculture: 'continued field preparation and early planting of certain crops',
      festivals: ['Sithi Nakha', 'Guru Purnima'],
      description: 'Jestha brings increasing temperatures and the first pre-monsoon showers to much of Nepal.',
      culturalNotes: 'Many Newar communities clean water sources during Sithi Nakha festival in this month.'
    },
    {
      name: 'Ashadh',
      nepaliName: 'असार',
      gregorianMonths: 'June-July',
      temperature: '25-35°C with high humidity as monsoon arrives',
      highlights: 'the arrival of the monsoon season and rice planting celebrations',
      days: 32,
      agriculture: 'rice planting (ropai) is the major agricultural activity with celebratory traditions',
      festivals: ['Ropai Jatra (Rice Planting Festival)', 'Jagannath Rath Yatra'],
      description: 'Ashadh is synonymous with the arrival of monsoon rains and rice planting across Nepal.',
      culturalNotes: 'Farmers often sing special songs called "Asare Geet" while planting rice in muddy fields.'
    },
    {
      name: 'Shrawan',
      nepaliName: 'श्रावण',
      gregorianMonths: 'July-August',
      temperature: '25-33°C with very high humidity during peak monsoon',
      highlights: 'peak monsoon season with religious observations and fasting',
      days: 31,
      agriculture: 'caring for newly planted rice crops and planting other monsoon vegetables',
      festivals: ['Shrawan Sombar', 'Nag Panchami', 'Janai Purnima', 'Raksha Bandhan', 'Ghanta Karna'],
      description: 'Shrawan is considered a holy month with many religious observances and fasting traditions.',
      culturalNotes: 'Women often wear green bangles (pote) and apply mehendi during this month for good fortune.'
    },
    {
      name: 'Bhadra',
      nepaliName: 'भाद्र',
      gregorianMonths: 'August-September',
      temperature: '24-32°C with gradually decreasing rainfall',
      highlights: 'the transition from monsoon to autumn with several important festivals',
      days: 31,
      agriculture: 'monitoring of rice crops and preparation for harvesting early varieties',
      festivals: ['Gai Jatra', 'Krishna Janmashtami', 'Teej', 'Rishi Panchami'],
      description: 'Bhadra is filled with important festivals as the monsoon begins to retreat.',
      culturalNotes: 'Gai Jatra combines commemoration of deceased loved ones with humor and social commentary.'
    },
    {
      name: 'Ashwin',
      nepaliName: 'आश्विन',
      gregorianMonths: 'September-October',
      temperature: '20-30°C with clearer skies as monsoon ends',
      highlights: 'the celebration of Dashain, Nepal\'s biggest festival',
      days: 30,
      agriculture: 'harvesting of early rice varieties and planting of winter crops',
      festivals: ['Dashain', 'Fulpati', 'Vijaya Dashami', 'Kojagrat Purnima'],
      description: 'Ashwin hosts Dashain, a 15-day celebration that's the most important festival in Nepal.',
      culturalNotes: 'During Dashain, people travel long distances to celebrate with family and receive tika and blessings from elders.'
    },
    {
      name: 'Kartik',
      nepaliName: 'कार्तिक',
      gregorianMonths: 'October-November',
      temperature: '15-28°C with cool, dry conditions beginning',
      highlights: 'the festival of lights (Tihar) and worship of various deities',
      days: 29,
      agriculture: 'main rice harvesting season and preparation for winter crops',
      festivals: ['Tihar', 'Nepal Sambat', 'Chhath Parva', 'Guru Nanak Jayanti'],
      description: 'Kartik features Tihar (festival of lights) with five days of celebrations honoring different deities and relationships.',
      culturalNotes: 'Houses are illuminated with oil lamps and candles during Tihar to invite the goddess of wealth, Laxmi.'
    },
    {
      name: 'Mangsir',
      nepaliName: 'मंसिर',
      gregorianMonths: 'November-December',
      temperature: '12-25°C with cool, dry winter beginning',
      highlights: 'the beginning of winter with decreasing temperatures',
      days: 29,
      agriculture: 'harvesting of late rice varieties and planting of winter crops like wheat and barley',
      festivals: ['Yomari Punhi', 'Sita Bibaha Panchami', 'Bala Chaturdashi'],
      description: 'Mangsir marks the proper beginning of winter season with dropping temperatures across Nepal.',
      culturalNotes: 'The Yomari Punhi festival celebrates the harvest with special sweet dumplings called Yomari.'
    },
    {
      name: 'Poush',
      nepaliName: 'पौष',
      gregorianMonths: 'December-January',
      temperature: '8-20°C with cold winter temperatures, especially in the mornings and evenings',
      highlights: 'the peak of winter season with cold temperatures and celebratory feasts',
      days: 29,
      agriculture: 'caring for winter crops and limited agricultural activity in higher elevations',
      festivals: ['Tamu Lhosar', 'Udhauli', 'Christmas', 'Dhanya Purnima'],
      description: 'Poush is one of the coldest months with several ethnic new year celebrations.',
      culturalNotes: 'Tamu Lhosar marks the beginning of the new year for the Gurung community with feasting and cultural programs.'
    },
    {
      name: 'Magh',
      nepaliName: 'माघ',
      gregorianMonths: 'January-February',
      temperature: '10-23°C with continuing winter conditions',
      highlights: 'winter festivals and the celebration of Maghe Sankranti',
      days: 29,
      agriculture: 'maintenance of winter crops and preparation for spring planting',
      festivals: ['Maghe Sankranti', 'Sonam Lhosar', 'Basanta Panchami', 'Shree Panchami'],
      description: 'Magh is marked by Maghe Sankranti, which signals the end of the winter solstice period.',
      culturalNotes: 'Special foods like til ko laddu (sesame treats), ghee, and sweet potatoes are eaten during Maghe Sankranti.'
    },
    {
      name: 'Falgun',
      nepaliName: 'फाल्गुन',
      gregorianMonths: 'February-March',
      temperature: '12-25°C with warming temperatures signaling the approach of spring',
      highlights: 'the colorful festival of Holi and the beginning of spring season',
      days: 30,
      agriculture: 'harvesting of winter crops and preparation for spring planting',
      festivals: ['Holi', 'Gyalpo Lhosar', 'Fagun Purnima', 'Ghode Jatra'],
      description: 'Falgun brings color and joy with the celebration of Holi, the festival of colors.',
      culturalNotes: 'During Holi, people throw colored powders and water at each other while sharing sweets and festivities.'
    },
    {
      name: 'Chaitra',
      nepaliName: 'चैत्र',
      gregorianMonths: 'March-April',
      temperature: '15-28°C with increasing warmth as spring progresses',
      highlights: 'the conclusion of the Nepali calendar year with various regional celebrations',
      days: 30,
      agriculture: 'preparation for the coming agricultural year and planting summer vegetables',
      festivals: ['Chaite Dashain', 'Ghode Jatra', 'Ram Navami'],
      description: 'Chaitra is the last month of the Nepali year, featuring a smaller version of the Dashain festival.',
      culturalNotes: 'Ghode Jatra (Horse Festival) in Kathmandu dates back to ancient times and is still celebrated with military displays.'
    }
  ];
  
  // Adjust for 1-indexed months (January = 1, etc.)
  return monthsData[month - 1] || monthsData[0];
};

// Major festivals and events of Nepal
export const getMajorEvents = (year: number): FestivalEvent[] => {
  return [
    {
      name: 'Nepali New Year',
      nepaliName: 'नेपाली नयाँ वर्ष',
      description: 'The beginning of the Nepali calendar year, celebrated with gatherings, feasts, and cultural events throughout Nepal.',
      month: 1, // Baishakh
      approximateDay: '1',
      importance: 'major',
      type: 'national',
      movable: false
    },
    {
      name: 'Buddha Jayanti',
      nepaliName: 'बुद्ध जयन्ती',
      description: 'Celebrates the birth, enlightenment, and death of Gautama Buddha, founder of Buddhism.',
      month: 1, // Baishakh
      approximateDay: 'Full moon',
      importance: 'major',
      type: 'religious',
      movable: true
    },
    {
      name: 'Janai Purnima',
      nepaliName: 'जनै पूर्णिमा',
      description: 'Sacred thread changing ceremony for Hindu males, and tying of protective thread bracelets (Rakhi).',
      month: 4, // Shrawan
      approximateDay: 'Full moon',
      importance: 'major',
      type: 'religious',
      movable: true
    },
    {
      name: 'Gai Jatra',
      nepaliName: 'गाई जात्रा',
      description: 'Festival to commemorate the death of loved ones with processions and humor.',
      month: 5, // Bhadra
      approximateDay: 'Early month',
      importance: 'major',
      type: 'cultural',
      movable: true
    },
    {
      name: 'Teej',
      nepaliName: 'तीज',
      description: 'Women\'s festival with fasting and prayers for marital happiness and wellbeing.',
      month: 5, // Bhadra
      approximateDay: 'Third day',
      importance: 'major',
      type: 'cultural',
      movable: true
    },
    {
      name: 'Dashain',
      nepaliName: 'दशैं',
      description: 'Nepal\'s most important 15-day festival celebrating the victory of good over evil.',
      month: 6, // Ashwin
      approximateDay: 'Mid to end of month',
      importance: 'major',
      type: 'cultural',
      movable: true
    },
    {
      name: 'Tihar',
      nepaliName: 'तिहार',
      description: 'Five-day festival of lights honoring various deities, animals, and family bonds.',
      month: 7, // Kartik
      approximateDay: 'New moon period',
      importance: 'major',
      type: 'cultural',
      movable: true
    },
    {
      name: 'Chhath Parva',
      nepaliName: 'छठ पर्व',
      description: 'Ancient Hindu festival dedicated to the Sun God and Chhathi Maiya (Mother Goddess).',
      month: 7, // Kartik
      approximateDay: 'Six days after Tihar',
      importance: 'major',
      type: 'religious',
      movable: true
    },
    {
      name: 'Maghe Sankranti',
      nepaliName: 'माघे संक्रान्ति',
      description: 'Marks the end of the winter solstice and beginning of longer days.',
      month: 10, // Magh
      approximateDay: '1',
      importance: 'major',
      type: 'cultural',
      movable: false
    },
    {
      name: 'Holi',
      nepaliName: 'होली',
      description: 'Festival of colors celebrating the arrival of spring and good harvests.',
      month: 11, // Falgun
      approximateDay: 'Full moon',
      importance: 'major',
      type: 'cultural',
      movable: true
    },
    {
      name: 'Shree Panchami',
      nepaliName: 'श्री पञ्चमी',
      description: 'Festival dedicated to Saraswati, the goddess of knowledge and learning.',
      month: 10, // Magh
      approximateDay: 'Fifth day of bright fortnight',
      importance: 'medium',
      type: 'religious',
      movable: true
    },
    {
      name: 'Lhosar',
      nepaliName: 'ल्होसार',
      description: 'Tibetan New Year celebrated by various mountain communities with different timing throughout the year.',
      month: 10, // Various months for different communities
      approximateDay: 'Varies by community',
      importance: 'major',
      type: 'cultural',
      movable: true
    }
  ];
};

// Get year-specific information
export const getYearInfo = (year: number): { description: string; highlights: string[]; specialEvents: string[] } => {
  // Default year information if specific year not found
  const defaultYearInfo = {
    description: `Nepali year ${year} BS (${year - 57}-${year - 56} AD) is projected to see advancement in several socio-economic areas.`,
    highlights: [
      'Major urban development projects in Kathmandu Valley',
      'Expansion of international air connectivity',
      'Focus on renewable energy infrastructure',
      'Educational reforms and skill development initiatives'
    ],
    specialEvents: []
  };
  
  // You could expand this with specific information for particular years
  const yearData: Record<number, any> = {
    2080: {
      description: 'Nepali year 2080 BS (2023-2024 AD) is a significant year for infrastructure development and digitalization initiatives in Nepal.',
      highlights: [
        'Major expansion of digital payment systems across rural Nepal',
        'Inauguration of new international airport facilities',
        'Implementation of federal administrative reforms',
        'Launch of national digital literacy campaign'
      ],
      specialEvents: [
        'Golden Jubilee celebration of Nepal Tourism Board',
        'Nepal Investment Summit 2023'
      ]
    },
    2081: {
      description: 'Nepali year 2081 BS (2024-2025 AD) focuses on sustainability and climate resilience initiatives throughout Nepal.',
      highlights: [
        'Launch of National Climate Resilience Program',
        'Expansion of clean energy projects in rural areas',
        'Implementation of plastic reduction initiatives in major cities',
        'New conservation efforts in national parks and protected areas'
      ],
      specialEvents: [
        'Nepal Sustainable Development Conference',
        'International Mountain Day Summit in Kathmandu'
      ]
    },
    2082: {
      description: 'Nepali year 2082 BS (2025-2026 AD) marks significant advancements in technology adoption and international partnerships.',
      highlights: [
        'Nationwide 5G network expansion to provincial capitals',
        'Launch of digital governance platform for citizen services',
        'Implementation of new trade agreements with neighboring countries',
        'Major reforms in education technology and distance learning'
      ],
      specialEvents: [
        'SAARC Cultural Festival in Kathmandu',
        '75th Anniversary of Nepal-UK Diplomatic Relations'
      ]
    }
  };
  
  return yearData[year] || defaultYearInfo;
};