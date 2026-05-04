import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, User } from 'lucide-react';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="topbar glass">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search for workers, tasks, or reports..." />
          </div>
          <div className="topbar-actions">
            <button className="action-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="divider"></div>
            <div className="topbar-user">
              <div className="user-text">
                <span className="user-name">John Doe</span>
                <span className="user-role">Estate Manager</span>
              </div>
              <div className="avatar">JD</div>
            </div>
          </div>
        </header>
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
