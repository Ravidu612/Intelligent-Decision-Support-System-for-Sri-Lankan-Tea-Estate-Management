import React from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  CloudLightning,
  Calendar,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import './Weather.css';

const Weather = () => {
  const forecastData = [
    { day: 'Mon', temp: 24, humidity: 82 },
    { day: 'Tue', temp: 26, humidity: 75 },
    { day: 'Wed', temp: 22, humidity: 90 },
    { day: 'Thu', temp: 25, humidity: 80 },
    { day: 'Fri', temp: 27, humidity: 70 },
    { day: 'Sat', temp: 28, humidity: 65 },
    { day: 'Sun', temp: 23, humidity: 85 },
  ];

  return (
    <div className="weather-page fade-in">
      <header className="page-header">
        <div>
          <h1>Weather & Climate</h1>
          <p className="subtitle">Hyper-local climate monitoring for tea growth optimization.</p>
        </div>
      </header>

      <div className="weather-grid-layout">
        <div className="current-weather-box bento-card">
          <div className="weather-now">
            <div className="now-main">
              <div className="now-icon"><CloudRain size={64} /></div>
              <div className="now-temp">
                <h2>24°C</h2>
                <span>Light Rain & Drizzle</span>
              </div>
            </div>
            <div className="now-meta">
              <span>Block B • Estate North</span>
              <span>Updated: 2 mins ago</span>
            </div>
          </div>
          <div className="weather-stats-grid">
            <div className="w-stat">
              <Droplets size={20} className="text-secondary" />
              <div>
                <span>Humidity</span>
                <strong>82%</strong>
              </div>
            </div>
            <div className="w-stat">
              <Wind size={20} className="text-primary" />
              <div>
                <span>Wind Speed</span>
                <strong>12 km/h</strong>
              </div>
            </div>
            <div className="w-stat">
              <Thermometer size={20} className="text-danger" />
              <div>
                <span>Soil Temp</span>
                <strong>21.5°C</strong>
              </div>
            </div>
            <div className="w-stat">
              <Sun size={20} className="text-warning" />
              <div>
                <span>UV Index</span>
                <strong>Low (2.4)</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="impact-box bento-card">
          <div className="card-header">
            <h3>Tea Growth Impact</h3>
          </div>
          <div className="impact-content">
            <div className="impact-item">
              <Info size={20} className="text-primary" />
              <p>High soil moisture is ideal for root development in <strong>Block B</strong>.</p>
            </div>
            <div className="impact-item warning">
              <Info size={20} className="text-warning" />
              <p>Reduced sunlight may delay withering process by <strong>~2 hours</strong>.</p>
            </div>
            <button className="btn-primary mt-20">View Action Plan</button>
          </div>
        </div>

        <div className="forecast-chart-box bento-card">
          <div className="card-header">
            <h3>7-Day Temperature Forecast</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                  formatter={(value) => [`${value}°C`, 'Temperature']}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="var(--primary)" 
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--primary)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pollen-box bento-card">
          <div className="card-header">
            <h3>Soil Moisture Forecast</h3>
          </div>
          <div className="forecast-daily">
            {['Mon', 'Tue', 'Wed', 'Thu'].map(day => (
              <div key={day} className="daily-item">
                <span className="day-name">{day}</span>
                <span className="day-value">65%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
