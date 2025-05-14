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
  const baseMonths: MonthContent[] = [
    {
      name: 'Baishakh',
      nepaliName: 'बैशाख',
      gregorianMonths: 'April-May',
      temperature: '18-30°C in the Terai region and 12-22°C in the hilly regions',
      highlights: 'the start of summer and the celebration of Nepali New Year',
      days: 30,
      agriculture: 'preparation of fields for rice cultivation and harvesting of wheat',
      festivals: ['Nepali New Year', 'Bisket Jatra', 'Baisakh Purnima (Buddha Jayanti)']
    },
    {
      name: 'Jestha',
      nepaliName: 'जेठ',
      gregorianMonths: 'May-June',
      temperature: '22-33°C in the Terai region and 15-26°C in the hilly regions',
      highlights: 'increasingly warmer days and preparation for monsoon season',
      days: 31,
      agriculture: 'preparation for paddy plantation and vegetable farming',
      festivals: ['Sithi Nakha', 'Jestha Purnima']
    },
    {
      name: 'Ashadh',
      nepaliName: 'असार',
      gregorianMonths: 'June-July',
      temperature: '25-35°C in the Terai region and 18-28°C in the hilly regions',
      highlights: 'the onset of monsoon rains and rice planting activities',
      days: 31,
      agriculture: 'rice plantation and tending to summer crops',
      festivals: ['Dahi Chiura Khane Din (Yogurt and Beaten Rice Day)', 'Ashadh Purnima']
    },
    {
      name: 'Shrawan',
      nepaliName: 'साउन',
      gregorianMonths: 'July-August',
      temperature: '25-33°C in the Terai region and 19-27°C in the hilly regions',
      highlights: 'heavy monsoon rainfall and lush greenery across the country',
      days: 32,
      agriculture: 'weeding rice fields and planting vegetables',
      festivals: ['Shrawan Sombar (Mondays of Shrawan)', 'Nag Panchami', 'Janai Purnima/Rakshya Bandhan']
    },
    {
      name: 'Bhadra',
      nepaliName: 'भदौ',
      gregorianMonths: 'August-September',
      temperature: '24-32°C in the Terai region and 18-26°C in the hilly regions',
      highlights: 'continued monsoon and the beginning of major festival preparations',
      days: 31,
      agriculture: 'monitoring of paddy growth and early harvests of some vegetables',
      festivals: ['Gai Jatra', 'Krishna Janmashtami', 'Teej']
    },
    {
      name: 'Ashwin',
      nepaliName: 'असोज',
      gregorianMonths: 'September-October',
      temperature: '23-31°C in the Terai region and 17-25°C in the hilly regions',
      highlights: 'the end of monsoon and the start of festival season including Dashain',
      days: 30,
      agriculture: 'harvesting early rice varieties and planting winter vegetables',
      festivals: ['Dashain (Vijaya Dashami)', 'Ghatasthapana', 'Fulpati']
    },
    {
      name: 'Kartik',
      nepaliName: 'कार्तिक',
      gregorianMonths: 'October-November',
      temperature: '18-28°C in the Terai region and 14-22°C in the hilly regions',
      highlights: 'post-Dashain celebrations and clearer skies',
      days: 30,
      agriculture: 'rice harvesting and preparation of fields for winter crops',
      festivals: ['Tihar/Deepawali', 'Chhath Parva', 'Kartik Purnima']
    },
    {
      name: 'Mangsir',
      nepaliName: 'मंसिर',
      gregorianMonths: 'November-December',
      temperature: '15-24°C in the Terai region and 10-18°C in the hilly regions',
      highlights: 'cooler temperatures and the start of winter clothing',
      days: 29,
      agriculture: 'planting winter crops like wheat, barley, and mustard',
      festivals: ['Bibaha Panchami', 'Yomari Punhi']
    },
    {
      name: 'Poush',
      nepaliName: 'पुष',
      gregorianMonths: 'December-January',
      temperature: '12-22°C in the Terai region and 8-15°C in the hilly regions',
      highlights: 'winter season and cultural ceremonies like Yomari Punhi',
      days: 30,
      agriculture: 'tending to winter crops and vegetable harvesting',
      festivals: ['Tamu Lhosar', 'Maghe Sankranti preparations']
    },
    {
      name: 'Magh',
      nepaliName: 'माघ',
      gregorianMonths: 'January-February',
      temperature: '10-20°C in the Terai region and 5-15°C in the hilly regions',
      highlights: 'the coldest month with clear Himalayan views',
      days: 29,
      agriculture: 'limited agricultural activities due to cold conditions in many regions',
      festivals: ['Maghe Sankranti', 'Sonam Lhosar', 'Basanta Panchami']
    },
    {
      name: 'Falgun',
      nepaliName: 'फागुन',
      gregorianMonths: 'February-March',
      temperature: '12-22°C in the Terai region and 8-18°C in the hilly regions',
      highlights: 'the late winter with warming trends and celebration of Holi',
      days: 30,
      agriculture: 'preparing fields for spring crops and tending to fruit trees',
      festivals: ['Holi', 'Falgu Purnima', 'Gyalpo Lhosar']
    },
    {
      name: 'Chaitra',
      nepaliName: 'चैत',
      gregorianMonths: 'March-April',
      temperature: '15-25°C in the Terai region and 10-20°C in the hilly regions',
      highlights: 'the end of winter and preparations for the New Year',
      days: 30,
      agriculture: 'harvesting winter crops and preparing for summer vegetables',
      festivals: ['Chaitra Dashain', 'Fagu Purnima (Holi)', 'Ghode Jatra']
    }
  ];

  // Apply any year-specific modifications here
  const monthContent = { ...baseMonths[month - 1] };
  
  // Adjust days for leap years - simplified example
  if (year % 4 === 0 && month === 11) {
    monthContent.days = 31; // Adjust Falgun for leap years
  }
  
  return monthContent;
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
export const getYearInfo = (year: number): { description: string; highlights: string[] } => {
  // Base information applicable to most years
  const baseInfo = {
    description: `The Nepali year ${year} BS corresponds approximately to ${year - 57}-${year - 56} AD in the Gregorian calendar. The Bikram Sambat calendar, Nepal's official calendar, is approximately 56.7 years ahead of the Western calendar.`,
    highlights: [
      'The Nepali calendar consists of 12 months, with each month having 29 to 32 days',
      'The year begins in mid-April with the month of Baishakh',
      'Major festivals like Dashain and Tihar follow the lunar calendar and move slightly each year',
      'The Nepali calendar incorporates both solar and lunar elements in its calculation'
    ]
  };

  // Add any specific information for particular years
  // This could be filled with actual historical data or upcoming known events
  const yearSpecificInfo: Record<number, { description?: string; highlights?: string[] }> = {
    2080: {
      description: 'Nepali year 2080 BS (2023-2024 AD) is notable for several political developments and infrastructure projects.',
      highlights: [
        'Several major hydropower projects are scheduled for completion',
        'Implementation of federalism continues with local government empowerment',
        'Tourism recovery efforts following the global pandemic',
        'Digital transformation initiatives across government services'
      ]
    },
    2081: {
      description: 'Nepali year 2081 BS (2024-2025 AD) marks continued development in infrastructure and technology adoption.',
      highlights: [
        'Expansion of road networks connecting remote areas',
        'Growth in digital payment systems and e-commerce',
        'Initiatives for sustainable tourism development',
        'Agricultural modernization programs in various provinces'
      ]
    },
    2082: {
      description: 'Nepali year 2082 BS (2025-2026 AD) is projected to see advancement in several socio-economic areas.',
      highlights: [
        'Major urban development projects in Kathmandu Valley',
        'Expansion of international air connectivity',
        'Focus on renewable energy infrastructure',
        'Educational reforms and skill development initiatives'
      ]
    }
  };

  // Merge base info with any year-specific information
  const yearData = yearSpecificInfo[year] || {};
  return {
    description: yearData.description || baseInfo.description,
    highlights: yearData.highlights || baseInfo.highlights
  };
};