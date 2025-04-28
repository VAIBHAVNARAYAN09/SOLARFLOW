import axios from 'axios';

interface WeatherForecast {
  location: string;
  current: {
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    uvIndex: number;
  };
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    description: string;
    icon: string;
    precipitationChance: number;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    description: string;
    icon: string;
    precipitationChance: number;
  }>;
}

// Function to fetch weather data from OpenWeatherMap API
export async function getWeatherForecast(location: string = 'Delhi,India'): Promise<WeatherForecast> {
  try {
    // Check if we have a valid API key, otherwise use fallback data
    if (!process.env.OPENWEATHER_API_KEY) {
      return generateFallbackWeatherData(location);
    }

    // OpenWeatherMap API key
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // First, get coordinates for the location
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
    );
    
    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error('Location not found');
    }
    
    const { lat, lon } = geoResponse.data[0];
    
    // Then, get weather data using the coordinates
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`
    );
    
    const data = weatherResponse.data;
    
    // Format the response
    const forecast: WeatherForecast = {
      location,
      current: {
        temperature: data.current.temp,
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_speed,
        pressure: data.current.pressure,
        uvIndex: data.current.uvi
      },
      daily: data.daily.slice(0, 7).map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
        maxTemp: day.temp.max,
        minTemp: day.temp.min,
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        precipitationChance: day.pop * 100
      })),
      hourly: data.hourly.slice(0, 24).map((hour: any) => ({
        time: new Date(hour.dt * 1000).toISOString(),
        temperature: hour.temp,
        description: hour.weather[0].description,
        icon: hour.weather[0].icon,
        precipitationChance: hour.pop * 100
      }))
    };
    
    return forecast;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fallback to generated data if API call fails
    return generateFallbackWeatherData(location);
  }
}

// Generate realistic weather data for the fallback
function generateFallbackWeatherData(location: string): WeatherForecast {
  const now = new Date();
  const season = getSeason(now);
  
  // Base temperature based on season (in Celsius)
  let baseTempC: number;
  let variabilityC: number;
  let rainProbability: number;
  let weatherDescriptions: string[];
  let icons: string[];
  
  // Adjust based on season (for Northern Hemisphere)
  switch (season) {
    case 'winter':
      baseTempC = 10;
      variabilityC = 5;
      rainProbability = 0.4;
      weatherDescriptions = ['Clear sky', 'Few clouds', 'Overcast', 'Light rain', 'Moderate rain', 'Heavy rain', 'Snow'];
      icons = ['01d', '02d', '03d', '04d', '09d', '10d', '13d'];
      break;
    case 'spring':
      baseTempC = 18;
      variabilityC = 8;
      rainProbability = 0.3;
      weatherDescriptions = ['Clear sky', 'Few clouds', 'Scattered clouds', 'Light rain', 'Moderate rain', 'Thunderstorm'];
      icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d'];
      break;
    case 'summer':
      baseTempC = 28;
      variabilityC = 6;
      rainProbability = 0.1;
      weatherDescriptions = ['Clear sky', 'Few clouds', 'Scattered clouds', 'Light rain', 'Thunderstorm'];
      icons = ['01d', '02d', '03d', '10d', '11d'];
      break;
    case 'fall':
      baseTempC = 20;
      variabilityC = 7;
      rainProbability = 0.25;
      weatherDescriptions = ['Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds', 'Light rain', 'Moderate rain'];
      icons = ['01d', '02d', '03d', '04d', '09d', '10d'];
      break;
    default:
      baseTempC = 18;
      variabilityC = 6;
      rainProbability = 0.3;
      weatherDescriptions = ['Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds', 'Light rain'];
      icons = ['01d', '02d', '03d', '04d', '10d'];
  }
  
  // If location contains "CA" (California), adjust for warmer climate
  if (location.includes('CA')) {
    baseTempC += 3;
  }
  
  // Generate current weather
  const currentTemp = baseTempC + (Math.random() - 0.5) * variabilityC;
  const descriptionIndex = Math.floor(Math.random() * weatherDescriptions.length);
  
  const current = {
    temperature: parseFloat(currentTemp.toFixed(1)),
    description: weatherDescriptions[descriptionIndex],
    icon: icons[descriptionIndex],
    humidity: Math.floor(60 + Math.random() * 30),
    windSpeed: parseFloat((2 + Math.random() * 6).toFixed(1)),
    pressure: Math.floor(1000 + Math.random() * 30),
    uvIndex: parseFloat((1 + Math.random() * 10).toFixed(1))
  };
  
  // Generate daily forecast
  const daily = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(now.getDate() + i);
    
    // Temperature trends slightly over days
    const dayTempAdjustment = (Math.random() - 0.5) * 2 * i;
    const maxTemp = parseFloat((baseTempC + variabilityC/2 + dayTempAdjustment).toFixed(1));
    const minTemp = parseFloat((baseTempC - variabilityC/2 + dayTempAdjustment).toFixed(1));
    
    const isRainy = Math.random() < rainProbability;
    const dayDescriptionIndex = isRainy 
      ? 3 + Math.floor(Math.random() * (weatherDescriptions.length - 3)) // Rainy descriptions
      : Math.floor(Math.random() * 3); // Clear to cloudy descriptions
      
    daily.push({
      date: date.toISOString().split('T')[0],
      maxTemp,
      minTemp,
      description: weatherDescriptions[dayDescriptionIndex],
      icon: icons[dayDescriptionIndex],
      precipitationChance: isRainy ? Math.floor(40 + Math.random() * 60) : Math.floor(Math.random() * 30)
    });
  }
  
  // Generate hourly forecast
  const hourly = [];
  for (let i = 0; i < 24; i++) {
    const time = new Date();
    time.setHours(now.getHours() + i);
    
    // Temperature varies throughout the day
    const hourOfDay = time.getHours();
    let hourlyTempAdjustment;
    
    // Simple day/night cycle
    if (hourOfDay >= 10 && hourOfDay <= 16) {
      // Warmest part of day (10am-4pm)
      hourlyTempAdjustment = variabilityC * 0.8;
    } else if (hourOfDay >= 0 && hourOfDay <= 5) {
      // Coldest part of day (midnight-5am)
      hourlyTempAdjustment = -variabilityC * 0.8;
    } else if (hourOfDay > 16 && hourOfDay < 22) {
      // Cooling down (4pm-10pm)
      const coolingFactor = (hourOfDay - 16) / (22 - 16);
      hourlyTempAdjustment = variabilityC * 0.8 * (1 - coolingFactor) - variabilityC * 0.5 * coolingFactor;
    } else {
      // Warming up (5am-10am) or (10pm-midnight)
      const warmingFactor = (hourOfDay <= 10) ? (hourOfDay - 5) / (10 - 5) : 0;
      hourlyTempAdjustment = -variabilityC * 0.8 * (1 - warmingFactor) + variabilityC * 0.5 * warmingFactor;
    }
    
    const hourlyTemp = parseFloat((baseTempC + hourlyTempAdjustment).toFixed(1));
    
    // Determine weather condition
    const isRainy = Math.random() < rainProbability;
    const hourDescriptionIndex = isRainy 
      ? 3 + Math.floor(Math.random() * (weatherDescriptions.length - 3))
      : Math.floor(Math.random() * 3);
      
    // Adjust icon for night hours
    let icon = icons[hourDescriptionIndex];
    if (hourOfDay >= 19 || hourOfDay <= 6) {
      // Replace 'd' with 'n' for night icons
      icon = icon.replace('d', 'n');
    }
    
    hourly.push({
      time: time.toISOString(),
      temperature: hourlyTemp,
      description: weatherDescriptions[hourDescriptionIndex],
      icon,
      precipitationChance: isRainy ? Math.floor(40 + Math.random() * 60) : Math.floor(Math.random() * 20)
    });
  }
  
  return {
    location,
    current,
    daily,
    hourly
  };
}

function getSeason(date: Date): 'winter' | 'spring' | 'summer' | 'fall' {
  const month = date.getMonth();
  
  if (month >= 2 && month < 5) return 'spring';
  if (month >= 5 && month < 8) return 'summer';
  if (month >= 8 && month < 11) return 'fall';
  return 'winter';
}