'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };
  return weatherCodes[code] || 'Unknown';
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌧️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 75) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

export default function WeatherWidget({ latitude = 40.7128, longitude = -74.006 }: { latitude?: number; longitude?: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [latitude, longitude]);

  if (loading) return <div className="weather-widget loading">Loading weather...</div>;
  if (error) return <div className="weather-widget error">Weather unavailable</div>;
  if (!weather) return null;

  return (
    <div className="weather-widget">
      <span className="weather-emoji">{getWeatherEmoji(weather.weathercode)}</span>
      <span className="weather-temp">{Math.round(weather.temperature)}°C</span>
      <span className="weather-desc">{getWeatherDescription(weather.weathercode)}</span>
      <span className="weather-wind">Wind: {weather.windspeed} km/h</span>
    </div>
  );
}
