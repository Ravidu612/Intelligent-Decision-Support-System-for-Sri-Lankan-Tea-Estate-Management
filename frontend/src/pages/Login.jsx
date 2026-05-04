import React, { useState } from 'react';
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('manager@teaestate.ai');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="overlay"></div>
        <div className="visual-content">
          <Sprout size={60} className="mb-20 text-secondary" />
          <h1>Cultivating the Future of Tea</h1>
          <p>AI-Powered Agriculture Management System for Modern Estates.</p>
          
          <div className="feature-badges">
            <div className="f-badge">IoT Monitoring</div>
            <div className="f-badge">AI Diagnosis</div>
            <div className="f-badge">Smart Labor</div>
          </div>
        </div>
      </div>

      <div className="login-form-area">
        <div className="login-card fade-in">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Login to your estate management portal.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-footer">
              <label className="checkbox-field">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary w-full btn-login">
              Login to Dashboard <ArrowRight size={18} />
            </button>
          </form>

          <p className="login-note">
            Research Project © 2026 • IT & AI in Agriculture
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
