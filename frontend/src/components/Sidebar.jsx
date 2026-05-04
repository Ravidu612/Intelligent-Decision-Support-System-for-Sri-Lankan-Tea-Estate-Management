import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Leaf, 
  TestTube, 
  CloudSun, 
  BarChart3, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sprout
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Workers', icon: <Users size={20} />, path: '/workers' },
    { name: 'Task Allocation', icon: <ClipboardList size={20} />, path: '/tasks' },
    { name: 'Leaf Disease', icon: <Leaf size={20} />, path: '/disease' },
    { name: 'Tea Grading', icon: <TestTube size={20} />, path: '/grading' },
    { name: 'Weather', icon: <CloudSun size={20} />, path: '/weather' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <Sprout className="logo-icon" size={28} />
          {!collapsed && <span className="logo-text">TeaEstate AI</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-text">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Estate Manager</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
