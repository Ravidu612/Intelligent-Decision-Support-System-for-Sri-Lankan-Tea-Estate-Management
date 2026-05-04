import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Activity, 
  Heart, 
  Thermometer, 
  BrainCircuit, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  Cpu, 
  CheckCircle,
  Info,
  Clock,
  X,
  UserPlus,
  Calendar,
  AlertCircle,
  Zap,
  ShieldCheck,
  Droplets,
  Loader2,
  Edit2,
  Trash2,
  Save,
  Activity as HealthIcon
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Workers.css';

const AIFlowCard = ({ worker, isChecking }) => {
  return (
    <div className="ai-flow-card">
      <h5>AI Fatigue Prediction Process</h5>
      <div className="flow-container">
        <div className="flow-step">
          <div className="step-icon"><Database size={18} /></div>
          <div className="step-content">
            <span className="step-label">Step 1: Input</span>
            <div className="input-pills">
              <span><Clock size={10} /> {worker.workingHours}h</span>
              <span><Heart size={10} /> {worker.heartRate}bpm</span>
              <span><Droplets size={10} /> {worker.spo2}%</span>
            </div>
          </div>
        </div>
        <div className="flow-arrow"><ArrowRight size={14} /></div>
        <div className="flow-step">
          <div className="step-icon model"><Cpu size={18} /></div>
          <div className="step-content">
            <span className="step-label">Step 2: Model</span>
            <span className="model-name">Random Forest</span>
          </div>
        </div>
        <div className="flow-arrow"><ArrowRight size={14} /></div>
        <div className="flow-step">
          <div className="step-icon output"><CheckCircle size={18} /></div>
          <div className="step-content">
            <span className="step-label">Step 3: Output</span>
            <span className={`output-val ${worker.fatigue}`}>
              {isChecking ? '...' : (worker.fatigue === 'unknown' ? '?' : worker.fatigue.toUpperCase())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newWorker, setNewWorker] = useState({ id: '', name: '', field: 'Block A', heartRate: 75, spo2: 98, workingHours: 0 });
  const [editingWorker, setEditingWorker] = useState(null);
  const [alerts, setAlerts] = useState({});
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/workers');
      const fetchedWorkers = res.data;
      setWorkers(fetchedWorkers);
      
      // Auto predict for all workers on load
      autoPredictAll(fetchedWorkers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setInitializing(false), 1500);
    }
  };

  const autoPredictAll = async (workerList) => {
    for (const worker of workerList) {
      await checkFatigue(worker.id, workerList);
    }
  };

  const checkFatigue = async (workerId, currentWorkers = null) => {
    setChecking(workerId);
    const list = currentWorkers || workers;
    const worker = list.find(w => w.id === workerId);
    
    if (!worker) {
        setChecking(null);
        return;
    }

    try {
      // 1. Predict Fatigue via Direct AI API (Port 5002)
      let fatigue = 'unknown';
      let confidence = 0;
      let aiError = false;

      try {
        const aiRes = await axios.post('http://127.0.0.1:5002/predict-fatigue', {
          working_hours: worker.workingHours || 0,
          task_difficulty: 3,
          avg_hr: worker.heartRate || 75,
          avg_spo2: worker.spo2 || 98
        });
        
        fatigue = aiRes.data.fatigue;
        confidence = aiRes.data.confidence;
      } catch (e) {
        console.error("AI API Error:", e);
        aiError = true;
      }

      // 2. Update DB with fatigue level
      await axios.patch(`http://127.0.0.1:5001/api/workers/${workerId}`, { fatigue });

      // 3. Get Next Day Plan & Recommendation
      let nextDayPlan = "Normal work allowed";
      if (fatigue === 'high') nextDayPlan = "Rest required";
      else if (fatigue === 'medium') nextDayPlan = "Light work recommended";
      
      // We can still call the backend for more complex recommendations if needed
      try {
        const planRes = await axios.post('http://127.0.0.1:5001/api/next-day-plan', { fatigue });
        nextDayPlan = planRes.data.recommendation;
      } catch (e) { /* Fallback to local logic */ }

      // 4. Auto Grievance Check
      let grievanceIssue = null;
      if (fatigue === 'high' || worker.workingHours > 8) {
        grievanceIssue = "Overwork detected";
      }

      setWorkers(prev => prev.map(w => 
        w.id === workerId ? { 
          ...w, 
          fatigue, 
          confidence: confidence ? (confidence * 100).toFixed(0) : 0, 
          nextDayPlan,
          aiError
        } : w
      ));

      if (grievanceIssue) {
        setAlerts(prev => ({ ...prev, [workerId]: "⚠️ Auto Grievance Generated: " + grievanceIssue }));
      } else {
        setAlerts(prev => {
            const newAlerts = { ...prev };
            delete newAlerts[workerId];
            return newAlerts;
        });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setChecking(null);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/workers', {
        ...newWorker,
        id: newWorker.id.trim(),
        name: newWorker.name.trim()
      });
      const registeredWorker = res.data;
      setWorkers(prev => [registeredWorker, ...prev]);
      setShowAddModal(false);
      setNewWorker({ id: '', name: '', field: 'Block A', heartRate: 75, spo2: 98, workingHours: 0 });
      
      // Auto predict for the newly registered worker
      checkFatigue(registeredWorker.id, [registeredWorker, ...workers]);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      alert("Registration failed: " + errorMessage);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`http://127.0.0.1:5001/api/workers/${editingWorker.id}`, {
        name: editingWorker.name.trim(),
        field: editingWorker.field,
        heartRate: Number(editingWorker.heartRate),
        spo2: Number(editingWorker.spo2),
        workingHours: Number(editingWorker.workingHours)
      });
      
      const updatedWorker = res.data;
      setWorkers(prev => prev.map(w => w.id === updatedWorker.id ? { ...w, ...updatedWorker } : w));
      setShowEditModal(false);
      
      // Auto re-predict fatigue after health data update
      checkFatigue(updatedWorker.id);
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (workerId) => {
    if (!window.confirm("Are you sure you want to delete this worker record?")) return;
    
    try {
      await axios.delete(`http://127.0.0.1:5001/api/workers/${workerId}`);
      setWorkers(prev => prev.filter(w => w.id !== workerId));
      setAlerts(prev => {
        const newAlerts = { ...prev };
        delete newAlerts[workerId];
        return newAlerts;
      });
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  const openEditModal = (worker) => {
    setEditingWorker({ ...worker });
    setShowEditModal(true);
  };

  const getFatigueBadge = (worker) => {
    if (worker.aiError) return <span className="fatigue-badge unknown">⚠️ AI service unavailable</span>;
    
    const level = worker.fatigue;
    const conf = worker.confidence ? ` (${worker.confidence}% confidence)` : '';
    
    switch (level) {
      case 'low': return <span className="fatigue-badge safe">🟢 Safe{conf}</span>;
      case 'medium': return <span className="fatigue-badge warning">🟡 Warning{conf}</span>;
      case 'high': return <span className="fatigue-badge risk">🔴 Risk{conf}</span>;
      default: return <span className="fatigue-badge unknown">⚪ Unknown</span>;
    }
  };

  const getRecommendationBanner = (fatigue) => {
    switch (fatigue) {
      case 'high': return <div className="recommendation-banner risk">⚠️ Worker requires rest</div>;
      case 'medium': return <div className="recommendation-banner warning">⚠️ Avoid heavy tasks</div>;
      case 'low': return <div className="recommendation-banner safe">✅ Fit for all tasks</div>;
      default: return null;
    }
  };

  if (initializing) {
    return (
        <div className="loading-screen">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="loading-content"
            >
                <Loader2 className="spinner" size={48} />
                <h2>Initializing AI Labor Management...</h2>
                <p>Syncing real-time health data and fatigue models</p>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="workers-page fade-in">
      <header className="page-header">
        <div>
          <h1>Labor Management AI</h1>
          <p className="subtitle">ML-based fatigue prediction and safety enforcement.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> Register New Worker
        </button>
      </header>

      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="modal-card bento-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3><UserPlus size={20} /> New Worker Record</h3>
                <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleRegister} className="register-form">
                <div className="form-grid">
                    <div className="form-group">
                    <label>Full Name</label>
                    <input required placeholder="Enter full name" value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>Worker ID (Unique)</label>
                    <input required placeholder="e.g. W100" value={newWorker.id} onChange={e => setNewWorker({...newWorker, id: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>Field Assignment</label>
                    <select value={newWorker.field} onChange={e => setNewWorker({...newWorker, field: e.target.value})}>
                        <option>Block A</option>
                        <option>Block B</option>
                        <option>Block C</option>
                    </select>
                    </div>
                </div>

                <div className="form-divider">
                    <span><HealthIcon size={14} /> Manual Health Entry</span>
                </div>

                <div className="form-grid-3">
                    <div className="form-group">
                        <label>Heart Rate (bpm)</label>
                        <input type="number" value={newWorker.heartRate} onChange={e => setNewWorker({...newWorker, heartRate: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>SpO2 (%)</label>
                        <input type="number" value={newWorker.spo2} onChange={e => setNewWorker({...newWorker, spo2: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Working Hours</label>
                        <input type="number" value={newWorker.workingHours} onChange={e => setNewWorker({...newWorker, workingHours: e.target.value})} />
                    </div>
                </div>
                
                <button type="submit" className="btn-primary w-full mt-10" disabled={!newWorker.name || !newWorker.id}>Save Record</button>
              </form>
            </motion.div>
          </div>
        )}

        {showEditModal && editingWorker && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="modal-card bento-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3><Edit2 size={20} /> Edit Worker Record</h3>
                <button onClick={() => setShowEditModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdate} className="register-form">
                <div className="form-grid">
                    <div className="form-group">
                    <label>Full Name</label>
                    <input required value={editingWorker.name} onChange={e => setEditingWorker({...editingWorker, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>Worker ID</label>
                    <input disabled value={editingWorker.id} />
                    </div>
                    <div className="form-group">
                    <label>Field Assignment</label>
                    <select value={editingWorker.field} onChange={e => setEditingWorker({...editingWorker, field: e.target.value})}>
                        <option>Block A</option>
                        <option>Block B</option>
                        <option>Block C</option>
                    </select>
                    </div>
                </div>

                <div className="form-divider">
                    <span><HealthIcon size={14} /> Update Health Metrics</span>
                </div>

                <div className="form-grid-3">
                    <div className="form-group">
                        <label>Heart Rate</label>
                        <input type="number" value={editingWorker.heartRate} onChange={e => setEditingWorker({...editingWorker, heartRate: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>SpO2 (%)</label>
                        <input type="number" value={editingWorker.spo2} onChange={e => setEditingWorker({...editingWorker, spo2: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Working Hours</label>
                        <input type="number" value={editingWorker.workingHours} onChange={e => setEditingWorker({...editingWorker, workingHours: e.target.value})} />
                    </div>
                </div>
                
                <button type="submit" className="btn-primary w-full mt-10"><Save size={18} /> Update Record</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="workers-grid">
        {loading ? <div className="loading-state">Syncing with DB...</div> : workers.map((worker) => (
          <div key={worker.id} className={`bento-card worker-card ${worker.fatigue === 'high' ? 'risk-border' : ''}`}>
            {alerts[worker.id] && (
                <div className="alert-badge">
                    <AlertCircle size={14} /> {alerts[worker.id]} 
                    <span className="priority-tag">HIGH PRIORITY</span>
                </div>
            )}
            
            <div className="worker-header">
              <div className="avatarLarge">{worker.name.charAt(0)}</div>
              <div className="worker-info">
                <div className="worker-title-row">
                    <h3>{worker.name}</h3>
                    <div className="action-icons">
                        <button className="icon-btn edit" title="Edit Worker" onClick={() => openEditModal(worker)}><Edit2 size={14} /></button>
                        <button className="icon-btn delete" title="Delete Worker" onClick={() => handleDelete(worker.id)}><Trash2 size={14} /></button>
                    </div>
                </div>
                <span>{worker.id} • {worker.field}</span>
              </div>
            </div>
            
            <div className="health-metrics">
              <div className="metric">
                <div className="metric-icon hr"><Heart size={14} /></div>
                <div className="metric-data">
                    <span>Heart Rate</span>
                    <strong>{worker.heartRate} bpm</strong>
                </div>
              </div>
              <div className="metric">
                <div className="metric-icon spo2"><Droplets size={14} /></div>
                <div className="metric-data">
                    <span>SpO2</span>
                    <strong>{worker.spo2}%</strong>
                </div>
              </div>
              <div className="metric">
                <div className="metric-icon hours"><Clock size={14} /></div>
                <div className="metric-data">
                    <span>Work Hours</span>
                    <strong>{worker.workingHours}h</strong>
                </div>
              </div>
            </div>

            <div className="fatigue-section">
              <div className="fatigue-row">
                <div className="fatigue-info">
                  {getFatigueBadge(worker)}
                </div>
                <button className={`btn-check-fatigue ${checking === worker.id ? 'loading' : ''}`} onClick={() => checkFatigue(worker.id)} disabled={checking === worker.id}>
                  <BrainCircuit size={16} /> {checking === worker.id ? 'Analyzing...' : 'Re-check'}
                </button>
              </div>
              
              {getRecommendationBanner(worker.fatigue)}

              {worker.nextDayPlan && (
                <div className="next-day-plan">
                   <Calendar size={14} /> 
                   <div>
                     <strong>Next Day Recommendation:</strong>
                     <p>{worker.nextDayPlan}</p>
                   </div>
                </div>
              )}

              <AIFlowCard worker={worker} isChecking={checking === worker.id} />
            </div>

            <div className="card-actions">
              <button className="btn-secondary">View Analytics</button>
              <div className="assign-action">
                <button 
                    className={`btn-primary-outline ${worker.fatigue === 'high' ? 'disabled' : ''}`}
                    disabled={worker.fatigue === 'high'}
                >
                    {worker.fatigue === 'high' ? 'Rest Required' : 'Assign Task'}
                </button>
                {worker.fatigue === 'medium' && (
                    <div className="action-warning">⚠️ Light tasks only</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workers;

