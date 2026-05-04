import React from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Bell, 
  Cpu, 
  Database,
  Globe,
  LogOut
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-page fade-in">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Manage your account and system configurations.</p>
        </div>
      </header>

      <div className="settings-grid">
        <div className="settings-nav bento-card">
          <div className="settings-nav-item active">
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="settings-nav-item">
            <SettingsIcon size={20} />
            <span>System Settings</span>
          </div>
          <div className="settings-nav-item">
            <Bell size={20} />
            <span>Notifications</span>
          </div>
          <div className="settings-nav-item">
            <ShieldCheck size={20} />
            <span>Security</span>
          </div>
          <div className="settings-nav-item">
            <Cpu size={20} />
            <span>AI Models</span>
          </div>
          <div className="settings-nav-item">
            <Database size={20} />
            <span>IoT Gateways</span>
          </div>
          <div className="divider"></div>
          <div className="settings-nav-item text-danger">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>

        <div className="settings-content-main">
          <div className="bento-card">
            <h3>Profile Information</h3>
            <p className="text-muted mb-20">Personalize your system presence.</p>
            
            <div className="profile-edit">
              <div className="avatarLarge-edit">
                <div className="avatar-preview">JD</div>
                <button className="btn-text">Change Photo</button>
              </div>
              
              <div className="form-grid">
                <div className="input-field">
                  <label>Full Name</label>
                  <input type="text" defaultValue="John Doe" />
                </div>
                <div className="input-field">
                  <label>Email Address</label>
                  <input type="email" defaultValue="j.doe@teaestate.ai" />
                </div>
                <div className="input-field">
                  <label>Role</label>
                  <input type="text" defaultValue="Estate Manager" disabled />
                </div>
                <div className="input-field">
                  <label>Location</label>
                  <input type="text" defaultValue="Nuwara Eliya, Sri Lanka" />
                </div>
              </div>
              <button className="btn-primary mt-20">Save Changes</button>
            </div>
          </div>

          <div className="bento-card mt-20">
            <h3>Language & Regional</h3>
            <div className="form-grid">
              <div className="input-field">
                <label>System Language</label>
                <select className="select-input">
                  <option>English (US)</option>
                  <option>Sinhala</option>
                  <option>Tamil</option>
                </select>
              </div>
              <div className="input-field">
                <label>Timezone</label>
                <select className="select-input">
                  <option>(GMT+05:30) Colombo</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
