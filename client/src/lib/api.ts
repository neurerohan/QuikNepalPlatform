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
    const response = await api.get('metals/');
    // Transform the metals data to the format our components expect
    if (response.data && response.data.results) {
      const metals = response.data.results;
      const goldItems = metals.filter((item: any) => item.metal === 'gold');
      const silverItems = metals.filter((item: any) => item.metal === 'silver');
      
      return {
        gold: {
          fineGold: goldItems.find((item: any) => item.metal_type === 'fine' && item.unit === 'tola')?.price || '0',
          standardGold: goldItems.find((item: any) => item.metal_type === 'hallmark' && item.unit === 'tola')?.price || '0'
        },
        silver: {
          standardSilver: silverItems.find((item: any) => item.unit === 'tola')?.price || '0'
        },
        source: 'real_data'
      };
    }
    console.error("Unexpected API response format from metals API");
    throw new Error("Invalid API response format");
  } catch (error) {
    console.error("Error fetching metals data:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

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
    console.log("Forex API raw response:", response.data);

    // Ideal structure: { rates: [], currentPage: 1, totalPages: 5, totalRates: 50 }
    // Check for common structures and adapt
    if (response.data && response.data.rates && Array.isArray(response.data.rates)) {
      // Structure is already { rates: [...], ... }
      console.log("Forex API response matches expected structure.");
      return {
        rates: response.data.rates.map((rate: any) => ({ // Ensure rates are mapped to expected DataTable structure
          date: rate.date || new Date().toISOString().split('T')[0],
          currency: rate.currency_code || rate.currency || rate.code, // Common variations for currency code
          unit: rate.unit || 1,
          buyingRate: parseFloat(rate.buy_rate || rate.buying_rate || rate.buyingRate || 0).toFixed(2),
          sellingRate: parseFloat(rate.sell_rate || rate.selling_rate || rate.sellingRate || 0).toFixed(2),
          middleRate: parseFloat(rate.middle_rate || rate.middleRate || 0).toFixed(2),
        })),
        currentPage: response.data.currentPage || response.data.page || params.page || 1,
        totalPages: response.data.totalPages || response.data.total_pages || 1, 
        totalRates: response.data.totalRates || response.data.total_items || response.data.rates.length
      };
    } else if (response.data && Array.isArray(response.data)) {
      // Structure is directly an array of rates: [ {rate1}, {rate2} ]
      console.log("Forex API response is a direct array of rates. Adapting...");
      const perPage = params.per_page || 10;
      const page = params.page || 1;
      const totalRates = response.data.length;
      const totalPages = Math.ceil(totalRates / perPage);
      const paginatedRates = response.data.slice((page - 1) * perPage, page * perPage);

      return {
        rates: paginatedRates.map((rate: any) => ({
          date: rate.date || new Date().toISOString().split('T')[0],
          currency: rate.currency_code || rate.currency || rate.code,
          unit: rate.unit || 1,
          buyingRate: parseFloat(rate.buy_rate || rate.buying_rate || rate.buyingRate || 0).toFixed(2),
          sellingRate: parseFloat(rate.sell_rate || rate.selling_rate || rate.sellingRate || 0).toFixed(2),
          middleRate: parseFloat(rate.middle_rate || rate.middleRate || 0).toFixed(2),
        })),
        currentPage: page,
        totalPages: totalPages,
        totalRates: totalRates
      };
    } else if (response.data && response.data.results && Array.isArray(response.data.results)){
      // Structure is { results: [...], count: N, next: ..., previous: ...}
      console.log("Forex API response has 'results' array. Adapting...");
      const perPage = params.per_page || 10;
      const totalRates = response.data.count || response.data.results.length;
      const totalPages = response.data.num_pages || Math.ceil(totalRates / perPage);
      const currentPage = params.page || 1; // API might not provide current page in this structure
      
      return {
        rates: response.data.results.map((rate: any) => ({
          date: rate.date || new Date().toISOString().split('T')[0],
          currency: rate.currency_code || rate.currency || rate.code,
          unit: rate.unit || 1,
          buyingRate: parseFloat(rate.buy_rate || rate.buying_rate || rate.buyingRate || 0).toFixed(2),
          sellingRate: parseFloat(rate.sell_rate || rate.selling_rate || rate.sellingRate || 0).toFixed(2),
          middleRate: parseFloat(rate.middle_rate || rate.middleRate || 0).toFixed(2),
        })),
        currentPage: currentPage,
        totalPages: totalPages,
        totalRates: totalRates
      };
    }

    console.warn("Unexpected Forex API response format. Returning empty rates.", response.data);
    return { rates: [], currentPage: 1, totalPages: 1, totalRates: 0 }; // Fallback

  } catch (error) {
    console.error("Error fetching or processing forex data:", error);
    // Return an empty state that matches the expected structure to prevent component errors
    return { rates: [], currentPage: 1, totalPages: 1, totalRates: 0 }; 
  }
};

export default api;
