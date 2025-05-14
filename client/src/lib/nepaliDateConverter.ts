/**
 * Nepali Date Converter
 * Conversion logic adapted from various Nepali calendar libraries
 */

// Data mapping start dates and corresponding days in each BS month
// Reference years from 2000 BS (1943 AD) to 2090 BS (2033/2034 AD)
const calendarData = [
  [2000, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2001, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2002, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2003, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2004, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2005, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2006, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2007, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2008, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [2009, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2010, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2011, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2012, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [2013, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2014, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2015, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2016, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [2017, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2018, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2019, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2020, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [2021, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2022, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [2023, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2024, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [2025, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2026, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2027, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2028, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2029, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  [2030, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2031, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2032, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2033, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2034, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2035, 30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [2036, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2037, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2038, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2039, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [2040, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2041, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2042, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2043, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [2044, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2045, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2046, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2047, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [2048, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2049, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [2050, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2051, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [2052, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2053, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [2054, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2055, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2056, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  [2057, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2058, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2059, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2060, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2061, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2062, 30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  [2063, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2064, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2065, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2066, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [2067, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2068, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2069, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2070, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [2071, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2072, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [2073, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [2074, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [2075, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2076, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [2077, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [2078, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [2079, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [2080, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [2081, 31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [2082, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [2083, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [2084, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [2085, 31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [2086, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [2087, 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  [2088, 30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [2089, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [2090, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
];

// Reference date for conversion algorithm
// 1 January 1944 AD corresponds to 17 Poush 2000 BS
const startNepaliDate = {
  year: 2000,
  month: 9, // 0-based, so 9 = Poush (10th month)
  day: 17
};

const startEnglishDate = new Date(1944, 0, 1); // 1 January 1944

// Month names
const nepaliMonths = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
  'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
  'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const englishMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Convert AD date to BS date
export function convertADToBS(adDate: Date): {
  year: number;
  month: number;
  month_name: string;
  day: number;
  day_of_week: number;
  ad_date: string;
  bs_date: string;
} {
  // Calculate difference in days from reference date
  const timeDiff = adDate.getTime() - startEnglishDate.getTime();
  let daysSinceReference = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  let nepaliYear = startNepaliDate.year;
  let nepaliMonth = startNepaliDate.month;
  let nepaliDay = startNepaliDate.day;
  
  // Adjust for negative difference (dates before reference date)
  if (daysSinceReference < 0) {
    return estimateNepaliDate(adDate);
  }
  
  // Add days to reference date to get current BS date
  while (daysSinceReference > 0) {
    // Get total days in current Nepali month
    const daysInMonth = getNumDaysInNepaliMonth(nepaliYear, nepaliMonth);
    
    if (daysSinceReference < daysInMonth - nepaliDay + 1) {
      // If days left fit in current month
      nepaliDay += daysSinceReference;
      daysSinceReference = 0;
    } else {
      // Move to next month
      daysSinceReference -= (daysInMonth - nepaliDay + 1);
      nepaliMonth++;
      nepaliDay = 1;
      
      // If we reached the end of the year, move to next year
      if (nepaliMonth > 11) {
        nepaliMonth = 0;
        nepaliYear++;
      }
    }
  }
  
  // Format the date for return
  return {
    year: nepaliYear,
    month: nepaliMonth + 1, // Convert from 0-based to 1-based
    month_name: nepaliMonths[nepaliMonth],
    day: nepaliDay,
    day_of_week: adDate.getDay(),
    ad_date: formatADDate(adDate),
    bs_date: `${nepaliYear}-${nepaliMonth + 1}-${nepaliDay}`
  };
}

// Convert BS date to AD date
export function convertBSToAD(bsYear: number, bsMonth: number, bsDay: number): {
  year: number;
  month: number;
  month_name: string;
  day: number;
  day_of_week: number;
  bs_date: string;
  ad_date: string;
} {
  // Check if date is within valid range
  if (bsYear < 2000 || bsYear > 2090) {
    return fallbackADDate(bsYear, bsMonth, bsDay);
  }
  
  // Calculate days from BS reference date
  let totalDays = 0;
  
  // Days from start Nepali date to 1st day of input year
  let bsYearIterator = startNepaliDate.year;
  
  // Add days for complete years
  while (bsYearIterator < bsYear) {
    for (let month = 0; month < 12; month++) {
      totalDays += getNumDaysInNepaliMonth(bsYearIterator, month);
    }
    bsYearIterator++;
  }
  
  // Add days from months of input year
  for (let month = 0; month < bsMonth - 1; month++) {
    totalDays += getNumDaysInNepaliMonth(bsYear, month);
  }
  
  // Add days of input month
  totalDays += bsDay - 1;
  
  // Adjust for reference point
  // Days from reference BS date (17 Poush 2000) to 1 Baishakh 2000
  let referenceToYearStartDays = -(startNepaliDate.day - 1);
  for (let month = 0; month < startNepaliDate.month; month++) {
    referenceToYearStartDays -= getNumDaysInNepaliMonth(startNepaliDate.year, month);
  }
  
  totalDays -= startNepaliDate.day - 1; // Days remaining in reference month
  
  // Add days to AD reference date
  const adDate = new Date(startEnglishDate);
  adDate.setDate(adDate.getDate() + totalDays);
  
  // Format the result
  return {
    year: adDate.getFullYear(),
    month: adDate.getMonth() + 1,
    month_name: englishMonths[adDate.getMonth()],
    day: adDate.getDate(),
    day_of_week: adDate.getDay(),
    bs_date: `${bsYear}-${bsMonth}-${bsDay}`,
    ad_date: formatADDate(adDate)
  };
}

// Helper function to get number of days in a Nepali month
function getNumDaysInNepaliMonth(year: number, month: number): number {
  // Find the year data in our calendar array
  const yearData = calendarData.find(data => data[0] === year);
  
  if (yearData) {
    return yearData[month + 1]; // month+1 since first element is year
  }
  
  // If year not found (outside our range), use an approximation
  return 30; // Most months have 30-32 days
}

// Fallback estimation for dates outside our reference range
function estimateNepaliDate(adDate: Date) {
  // For dates outside our range, calculate an approximation
  const yearDiff = adDate.getFullYear() - 1944;
  const estimatedNepaliYear = 2000 + yearDiff;
  
  return {
    year: estimatedNepaliYear,
    month: adDate.getMonth() + 1,
    month_name: nepaliMonths[adDate.getMonth()],
    day: adDate.getDate(),
    day_of_week: adDate.getDay(),
    ad_date: formatADDate(adDate),
    bs_date: `${estimatedNepaliYear}-${adDate.getMonth() + 1}-${adDate.getDate()}`
  };
}

function fallbackADDate(bsYear: number, bsMonth: number, bsDay: number) {
  // For BS dates outside our range, calculate an approximation
  const yearDiff = bsYear - 2000;
  const estimatedADYear = 1944 + yearDiff;
  
  const adDate = new Date(estimatedADYear, bsMonth - 1, bsDay);
  
  return {
    year: adDate.getFullYear(),
    month: adDate.getMonth() + 1,
    month_name: englishMonths[adDate.getMonth()],
    day: adDate.getDate(),
    day_of_week: adDate.getDay(),
    bs_date: `${bsYear}-${bsMonth}-${bsDay}`,
    ad_date: formatADDate(adDate)
  };
}

// Helper function to format AD date as YYYY-MM-DD
function formatADDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get current Nepali date
export function getCurrentNepaliDate() {
  const today = new Date();
  return convertADToBS(today);
}

// Format Nepali date in a readable format
export function formatNepaliDate(bsDate: { year: number; month: number; day: number; month_name?: string }) {
  const monthName = bsDate.month_name || nepaliMonths[bsDate.month - 1];
  return `${bsDate.day} ${monthName} ${bsDate.year}`;
} 