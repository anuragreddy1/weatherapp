const API_KEY = 'dcf428a35b51b285bbea3af873503f79'; // Replace with your real key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(city) {
  const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
  return data;
}

export async function getHistoricalWeather(lat, lon, timestamp) {
  const response = await fetch(`${BASE_URL}/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${API_KEY}`);
  const data = await response.json();
  return data;
}
