import React from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  Users, 
  Leaf, 
  ClipboardCheck,
  TrendingUp,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const reports = [
    { title: 'Monthly Worker Performance', date: 'April 2026', type: 'Workforce', size: '2.4 MB' },
    { title: 'Tea Quality Analytics - Q1', date: 'March 2026', type: 'Quality', size: '5.1 MB' },
    { title: 'Task Efficiency Audit', date: 'April 2026', type: 'Operations', size: '1.8 MB' },
    { title: 'Weather & Yield Correlation', date: 'April 2026', type: 'Climate', size: '3.2 MB' },
  ];

  return (
    <div className="reports-page fade-in">
      <header className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="subtitle">Detailed insights and performance metrics for estate management.</p>
        </div>
        <div className="header-actions">
          <button className="filter-btn">
            <Calendar size={18} /> Last 30 Days
          </button>
          <button className="btn-primary">
            <Download size={18} /> Export Data
          </button>
        </div>
      </header>

      <div className="reports-summary-grid">
        <div className="bento-card summary-item">
          <div className="summary-icon"><Users className="text-primary" /></div>
          <div className="summary-data">
            <span>Overall Efficiency</span>
            <strong>94.2%</strong>
            <span className="trend-up">+2.4% vs last month</span>
          </div>
        </div>
        <div className="bento-card summary-item">
          <div className="summary-icon"><Leaf className="text-secondary" /></div>
          <div className="summary-data">
            <span>Premium Yield Share</span>
            <strong>68%</strong>
            <span className="trend-up">+5.1% vs last month</span>
          </div>
        </div>
        <div className="bento-card summary-item">
          <div className="summary-icon"><ClipboardCheck className="text-success" /></div>
          <div className="summary-data">
            <span>Task Completion Rate</span>
            <strong>98.8%</strong>
            <span className="trend-down">-0.5% vs last month</span>
          </div>
        </div>
      </div>

      <div className="bento-card mt-20">
        <div className="card-header">
          <h3>Generated Reports</h3>
          <div className="search-small">
            <Filter size={16} />
            <input type="text" placeholder="Filter by type..." />
          </div>
        </div>

        <div className="reports-list">
          {reports.map((report, index) => (
            <div key={index} className="report-row">
              <div className="report-main-info">
                <div className="file-icon"><FileText size={24} /></div>
                <div className="report-text">
                  <h4>{report.title}</h4>
                  <span>Generated on {report.date} • {report.type}</span>
                </div>
              </div>
              <div className="report-meta-info">
                <span className="file-size">{report.size}</span>
                <button className="btn-icon-round"><Download size={18} /></button>
                <button className="btn-icon-round"><ChevronRight size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
