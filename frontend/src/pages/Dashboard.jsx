import React from 'react';
import { 
  Activity, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  CloudRain
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const healthData = [
    { time: '08:00', heartRate: 72, spo2: 98 },
    { time: '10:00', heartRate: 75, spo2: 97 },
    { time: '12:00', heartRate: 82, spo2: 96 },
    { time: '14:00', heartRate: 78, spo2: 97 },
    { time: '16:00', heartRate: 74, spo2: 98 },
  ];

  const qualityData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 88 },
    { day: 'Wed', score: 82 },
    { day: 'Thu', score: 90 },
    { day: 'Fri', score: 92 },
  ];

  const stats = [
    { label: 'Active Workers', value: '124', icon: <Activity className="text-primary" />, trend: '+12%' },
    { label: 'Avg Tea Quality', value: '88%', icon: <Leaf className="text-secondary" />, trend: '+5%' },
    { label: 'Pending Tasks', value: '18', icon: <CheckCircle2 className="text-success" />, trend: '-3%' },
    { label: 'System Alerts', value: '4', icon: <AlertTriangle className="text-danger" />, trend: 'High' },
  ];

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, Supervisor</h1>
          <p className="subtitle">Here's what's happening at the estate today.</p>
        </div>
        <div className="date-picker">
          April 13, 2026
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="bento-card stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-group">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-trend ${stat.trend.includes('High') ? 'danger' : ''}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bento-grid mt-20">
        <div className="bento-card col-span-8">
          <div className="card-header">
            <h3>Worker Health Monitoring (Live)</h3>
            <button className="view-all">View Workers</button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'var(--primary)' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="spo2" 
                  stroke="var(--secondary)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'var(--secondary)' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card col-span-4">
          <div className="card-header">
            <h3>Weather Insights</h3>
          </div>
          <div className="weather-widget">
            <div className="weather-main">
              <CloudRain className="weather-icon" size={48} />
              <div className="temp">
                <span className="degree">24°</span>
                <span className="condition">Light Rain</span>
              </div>
            </div>
            <div className="weather-details">
              <div className="detail">
                <span>Humidity</span>
                <span>82%</span>
              </div>
              <div className="detail">
                <span>Soil Moisture</span>
                <span>65%</span>
              </div>
            </div>
            <div className="weather-alert">
              <TrendingUp size={16} />
              <span>Perfect conditions for harvesting</span>
            </div>
          </div>
        </div>

        <div className="bento-card col-span-4">
          <div className="card-header">
            <h3>Tea Quality Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={qualityData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--primary)" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  strokeWidth={2}
                />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card col-span-8 alert-card">
          <div className="card-header">
            <h3 className="text-danger flex items-center gap-2">
              <AlertTriangle size={20} /> Urgent Health Alerts
            </h3>
          </div>
          <div className="alert-list">
            <div className="alert-item">
              <div className="user-blob">AK</div>
              <div className="alert-info">
                <strong>Anura Kumara</strong>
                <span>High Heart Rate (112 bpm) - Field B</span>
              </div>
              <button className="btn-small">Check Detail</button>
            </div>
            <div className="alert-item">
              <div className="user-blob warning">MS</div>
              <div className="alert-info">
                <strong>Maithripala Sirisena</strong>
                <span>Low SpO2 (94%) - Field A</span>
              </div>
              <button className="btn-small">Check Detail</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
