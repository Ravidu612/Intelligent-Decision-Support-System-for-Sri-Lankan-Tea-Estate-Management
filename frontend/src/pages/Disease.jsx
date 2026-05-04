import React, { useState, useEffect, useMemo } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  ShieldCheck, 
  Microscope, 
  AlertTriangle,
  TrendingUp,
  Activity,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import axios from 'axios';
import './Disease.css';

const Disease = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: Idle, 1: Verifying, 2: Health Check, 3: Full Analysis
  const [result, setResult] = useState(null);
  const [displayResult, setDisplayResult] = useState(null); // The step-by-step result shown in UI
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);

  // 1. Load from LocalStorage on first boot
  useEffect(() => {
    const savedHistory = localStorage.getItem('tea_disease_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    fetchHistory();
  }, []);

  // 2. Persist to LocalStorage whenever history changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('tea_disease_history', JSON.stringify(history));
    }
  }, [history]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5001/api/disease/history");
      if (res.data.success && res.data.data.length > 0) {
        // Merge server data with local data, avoiding duplicates by ID
        setHistory(prev => {
          const serverData = res.data.data;
          const combined = [...serverData, ...prev];
          const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
          return unique.slice(0, 15); // Keep last 15
        });
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };


  // --- ANALYTICS DATA ---
  const stats = useMemo(() => {
    const total = history.length;
    const diseased = history.filter(h => !h.isHealthy).length;
    const healthRate = total > 0 ? ((total - diseased) / total * 100).toFixed(1) : 0;
    
    // Disease Colors Mapping
    const DISEASE_COLORS = {
      "Blister Blight": "#FF5252",  // Red
      "Grey Blight": "#78909C",     // Grey-Blue
      "Red Rust": "#FF7043",        // Orange-Rust
      "Anthracnose": "#5D4037",      // Brown
      "Algal Leaf": "#009688",      // Teal/Green
      "Bird Eye Spot": "#FBC02D",   // Yellow
      "Default": "#2E7D32"          // Green
    };

    // Disease Distribution
    const counts = {};
    history.forEach(h => {
      if (!h.isHealthy && h.disease && h.disease !== 'None') {
        counts[h.disease] = (counts[h.disease] || 0) + 1;
      }
    });
    
    const pieData = Object.entries(counts).map(([name, value]) => ({ 
      name, 
      value,
      color: DISEASE_COLORS[name] || DISEASE_COLORS["Default"]
    }));
    
    // Trend Data (Last 7 days mock if empty)

    const trendData = [
      { day: 'Mon', count: 4 },
      { day: 'Tue', count: 7 },
      { day: 'Wed', count: 5 },
      { day: 'Thu', count: 9 },
      { day: 'Fri', count: 12 },
      { day: 'Sat', count: 8 },
      { day: 'Sun', count: 15 },
    ];

    return { total, diseased, healthRate, pieData, trendData };
  }, [history]);

  const handleSelectHistory = (item) => {
    if (item.isHealthy) {
      setDisplayResult({ ...item, healthy: true, step: 2 });
      setActiveStep(2);
    } else {
      setDisplayResult({ ...item, step: 3 });
      setActiveStep(3);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setDisplayResult(null);
    setActiveStep(0);
  };

  const runWalkthrough = async (data) => {
    setActiveStep(1);
    await new Promise(r => setTimeout(r, 1000));
    
    if (!data.isLeaf) {
      setDisplayResult({ ...data, step: 1, failed: true });
      return;
    }
    
    setActiveStep(2);
    await new Promise(r => setTimeout(r, 1000));
    
    if (data.isHealthy) {
      setDisplayResult({ ...data, step: 2, healthy: true });
      return;
    }

    setActiveStep(3);
    await new Promise(r => setTimeout(r, 1000));
    setDisplayResult({ ...data, step: 3 });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5001/api/disease",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        const newRecord = res.data.data;
        setResult(newRecord);
        setIsUploading(false);
        runWalkthrough(newRecord);
        
        setHistory(prev => [newRecord, ...prev].slice(0, 10));
      }

    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      alert("Analysis failed. Ensure services are running.");
    }
  };

  return (
    <div className="disease-page fade-in">
      <header className="page-header">
        <div>
          <h1>Leaf Disease Analytics</h1>
          <p className="subtitle">Real-time AI monitoring and health distribution</p>
        </div>
      </header>

      {/* --- STATS ROW --- */}
      <div className="stats-row">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="stat-card">
          <div className="stat-icon"><Activity size={24} /></div>
          <div className="stat-info">
            <span>Total Scans</span>
            <h3>{stats.total}</h3>
          </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="stat-icon warning"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <span>Diseased Detected</span>
            <h3>{stats.diseased}</h3>
          </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="stat-icon success"><ShieldCheck size={24} /></div>
          <div className="stat-info">
            <span>Health Score</span>
            <h3>{stats.healthRate}%</h3>
          </div>
        </motion.div>
      </div>

      <div className="disease-grid-main">
        {/* --- LEFT: MAIN PIPELINE --- */}
        <div className="pipeline-container">
          <div className="bento-card analysis-card">
            <div className="card-header">
              <h3>{activeStep > 0 ? 'AI Pipeline Processing' : 'Start New Analysis'}</h3>
            </div>

            <AnimatePresence mode="wait">
              {activeStep === 0 && !isUploading && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="upload-zone-compact" 
                  onClick={() => document.getElementById('leaf-upload').click()}
                >
                    <Upload size={40} className="text-muted" />
                    <p>{selectedFile ? `File: ${selectedFile.name}` : "Drop tea leaf image here"}</p>
                    <input type="file" id="leaf-upload" hidden onChange={handleFileChange} accept="image/*" />
                    <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handleUpload(); }} disabled={!selectedFile}>
                      Run AI Pipeline
                    </button>
                </motion.div>
              )}

              {isUploading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loader-box-mini">
                  <div className="scanner"></div>
                  <p>Processing Image...</p>
                </motion.div>
              )}

              {activeStep > 0 && (
                <motion.div key="walkthrough" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="walkthrough-active">
                  <div className="pipeline-stepper-mini">
                    {[
                      { id: 1, icon: <Search size={14}/> },
                      { id: 2, icon: <ShieldCheck size={14}/> },
                      { id: 3, icon: <Microscope size={14}/> }
                    ].map(s => (
                      <div key={s.id} className={`step-dot ${activeStep >= s.id ? 'active' : ''} ${displayResult?.failed && s.id === 1 ? 'failed' : ''}`}>
                        {s.icon}
                      </div>
                    ))}
                  </div>

                  <div className="step-result-area">
                    {activeStep === 1 && !displayResult?.failed && <div className="loading-state">Identifying species...</div>}
                    
                    {displayResult?.failed && (
                       <div className="result-fail">
                          <AlertTriangle size={32} />
                          <h4>Invalid Image</h4>
                          <button className="btn-secondary btn-sm" onClick={() => setActiveStep(0)}>Retry</button>
                       </div>
                    )}

                    {displayResult?.healthy && (
                       <div className="result-pass">
                          <CheckCircle2 size={32} className="text-success" />
                          <h4>Healthy Sample</h4>
                          <button className="btn-secondary btn-sm" onClick={() => setActiveStep(0)}>New Scan</button>
                       </div>
                    )}

                    {displayResult?.step === 3 && (
                      <div className="final-report-compact">
                         <div className={`report-badge ${displayResult.severity?.toLowerCase()}`}>{displayResult.severity}</div>
                         <h2>{displayResult.disease}</h2>
                         <p className="conf">AI Confidence: {parseFloat(displayResult.confidence).toFixed(1)}%</p>
                         
                         <div className="treatment-tabs">
                            <div className="t-box">
                               <strong>🧪 Chemical</strong>
                               <p>{displayResult.treatmentChemical}</p>
                            </div>
                            <div className="t-box">
                               <strong>leaf Organic</strong>
                               <p>{displayResult.treatmentOrganic}</p>
                            </div>
                            <div className="t-box">
                               <strong>🛡️ Prevention</strong>
                               <p>{displayResult.treatmentPrevention}</p>
                            </div>
                         </div>

                         <div className="report-btns mt-20">
                            <button className="btn-secondary btn-sm" onClick={() => setActiveStep(0)}>New Scan</button>
                            <button className="btn-primary btn-sm">Export Report</button>
                         </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- CHARTS ROW --- */}
          <div className="charts-row">
            <div className="bento-card chart-card">
              <div className="card-header">
                <PieIcon size={16} />
                <h3>Disease Split</h3>
              </div>
              <div className="chart-box">
                {stats.pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie 
                        data={stats.pieData} 
                        innerRadius={40} 
                        outerRadius={60} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {stats.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>

                  </ResponsiveContainer>
                ) : <p className="no-data">No disease data</p>}
              </div>
            </div>

            <div className="bento-card chart-card">
              <div className="card-header">
                <TrendingUp size={16} />
                <h3>Daily Detections</h3>
              </div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={stats.trendData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#2E7D32" fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: HISTORY --- */}
        <div className="history-column">
          <div className="bento-card history-card-full">
            <div className="card-header">
              <History size={18} />
              <h3>Scan History</h3>
            </div>
            <div className="history-list-scroll">
              {history.map(item => (
                <div 
                  key={item._id} 
                  className={`history-item-mini clickable ${item.isHealthy ? 'healthy' : 'diseased'}`}
                  onClick={() => handleSelectHistory(item)}
                >
                  <div className="hist-meta">
                    <span className="id">#{item._id.slice(-4).toUpperCase()}</span>
                    <span className="date">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="hist-main">
                    <span className="diag">{item.isHealthy ? 'Healthy' : item.disease}</span>
                    <span className="sev">{item.severity !== 'None' ? item.severity : '-'}</span>
                  </div>
                </div>
              ))}
              {history.length === 0 && <p className="empty">No history</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disease;
