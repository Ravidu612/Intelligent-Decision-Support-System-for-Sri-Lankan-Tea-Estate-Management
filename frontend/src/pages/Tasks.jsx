import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BrainCircuit, 
  ArrowRight,
  TrendingUp,
  User,
  ShieldCheck,
  Zap,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import './Tasks.css';

const Tasks = () => {
  const [loading, setLoading] = useState(false);
  const [allocation, setAllocation] = useState(null);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/workers');
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const currentTasks = [
    { id: 'T001', worker: 'Anura Kumara', task: 'Harvesting', field: 'Block B', time: '08:00 - 16:00', status: 'In Progress', fatigue: 'high', score: 42.5, recommendation: 'Rest Required' },
    { id: 'T002', worker: 'Chaminda Vaas', task: 'Pruning', field: 'Block A', time: '09:00 - 15:00', status: 'Completed', fatigue: 'low', score: 88.2, recommendation: 'Optimal for Duty' },
    { id: 'T003', worker: 'Kusal Perera', task: 'Fertilizing', field: 'Block C', time: '08:00 - 12:00', status: 'Pending', fatigue: 'medium', score: 65.4, recommendation: 'Moderate Capacity' },
  ];

  const runAIAllocation = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/allocate-task', {
        required_skill: 'Harvesting'
      });
      if (res.data.success) {
        setAllocation(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tasks-page fade-in">
      <header className="page-header">
        <div>
          <h1>Task Allocation & Optimization</h1>
          <p className="subtitle">AI-driven workload distribution based on worker suitability.</p>
        </div>
        <button 
          className={`btn-ai-allocate ${loading ? 'loading' : ''}`}
          onClick={runAIAllocation}
          disabled={loading}
        >
          <Zap size={18} /> {loading ? 'Running AI Engine...' : 'AI Allocate Task'}
        </button>
      </header>

      {allocation && (
        <div className="allocation-result bento-card glass-morphism mb-6 animate-slide-up">
          <div className="result-header">
            <div className="result-icon"><ShieldCheck size={24} /></div>
            <div>
              <h4>AI Optimized Selection</h4>
              <p>Top candidate found for the current shift</p>
            </div>
          </div>
          <div className="result-body">
            <div className="candidate-card">
              <div className="cand-info">
                <span className="cand-label">Recommended Worker</span>
                <span className="cand-name">{allocation.bestWorker}</span>
              </div>
              <div className="cand-score">
                <span className="cand-label">Suitability Score</span>
                <span className="score-val">{allocation.score}%</span>
              </div>
            </div>
            <div className="allocation-reason">
              <InfoIcon size={16} /> <strong>Reason:</strong> {allocation.reason}
            </div>
          </div>
        </div>
      )}

      <div className="tasks-container bento-card">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Worker</th>
              <th>Task / Field</th>
              <th>Status</th>
              <th>Fatigue Level</th>
              <th>Suitability Score</th>
              <th>Recommendation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr key={task.id} className={task.fatigue === 'high' ? 'row-disabled' : ''}>
                <td className="task-id">#{task.id}</td>
                <td>
                   <div className="worker-cell">
                     <div className="avatarSmall">{task.worker.charAt(0)}</div>
                     <span>{task.worker}</span>
                   </div>
                </td>
                <td>
                  <div className="task-cell">
                     <strong>{task.task}</strong>
                     <span>{task.field}</span>
                  </div>
                </td>
                <td><span className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></td>
                <td>
                    <span className={`fatigue-pill ${task.fatigue}`}>
                        {task.fatigue.toUpperCase()}
                    </span>
                </td>
                <td><strong>{task.score}%</strong></td>
                <td className="recommendation-cell">
                    <div className="rec-wrapper">
                        {task.fatigue === 'high' && <AlertTriangle size={12} className="text-red" />}
                        {task.recommendation}
                    </div>
                </td>
                <td>
                  <button 
                    className={`btn-table ${task.fatigue === 'high' ? 'btn-disabled' : ''}`}
                    disabled={task.fatigue === 'high'}
                  >
                    {task.fatigue === 'high' ? 'Rest Required' : 'Assign Task'}
                  </button>
                  {task.fatigue === 'medium' && (
                    <div className="table-warning">⚠️ Light task only</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InfoIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export default Tasks;

