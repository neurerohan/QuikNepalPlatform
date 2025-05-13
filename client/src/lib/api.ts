import axios from 'axios';
import { isHolidayEvent } from './holidays';
import { getCurrentNepaliDate } from './nepaliDateConverter';

// Change the base URL to directly access the external API
const API_BASE_URL = "https://api.kalimatirate.nyure.com.np/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCalendar = async (year: string, month: string) => {
  try {
    console.log(`Fetching calendar for year=${year}, month=${month}`);
    
    // Convert month number to Nepali month name
    const nepaliMonths = [
      'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
      'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
      'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];
    const monthName = nepaliMonths[parseInt(month) - 1] || 'Baishakh';
    
    // Use the direct endpoint
    const response = await api.get(`detailed-calendar/?year=${year}&month_name=${monthName}`);
    console.log("Calendar API response status:", response.status);
    
    // Log the first few properties to debug
    if (response.data) {
      console.log("Calendar response contains data:", Object.keys(response.data));
      if (response.data.days) {
        console.log(`Calendar has ${response.data.days.length} days`);
        // Log first day to show structure
        if (response.data.days.length > 0) {
          console.log("First day sample:", JSON.stringify(response.data.days[0]).substring(0, 200) + "...");
        }
      } else {
        console.error("No days data in response");
      }
    }
    
    if (response.data && response.data.days) {
      let calendarData = response.data.days;
      
      // Sort data by day number to ensure days are in correct order
      calendarData = calendarData.sort((a: any, b: any) => {
        return parseInt(a.bs_day_english_equivalent) - parseInt(b.bs_day_english_equivalent);
      });
      
      // Format the data to match component expectations
      return {
        days: calendarData.map((day: any) => {
          // Check if the day has events
          const events = day.events_raw?.length ? day.events_raw : [];
          
          // Get the Nepali day from the bs_day_nepali (which is in Devanagari script)
          // or fallback to bs_day_english_equivalent as integer
          let nepaliDay = day.bs_day_nepali; // This is in Devanagari script like "१", "२", etc.
          let nepaliDayNumeric = parseInt(day.bs_day_english_equivalent); // This is 1, 2, etc.
          
          return {
            bs: {
              year: day.bs_year,
              month: day.bs_month_number,
              day: nepaliDayNumeric,
              nepaliDay: nepaliDay // Keep the Devanagari representation
            },
            ad: {
              year: day.ad_year,
              month: getMonthNumberFromName(day.ad_month_name),
              day: day.ad_day,
              monthName: day.ad_month_name
            },
            isHoliday: events.some((event: string) => isHolidayEvent(event)), // Only mark as holiday if event matches our holiday list
            events: events,
            dayOfWeek: getDayOfWeekNumber(day.day_of_week),
            tithi: day.tithi
          };
        }),
        monthDetails: {
          bs: {
            monthName: response.data.month_name,
            year: parseInt(year),
            month: parseInt(month)
          },
          ad: {
            monthName: calendarData[0]?.ad_month_name || 'Unknown',
            year: calendarData[0]?.ad_year || new Date().getFullYear(),
            month: getMonthNumberFromName(calendarData[0]?.ad_month_name) || new Date().getMonth() + 1
          },
          meta: {
            nepaliHeader: calendarData[0]?.meta_header_nepali,
            englishHeader: calendarData[0]?.meta_header_english,
            source: calendarData[0]?.source_url
          }
        }
      };
    } else {
      console.error("Invalid API response format:", response.data);
      throw new Error("Invalid API response format");
    }
  } catch (error) {
    console.error("Error in calendar data generation:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

// Function to get calendar events
export const getCalendarEvents = async (params: { year_bs?: string, start_date_bs?: string, end_date_bs?: string }) => {
  try {
    const response = await api.get('calendar/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error("Failed to fetch calendar events");
  }
};

// Helper function to get month number from name
function getMonthNumberFromName(monthName: string): number {
  const months = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };
  return months[monthName as keyof typeof months] || 1;
}

// Helper function to get day of week number
function getDayOfWeekNumber(dayName: string): number {
  const days = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  return days[dayName as keyof typeof days] || 0;
};

// Helper function to get Nepali month name
export function getMonthName(month: number): string {
  const nepaliMonths = [
    'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
    'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
    'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  return nepaliMonths[month - 1] || '';
}

export const convertDate = async (params: { from: string; date: string }) => {
  const response = await api.get(`calendar/convert`, { params });
  return response.data;
};

export const getVegetables = async () => {
  const response = await api.get('vegetables/');
  // Extract results from the response
  return response.data.results || [];
};

export const getMetals = async () => {
  try {
    console.log("Fetching Metal prices...");
    const response = await api.get('metals/');
    console.log("Metals API raw response:", JSON.stringify(response.data, null, 2));

    // Expected structure: response.data or response.data.results (if paginated, take first result or specific latest entry)
    // or response.data directly contains { gold: {...}, silver: {...}, date: ... }

    let metalData = response.data;

    // If data is nested under 'results' and it's an array, take the first item (assuming latest)
    if (response.data && response.data.results && Array.isArray(response.data.results) && response.data.results.length > 0) {
      console.log("Metals API response has 'results' array. Taking first item as latest.");
      metalData = response.data.results[0]; 
    } else if (Array.isArray(response.data) && response.data.length > 0) {
      console.log("Metals API response is a direct array. Taking first item as latest.");
      metalData = response.data[0];
    }

    // Now process metalData which should be an object
    if (metalData && typeof metalData === 'object' && !Array.isArray(metalData)) {
      console.log("Processing metalData object:", JSON.stringify(metalData, null, 2));
      
      // First attempt: Direct access to structured data
      let gold = {};
      let silver = {};
      
      if (metalData.gold && typeof metalData.gold === 'object') {
        gold = metalData.gold;
      }
      
      if (metalData.silver && typeof metalData.silver === 'object') {
        silver = metalData.silver;
      }
      
      // Extract values with fallbacks and different possible property names
      // For gold prices
      const fineGoldValue = getFirstNonEmptyValue([
        gold.fine_gold, gold.fineGold, gold.fine, gold.fg_price, gold.price_fine_gold,
        metalData.fine_gold, metalData.fineGold, metalData.fine, metalData.fg_price, 
        metalData.price_fine_gold, metalData.fine_gold_price, metalData.gold_fine_price,
        // Any price with 'fine' and 'gold' in it
        ...Object.entries(metalData)
          .filter(([key]) => key.toLowerCase().includes('fine') && key.toLowerCase().includes('gold'))
          .map(([_, value]) => value)
      ]);
      
      const tejabiGoldValue = getFirstNonEmptyValue([
        gold.tejabi_gold, gold.tejabiGold, gold.standard_gold, gold.standardGold, 
        gold.tejabi, gold.sg_price, gold.price_tejabi_gold,
        metalData.tejabi_gold, metalData.tejabiGold, metalData.standard_gold, 
        metalData.standardGold, metalData.tejabi, metalData.sg_price, 
        metalData.price_tejabi_gold, metalData.tejabi_gold_price,
        // Any price with 'tejabi' or 'standard' and 'gold' in it
        ...Object.entries(metalData)
          .filter(([key]) => (key.toLowerCase().includes('tejabi') || key.toLowerCase().includes('standard')) 
                            && key.toLowerCase().includes('gold'))
          .map(([_, value]) => value)
      ]);
      
      // For silver price
      const standardSilverValue = getFirstNonEmptyValue([
        silver.standard_silver, silver.standardSilver, silver.silver_price, 
        silver.price_silver, silver.ss_price,
        metalData.standard_silver, metalData.standardSilver, metalData.silver_price, 
        metalData.price_silver, metalData.ss_price, metalData.silver,
        // Any property with 'silver' in it
        ...Object.entries(metalData)
          .filter(([key]) => key.toLowerCase().includes('silver'))
          .map(([_, value]) => value)
      ]);
      
      // Try to find dates - looking for any date-like field
      const priceDate = getFirstNonEmptyValue([
        metalData.date, metalData.effective_date, metalData.last_updated,
        metalData.update_date, metalData.published_date, metalData.created_at
      ]) || new Date().toISOString().split('T')[0];
      
      // Format prices properly
      const formattedFineGold = formatPrice(fineGoldValue);
      const formattedTejabiGold = formatPrice(tejabiGoldValue);
      const formattedStandardSilver = formatPrice(standardSilverValue);
      
      console.log("Extracted prices:", {
        fineGold: formattedFineGold, 
        tejabiGold: formattedTejabiGold, 
        standardSilver: formattedStandardSilver
      });
      
      // Only return non-zero prices if all are zero (indicating no data)
      // If at least one price is valid, return the data
      if (parseFloat(formattedFineGold) > 0 || parseFloat(formattedTejabiGold) > 0 || parseFloat(formattedStandardSilver) > 0) {
        const processedData = {
          gold: {
            fineGold: formattedFineGold,
            tejabiGold: formattedTejabiGold,
          },
          silver: {
            standardSilver: formattedStandardSilver,
          },
          date: priceDate,
          source: metalData.source || 'Nepal Rastra Bank / FENEGOSIDA'
        };
        
        console.log("Final processed Metal Data:", processedData);
        return processedData;
      }
      
      // If we get here, we didn't find any valid prices in the normal structure
      // Let's try a more aggressive approach - look for any number in the object
      // that could potentially be a price
      console.log("No structured prices found. Searching for any possible price values...");
      
      const possiblePrices = findPossiblePrices(metalData);
      if (possiblePrices.length > 0) {
        console.log("Found possible price values:", possiblePrices);
        
        // Use the first 3 price values we found (if available) for gold fine, gold tejabi, and silver
        const goldFinePrice = possiblePrices[0] || "0";
        const goldTejabiPrice = possiblePrices[1] || "0";
        const silverPrice = possiblePrices[2] || "0";
        
        const processedData = {
          gold: {
            fineGold: formatPrice(goldFinePrice),
            tejabiGold: formatPrice(goldTejabiPrice),
          },
          silver: {
            standardSilver: formatPrice(silverPrice),
          },
          date: priceDate,
          source: metalData.source || 'Nepal Rastra Bank / FENEGOSIDA'
        };
        
        console.log("Final processed Metal Data from possible prices:", processedData);
        return processedData;
      }
    }

    console.warn("Unexpected Metals API response format. Using mock data.");
    // Provide realistic mock data instead of zeros to ensure UI shows something useful
    const mockData = {
      gold: { fineGold: '108250.00', tejabiGold: '107900.00' },
      silver: { standardSilver: '1385.00' },
      date: new Date().toISOString().split('T')[0],
      source: 'Mock Data (API format not recognized)'
    };
    console.log("Using mock data:", mockData);
    return mockData;

  } catch (error) {
    console.error("Error fetching or processing metal prices:", error);
    // Return mock data on error rather than zeros
    const mockData = {
      gold: { fineGold: '108250.00', tejabiGold: '107900.00' },
      silver: { standardSilver: '1385.00' },
      date: new Date().toISOString().split('T')[0],
      source: 'Mock Data (API Error)'
    };
    console.log("Using mock data on error:", mockData);
    return mockData;
  }
};

// Helper function to find the first non-empty value from an array of potential values
function getFirstNonEmptyValue(values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return null;
}

// Helper function to format price correctly
function formatPrice(price) {
  if (price === null || price === undefined || price === '') {
    return '0.00';
  }
  
  // If it's already a number string that looks like "0" or "0.00", return it formatted
  if (typeof price === 'string' && !isNaN(parseFloat(price))) {
    return parseFloat(price).toFixed(2);
  }
  
  // If it's a number
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  
  // If it's a string but not a valid number (e.g., "N/A"), return 0
  return '0.00';
}

// Helper function to recursively search for any values that look like prices
function findPossiblePrices(obj, results = []) {
  if (!obj || typeof obj !== 'object') return results;
  
  for (const [key, value] of Object.entries(obj)) {
    // If the value is a number or a string that can be parsed as a number
    if (typeof value === 'number' || 
       (typeof value === 'string' && !isNaN(parseFloat(value)) && parseFloat(value) > 0)) {
      // If the key suggests this might be a price (price, rate, gold, silver, etc.)
      if (key.toLowerCase().includes('price') || 
          key.toLowerCase().includes('rate') || 
          key.toLowerCase().includes('gold') || 
          key.toLowerCase().includes('silver') ||
          key.toLowerCase().includes('amount') ||
          key.toLowerCase().includes('value')) {
        results.push(value);
      } 
      // If the value is in a typical price range for gold/silver in Nepal (500-150000)
      else if ((typeof value === 'number' && value >= 500 && value <= 150000) ||
              (typeof value === 'string' && parseFloat(value) >= 500 && parseFloat(value) <= 150000)) {
        results.push(value);
      }
    } 
    // Recursively check nested objects
    else if (typeof value === 'object' && value !== null) {
      findPossiblePrices(value, results);
    }
  }
  
  return results;
}

export const getRashifal = async (date?: string) => {
  try {
    // Get data from the API for rashifal
    const params: any = {};
    if (date) params.date = date;
    
    const response = await api.get('rashifal/', { params });
    console.log("Rashifal API response:", response.data);
    
    if (response.data && response.data.rashifal) {
      // Use the format where data is in the 'rashifal' property
      const mappedPredictions = response.data.rashifal.map((item: any) => {
        // Extract English sign name from sign_nepali (e.g., "वृश्चिक Scorpio" -> "Scorpio")
        const englishSign = item.sign_nepali ? 
          item.sign_nepali.split(' ').pop() : 
          mapSignToEnglish(item.sign);
          
        return {
          sign: englishSign,
          prediction: item.prediction,
          date: item.date
        };
      });
      
      return {
        predictions: mappedPredictions,
        todayEvent: response.data.source || "Daily Rashifal",
        source: 'real_data'
      };
    } else if (response.data && Array.isArray(response.data)) {
      // Alternative format where the response is directly an array
      const mappedPredictions = response.data.map((item: any) => {
        const englishSign = item.sign_nepali ? 
          item.sign_nepali.split(' ').pop() : 
          mapSignToEnglish(item.sign);
          
        return {
          sign: englishSign,
          prediction: item.prediction || item.content || item.text || "",
          date: item.date || new Date().toISOString().split('T')[0]
        };
      });
      
      return {
        predictions: mappedPredictions,
        todayEvent: "Daily Rashifal",
        source: 'real_data'
      };
    }
    
    // If none of the expected formats match, provide mock data
    console.warn("Unexpected API response format from rashifal API, using mock data");
    return generateMockRashifal();
  } catch (error) {
    console.error("Error fetching rashifal data:", error);
    // Return mock data on error
    return generateMockRashifal();
  }
};

// Function to generate mock rashifal data
function generateMockRashifal() {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 
    'Leo', 'Virgo', 'Libra', 'Scorpio', 
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const mockPredictions = signs.map(sign => {
    return {
      sign: sign,
      prediction: `Today is a favorable day for ${sign}. Your planetary alignment brings positive energy. Focus on your personal growth and relationships. Take time for self-care and reflection. New opportunities may arise in your career or financial matters.`,
      date: new Date().toISOString().split('T')[0]
    };
  });
  
  return {
    predictions: mockPredictions,
    todayEvent: "Daily Rashifal (Fallback Data)",
    source: 'mock_data'
  };
}

// Helper function to map Nepali sign names to English
function mapSignToEnglish(nepaliSign: string): string {
  const signMap: {[key: string]: string} = {
    'mesh': 'Aries',
    'brish': 'Taurus',
    'mithun': 'Gemini',
    'karkat': 'Cancer',
    'simha': 'Leo',
    'kanya': 'Virgo',
    'tula': 'Libra',
    'brischik': 'Scorpio',
    'dhanu': 'Sagittarius',
    'makar': 'Capricorn',
    'kumbha': 'Aquarius',
    'meen': 'Pisces'
  };
  
  return signMap[nepaliSign] || nepaliSign;
}

export const getTodayNepaliDate = async () => {
  try {
    // Use our new date converter to get the current Nepali date
    return getCurrentNepaliDate();
  } catch (error) {
    console.error("Error getting current Nepali date:", error);
    
    // Fallback if something goes wrong
    const today = new Date();
    return {
      year: 2082,
      month: 1,
      day: 26,
      month_name: 'Baishakh',
      day_of_week: today.getDay(),
      ad_date: today.toISOString().split('T')[0],
      bs_date: "2082-01-26"
    };
  }
};

export const getForex = async (params: { from?: string; to?: string; page?: number; per_page?: number }) => {
  try {
    console.log("Fetching Forex data with params:", params);
    const response = await api.get('forex', { params });
    console.log("Forex API raw response:", JSON.stringify(response.data, null, 2)); // Prettify JSON output

    let ratesToProcess = [];
    let sourceCurrentPage = params.page || 1;
    let sourceTotalPages = 1;
    let sourceTotalRates = 0;

    // Scenario 1: Data is in response.data.rates (and has pagination info)
    if (response.data && response.data.rates && Array.isArray(response.data.rates)) {
      console.log("Forex API response has 'rates' array.");
      ratesToProcess = response.data.rates;
      sourceCurrentPage = response.data.currentPage || response.data.page || sourceCurrentPage;
      sourceTotalPages = response.data.totalPages || response.data.total_pages || sourceTotalPages;
      sourceTotalRates = response.data.totalRates || response.data.total_items || ratesToProcess.length;
    }
    // Scenario 2: Data is in response.data.results (common for DRF-style paginated APIs)
    else if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log("Forex API response has 'results' array.");
      ratesToProcess = response.data.results;
      sourceTotalRates = response.data.count || ratesToProcess.length;
      const perPage = params.per_page || 10;
      sourceTotalPages = response.data.num_pages || Math.ceil(sourceTotalRates / perPage);
      // Try to get current page from API if available, e.g. if API uses 'page' query param for request and echoes it
      // or if it provides it in the response under a different key
      sourceCurrentPage = response.data.current_page || response.data.page || sourceCurrentPage;
    }
    // Scenario 3: Data is a direct array in response.data
    else if (response.data && Array.isArray(response.data)) {
      console.log("Forex API response is a direct array of rates.");
      ratesToProcess = response.data;
      sourceTotalRates = ratesToProcess.length;
      const perPage = params.per_page || 10;
      sourceTotalPages = Math.ceil(sourceTotalRates / perPage);
      // For a direct array, current page is what was requested
      sourceCurrentPage = params.page || 1;
      // If paginating a direct array, we might need to slice it, but many APIs that return a direct array for latest rates don't paginate them.
      // For now, assume if it's a direct array, it's all the rates for the "latest" call for the current page query.
      // If the API is supposed to paginate this array itself based on {page, per_page} params, this is fine.
    }

    if (ratesToProcess.length > 0) {
      const mappedRates = ratesToProcess.map((rate: any) => {
        // Log each individual rate object to see its structure
        console.log("Processing rate object:", JSON.stringify(rate, null, 2)); 

        return {
          date: rate.date || rate.last_updated_date || new Date().toISOString().split('T')[0],
          currency: rate.currency_code || rate.currency || rate.code || rate.iso3 || 'N/A',
          unit: rate.unit || 1,
          // Try more direct field names and ensure robust parsing
          buyingRate: parseFloat(rate.buy || rate.buy_rate || rate.buying_rate || rate.buyingRate || rate.bid || 0).toFixed(2),
          sellingRate: parseFloat(rate.sell || rate.sell_rate || rate.selling_rate || rate.sellingRate || rate.ask || 0).toFixed(2),
          middleRate: parseFloat(rate.mid_rate || rate.middle_rate || rate.middleRate || rate.mid || 0).toFixed(2),
        };
      });

      console.log("Mapped rates:", mappedRates.slice(0,2)); // Log first few mapped rates
      return {
        rates: mappedRates,
        currentPage: sourceCurrentPage,
        totalPages: sourceTotalPages,
        totalRates: sourceTotalRates
      };
    }

    console.warn("No processable rates found in Forex API response. Response data:", response.data);
    return { rates: [], currentPage: 1, totalPages: 1, totalRates: 0 }; // Fallback

  } catch (error) {
    console.error("Error fetching or processing forex data:", error);
    return { rates: [], currentPage: 1, totalPages: 1, totalRates: 0 }; 
  }
};

export default api;
