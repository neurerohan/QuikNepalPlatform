// Simple test script to verify API endpoints
import axios from 'axios';

const API_BASE_URL = "https://api.kalimatirate.nyure.com.np/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testEndpoints() {
  try {
    console.log('Testing vegetables endpoint...');
    const vegResponse = await api.get('vegetables/');
    console.log(`Vegetables endpoint status: ${vegResponse.status}`);
    console.log(`Vegetables data count: ${vegResponse.data.results?.length || 0}`);
    
    console.log('\nTesting metals endpoint...');
    const metalsResponse = await api.get('metals/');
    console.log(`Metals endpoint status: ${metalsResponse.status}`);
    console.log(`Metals data count: ${metalsResponse.data.results?.length || 0}`);
    
    console.log('\nTesting rashifal endpoint...');
    const rashifalResponse = await api.get('rashifal/');
    console.log(`Rashifal endpoint status: ${rashifalResponse.status}`);
    console.log(`Rashifal data available: ${!!rashifalResponse.data}`);
    
    console.log('\nTesting forex endpoint...');
    const forexResponse = await api.get('forex/');
    console.log(`Forex endpoint status: ${forexResponse.status}`);
    console.log(`Forex data count: ${forexResponse.data.results?.length || 0}`);
    
    console.log('\nAll API endpoints tested successfully!');
  } catch (error) {
    console.error('Error testing API endpoints:', error);
  }
}

testEndpoints();
