import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 16,
    condition: 'Partly Cloudy',
    location: 'San Francisco, CA',
    icon: '⛅',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Today', high: 18, low: 12, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tomorrow', high: 20, low: 14, condition: 'Sunny', icon: '☀️' },
      { day: 'Monday', high: 17, low: 11, condition: 'Cloudy', icon: '☁️' },
      { day: 'Tuesday', high: 19, low: 13, condition: 'Sunny', icon: '☀️' },
    ]
  });

  useEffect(() => {
    // Mock weather data - in production, you'd fetch from a weather API
    const updateWeather = () => {
      const temp = 14 + Math.floor(Math.random() * 8); // 14-22°C range
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
      const icons = ['☀️', '⛅', '☁️', '🌧️'];
      const randomCondition = Math.floor(Math.random() * conditions.length);
      
      setWeather(prev => ({
        ...prev,
        temperature: temp,
        condition: conditions[randomCondition],
        icon: icons[randomCondition],
        humidity: 50 + Math.floor(Math.random() * 30), // 50-80%
        windSpeed: 8 + Math.floor(Math.random() * 12) // 8-20 km/h
      }));
    };

    // Update weather every 5 minutes
    const interval = setInterval(updateWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>🌤️ Weather</h3>
        <span className="weather-location">{weather.location}</span>
      </div>
      
      <div className="weather-current">
        <div className="weather-main">
          <span className="weather-icon">{weather.icon}</span>
          <div className="weather-temp">
            <span className="temp-number">{weather.temperature}</span>
            <span className="temp-unit">°C</span>
          </div>
        </div>
        <div className="weather-condition">{weather.condition}</div>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weather.windSpeed} km/h</span>
        </div>
      </div>

      <div className="weather-forecast">
        {weather.forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <span className="forecast-day-name">{day.day}</span>
            <span className="forecast-icon">{day.icon}</span>
            <div className="forecast-temps">
              <span className="forecast-high">{day.high}°</span>
              <span className="forecast-low">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;