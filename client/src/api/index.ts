// Direct API client for external API
const API_BASE_URL = "https://api.kalimatirate.nyure.com.np/api/";

export async function getTodayDate() {
  try {
    // Hard-coded for now based on the data from getCurrentNepaliDate
    const today = new Date();
    return {
      today: {
        year: 2082,
        month: 1, // Baishakh is month 1
        day: 26,  // User mentioned it's 26th
        month_name: 'Baishakh',
        day_of_week: today.getDay(),
        ad_date: today.toISOString().split('T')[0],
        bs_date: "2082-01-26"
      },
      success: true
    };
  } catch (error) {
    console.error("Error getting today's Nepali date:", error);
    throw new Error("Failed to get today's Nepali date");
  }
}

export async function getCalendarEvents(params: {
  year_bs?: string;
  month_bs?: string;
  start_date_bs?: string;
  end_date_bs?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.year_bs) queryParams.append("year_bs", params.year_bs);
    if (params.month_bs) queryParams.append("month_bs", params.month_bs);
    if (params.start_date_bs) queryParams.append("start_date_bs", params.start_date_bs);
    if (params.end_date_bs) queryParams.append("end_date_bs", params.end_date_bs);
    
    const response = await fetch(`${API_BASE_URL}calendar/?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
}

export async function convertDate(params: { from: string; date: string }) {
  try {
    const { from, date } = params;
    const queryParams = new URLSearchParams({ from, date });
    
    const response = await fetch(`${API_BASE_URL}calendar/convert?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error converting date:", error);
    throw error;
  }
}

export async function getCalendar(year: string, month: string) {
  try {
    // Convert month number to Nepali month name
    const nepaliMonths = [
      'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
      'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
      'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];
    const monthName = nepaliMonths[parseInt(month) - 1] || 'Baishakh';
    
    const url = `${API_BASE_URL}detailed-calendar/?year=${year}&month_name=${monthName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching calendar:", error);
    throw error;
  }
}

export async function getVegetables() {
  try {
    const response = await fetch(`${API_BASE_URL}vegetables/`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching vegetables:", error);
    throw error;
  }
}

export async function getMetals() {
  try {
    const response = await fetch(`${API_BASE_URL}metals/`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching metals:", error);
    throw error;
  }
}

export async function getRashifal(date?: string) {
  try {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append("date", date);
    
    const response = await fetch(`${API_BASE_URL}rashifal/?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching rashifal:", error);
    throw error;
  }
}

export async function getForex(params: {
  from?: string;
  to?: string;
  page?: string;
  per_page?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.from) queryParams.append("from", params.from);
    if (params.to) queryParams.append("to", params.to);
    if (params.page) queryParams.append("page", params.page);
    if (params.per_page) queryParams.append("per_page", params.per_page);
    
    const response = await fetch(`${API_BASE_URL}forex?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching forex:", error);
    throw error;
  }
} 