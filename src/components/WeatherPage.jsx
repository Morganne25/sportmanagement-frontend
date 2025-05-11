import { useState, useEffect } from 'react';
import './css/weather.css';
import Header from "./pageComponents/Header";


const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('eMalahleni');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const checkWeather = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    setIsLoading(true);
    try {
      const data = await getWeatherData(location, selectedDate);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Failed to get weather data');
    } finally {
      setIsLoading(false);
    }
  };

  // Weather data simulation (similar to original but simplified)
  const getWeatherData = async (location, dateString) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const date = new Date(dateString);
    const dayMod = date.getDate() % 10;
    const hour = date.getHours();
    const isNight = hour < 6 || hour > 18;

    // Simplified weather simulation
    const temp = 20 + dayMod;
    const weatherTypes = ['sunny', 'cloudy', 'rainy', 'thunderstorm'];
    const weatherType = weatherTypes[dayMod % 4];
    
    return {
      location,
      date: dateString,
      temp,
      weatherType,
      windSpeed: 10 + dayMod,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][dayMod % 8],
      humidity: 40 + dayMod * 3,
      advice: getWeatherAdvice(weatherType, temp)
    };
  };

  const getWeatherAdvice = (weatherType, temp) => {
    const adviceMap = {
      sunny: `It's sunny (${temp}°C) - perfect for outdoor activities!`,
      cloudy: `Cloudy skies (${temp}°C) - still good for most sports`,
      rainy: `Rain expected (${temp}°C) - bring waterproof gear`,
      thunderstorm: `Thunderstorms likely (${temp}°C) - consider indoor alternatives`
    };
    return adviceMap[weatherType] || "Weather conditions normal for the season";
  };

  const getWeatherIcon = (weatherType) => {
    const icons = {
      'sunny': 'fa-sun',
      'cloudy': 'fa-cloud',
      'rainy': 'fa-cloud-rain',
      'thunderstorm': 'fa-bolt'
    };
    return icons[weatherType] || 'fa-cloud';
  };

  return (
    <>
            <Header /> 
    <div className="weather-container">
      <h1><i className="fas fa-cloud-sun"></i> eMalahleni Weather Check</h1>
      
      <div className="weather-form">
        <div className="form-group">
          <label htmlFor="location">
            <i className="fas fa-map-marker-alt"></i> Location:
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled // Focusing just on eMalahleni
          />
        </div>

        <div className="form-group">
          <label htmlFor="weather-date">
            <i className="far fa-calendar-alt"></i> Date:
          </label>
          <input
            type="date"
            id="weather-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button
          className="weather-btn"
          onClick={checkWeather}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading"></span> Checking Weather...
            </>
          ) : (
            <>
              <i className="fas fa-cloud-sun"></i> Check Weather
            </>
          )}
        </button>
      </div>

      {weatherData && (
        <div className="weather-results">
          <div className={`weather-card ${weatherData.weatherType}`}>
            <div className="weather-header">
              <h2>
                <i className={`fas ${getWeatherIcon(weatherData.weatherType)}`}></i>
                {weatherData.location} Weather
              </h2>
              <p className="weather-date">
                {new Date(weatherData.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="weather-main">
              <div className="temperature">
                {weatherData.temp}°C
              </div>
              <div className="weather-details">
                <p>
                  <i className="fas fa-wind"></i> {weatherData.windDirection} {weatherData.windSpeed} km/h
                </p>
                <p>
                  <i className="fas fa-tint"></i> Humidity: {weatherData.humidity}%
                </p>
              </div>
            </div>

            <div className="weather-advice">
              <i className="fas fa-info-circle"></i> {weatherData.advice}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default WeatherPage;
 
