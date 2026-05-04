import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Search
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const notifications = [
    { id: 1, type: 'alert', title: 'High Heart Rate Detected', message: 'Worker W001 (Anura Kumara) heart rate exceeded 110 bpm in Block B.', time: '2 mins ago', unread: true },
    { id: 2, type: 'warning', title: 'Frost Risk Detected', message: 'Hyper-local forecast indicates frost risk in Estate North blocks tonight.', time: '1 hour ago', unread: true },
    { id: 3, type: 'success', title: 'Task Completed', message: 'Batch processing for Grade A tea (Batch #B202) has been successfully completed.', time: '3 hours ago', unread: false },
    { id: 4, type: 'info', title: 'System Update', message: 'The AI model for Leaf Disease Detection has been updated to v2.4.', time: 'Yesterday', unread: false },
  ];

  return (
    <div className="notifications-page fade-in">
      <header className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="subtitle">Stay updated with real-time alerts and system messages.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Mark all as read</button>
        </div>
      </header>

      <div className="notifications-container bento-card">
        <div className="notifications-filter">
          <div className="filter-tabs">
            <button className="active">All</button>
            <button>Alerts</button>
            <button>Tasks</button>
            <button>System</button>
          </div>
          <div className="search-small">
            <Search size={16} />
            <input type="text" placeholder="Search notifications..." />
          </div>
        </div>

        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
              <div className={`notif-icon-box ${notif.type}`}>
                {notif.type === 'alert' && <AlertTriangle size={20} />}
                {notif.type === 'warning' && <AlertTriangle size={20} />}
                {notif.type === 'success' && <CheckCircle2 size={20} />}
                {notif.type === 'info' && <Info size={20} />}
              </div>
              <div className="notif-content">
                <div className="notif-header">
                  <h4>{notif.title}</h4>
                  <span className="notif-time">
                    <Clock size={12} /> {notif.time}
                  </span>
                </div>
                <p>{notif.message}</p>
              </div>
              <button className="btn-icon-round"><MoreHorizontal size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
