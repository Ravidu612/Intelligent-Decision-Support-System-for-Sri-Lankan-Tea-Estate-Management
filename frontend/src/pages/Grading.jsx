import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Trash2, 
  Download, 
  Plus, 
  BarChart3, 
  PieChart as PieIcon, 
  FileText, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  History,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import './Grading.css';

const GRADE_COLORS = {
  "PF": "#8E44AD",
  "DUST": "#7F8C8D",
  "BOP": "#2980B9",
  "Pekoe": "#27AE60",
  "BM": "#D35400",
  "BP": "#E67E22",
  "BROKEN_TEA": "#C0392B",
  "FANNING_2": "#16A085",
  "PW_DUST": "#F1C40F",
  "Default": "#2E7D32"
};

const Grading = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [batch, setBatch] = useState(() => {
    const saved = localStorage.getItem('tea_grading_batch');
    return saved ? JSON.parse(saved) : [];
  });

  // Save batch to localstorage
  useEffect(() => {
    localStorage.setItem('tea_grading_batch', JSON.stringify(batch));
  }, [batch]);

  // Analytics for Stats
  const stats = useMemo(() => {
    const total = batch.length;
    const aGrade = batch.filter(b => b.quality === 'A').length;
    const avgConf = total > 0 ? (batch.reduce((acc, b) => acc + parseFloat(b.confidence), 0) / total).toFixed(1) : 0;
    
    const counts = {};
    batch.forEach(b => {
      counts[b.grade] = (counts[b.grade] || 0) + 1;
    });

    const pieData = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: GRADE_COLORS[name] || GRADE_COLORS["Default"]
    }));

    return { total, aGrade, avgConf, pieData };
  }, [batch]);

  const getQualityGrade = (confidence) => {
    if (confidence > 90) return 'A';
    if (confidence > 80) return 'B';
    return 'C';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post('http://127.0.0.1:5001/api/tea/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.grade === "Invalid Image") {
        setError("Invalid Image / Not Tea Sample");
      } else {
        const quality = getQualityGrade(res.data.confidence);
        setResult({ ...res.data, quality });
      }
    } catch (err) {
      setError("Service connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const addToBatch = () => {
    if (!result) return;
    const entry = {
      id: Date.now(),
      fileName: selectedFile?.name || "Sample",
      grade: result.grade,
      quality: result.quality,
      confidence: parseFloat(result.confidence).toFixed(1)
    };
    setBatch(prev => [entry, ...prev].slice(0, 20));
    setResult(null);
    setPreview(null);
    setSelectedFile(null);
  };

  const downloadCSV = () => {
    const header = "Image Name, Grade, Quality, Confidence\n";
    const rows = batch.map(b => `${b.fileName}, ${b.grade}, ${b.quality}, ${b.confidence}%`).join("\n");
    saveAs(new Blob([header + rows], { type: 'text/csv' }), "Tea_Grading_Report.csv");
  };

  const chartData = result?.all_probabilities ? 
    Object.entries(result.all_probabilities).map(([name, value]) => ({
      name,
      value: parseFloat((value * 100).toFixed(2)),
      color: GRADE_COLORS[name] || GRADE_COLORS["Default"]
    })).sort((a, b) => b.value - a.value) : [];

  return (
    <div className="grading-page-hf fade-in">
      <header className="page-header">
        <div>
          <h1>Tea Sorting & Grading</h1>
          <p className="subtitle">AI-powered quality classification and batch analytics</p>
        </div>
      </header>

      {/* --- STATS ROW --- */}
      <div className="stats-row">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="stat-card">
          <div className="stat-icon"><Activity size={24} /></div>
          <div className="stat-info">
            <span>Processed Samples</span>
            <h3>{stats.total}</h3>
          </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="stat-icon warning"><Award size={24} /></div>
          <div className="stat-info">
            <span>Premium (A-Grade)</span>
            <h3>{stats.aGrade}</h3>
          </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="stat-icon success"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <span>Avg Confidence</span>
            <h3>{stats.avgConf}%</h3>
          </div>
        </motion.div>
      </div>

      <div className="disease-grid-main">
        {/* --- LEFT: ANALYSIS --- */}
        <div className="pipeline-container">
          <div className="bento-card analysis-card">
             <div className="card-header">
                <h3>{loading ? 'AI Engine Working...' : 'Quality Inspection'}</h3>
             </div>
             
             <AnimatePresence mode="wait">
                {!result && !loading && (
                   <motion.div key="u" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="upload-zone-compact" onClick={() => document.getElementById('g-up').click()}>
                      <Upload size={40} className="text-muted" />
                      <p>{selectedFile ? selectedFile.name : "Drop tea sample here"}</p>
                      <input type="file" id="g-up" hidden onChange={handleFileChange} />
                      <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handlePredict(); }} disabled={!selectedFile}>Start Grading</button>
                   </motion.div>
                )}

                {loading && (
                   <div className="loader-box-mini">
                      <div className="scanner"></div>
                      <p>Evaluating tea patterns...</p>
                   </div>
                )}

                {result && (
                   <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="final-report-compact">
                      <div className={`report-badge ${result.quality?.toLowerCase()}`}>Quality {result.quality}</div>
                      <h2>{result.grade}</h2>
                      <p className="conf">AI Confidence: {parseFloat(result.confidence).toFixed(1)}%</p>
                      <div className="treatment-hint">
                         <strong>System Note:</strong> Identified as {result.grade} with {result.quality} grade quality profile.
                      </div>
                      <div className="report-btns mt-20">
                         <button className="btn-primary btn-sm" onClick={addToBatch}><Plus size={14}/> Add to Batch</button>
                         <button className="btn-secondary btn-sm" onClick={() => setResult(null)}>Retry</button>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          <div className="charts-row">
            <div className="bento-card chart-card">
              <div className="card-header"><h3>Grade Distribution</h3></div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height={180}>
                   <PieChart>
                      <Pie data={stats.pieData.length > 0 ? stats.pieData : [{name: 'Empty', value: 1, color: '#f1f5f9'}]} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                         {(stats.pieData.length > 0 ? stats.pieData : [{color: '#f1f5f9'}]).map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                         ))}
                      </Pie>
                      <RechartsTooltip />
                   </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bento-card chart-card">
              <div className="card-header"><h3>Confidence Index</h3></div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height={180}>
                   <BarChart data={chartData.length > 0 ? chartData.slice(0, 5) : []} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 10}} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                         {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: BATCH --- */}
        <div className="history-column">
           <div className="bento-card history-card-full">
              <div className="card-header">
                 <History size={18} />
                 <h3>Batch Queue</h3>
                 <button className="btn-sm btn-secondary" onClick={downloadCSV} disabled={batch.length === 0}><Download size={14}/></button>
              </div>
              <div className="history-list-scroll">
                 {batch.map(item => (
                   <div key={item.id} className="history-item-mini">
                      <div className="hist-meta">
                         <span className="id">#{item.id.toString().slice(-4)}</span>
                         <span className={`quality-tag ${item.quality}`}>{item.quality}</span>
                      </div>
                      <div className="hist-main">
                         <span className="diag">{item.grade}</span>
                         <span className="sev">{item.confidence}%</span>
                      </div>
                   </div>
                 ))}
                 {batch.length === 0 && <p className="empty">No batch samples</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Grading;
