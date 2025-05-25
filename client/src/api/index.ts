// API endpoints with fallback support
const PRIMARY_API = "https://api.quiknepal.com";
const FALLBACK_API = "https://rohan-api.up.railway.app";

async function fetchWithFallback(endpoint: string) {
  try {
    const response = await fetch(`${PRIMARY_API}${endpoint}`);
    if (response.ok) return response;
    
    // Try fallback if primary fails
    const fallbackResponse = await fetch(`${FALLBACK_API}${endpoint}`);
    if (fallbackResponse.ok) return fallbackResponse;
    
    throw new Error(`Failed to fetch from both primary and fallback APIs`);
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

export async function getTodayDate() {
  try {
    const response = await fetchWithFallback('/today');
    return await response.json();
  } catch (error) {
    console.error("Error getting today's Nepali date:", error);
    throw error;
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
    
    const response = await fetchWithFallback(`/calendar/events?${queryParams.toString()}`);
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
    
    const response = await fetchWithFallback(`/calendar/convert?${queryParams.toString()}`);
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
    const response = await fetchWithFallback(`/calendar/${year}/${month}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching calendar:", error);
    throw error;
  }
}

export async function getVegetables() {
  try {
    const response = await fetchWithFallback('/prices/vegetables');
    return await response.json();
  } catch (error) {
    console.error("Error fetching vegetables:", error);
    throw error;
  }
}

export async function getMetals() {
  try {
    const response = await fetchWithFallback('/prices/metals');
    return await response.json();
  } catch (error) {
    console.error("Error fetching metals:", error);
    throw error;
  }
}

export async function getRashifal(sign: string) {
  try {
    const response = await fetchWithFallback(`/rashifal/${sign}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching rashifal:", error);
    throw error;
  }
}

export async function getForex() {
  try {
    const response = await fetchWithFallback('/prices/forex');
    return await response.json();
  } catch (error) {
    console.error("Error fetching forex:", error);
    throw error;
  }
}