import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';

const SetupWizard: React.FC = () => {
  const { login, refreshStatus } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteTagline, setSiteTagline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanUsername = username.trim();
      const cleanSiteName = siteName.trim();
      const cleanSiteTagline = siteTagline.trim();
      const res = await fetch(apiUrl('/api/setup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: cleanUsername, 
          password, 
          site_name: cleanSiteName, 
          site_tagline: cleanSiteTagline 
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          await login(data.token);
        } else {
          await refreshStatus();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-wizard glass">
      <h2>Welcome to Humor.</h2>
      <p>The first person here owns the site. Choose your credentials.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Admin Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            placeholder="e.g. admin"
          />
        </div>
        <div className="form-group">
          <label>Admin Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            placeholder="Choose wisely"
          />
        </div>
        <hr />
        <div className="form-group">
          <label>Site Name</label>
          <input 
            type="text" 
            value={siteName} 
            onChange={e => setSiteName(e.target.value)} 
            placeholder="Humor."
          />
        </div>
        <div className="form-group">
          <label>Site Tagline</label>
          <input 
            type="text" 
            value={siteTagline} 
            onChange={e => setSiteTagline(e.target.value)} 
            placeholder="Mindful shit or horseshit..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Initializing...' : 'Complete Setup'}
        </button>
      </form>

      <style>{`
        .setup-wizard {
          max-width: 500px;
          margin: 4rem auto;
          padding: 3rem;
          border-radius: 24px;
        }
        .setup-wizard h2 {
          margin-top: 0;
          color: var(--accent-primary);
        }
        .setup-wizard p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        input {
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: white;
          outline: none;
        }
        input:focus {
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.08);
        }
        button {
          width: 100%;
          padding: 1rem;
          margin-top: 1rem;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          opacity: 0.9;
        }
        button:disabled {
          opacity: 0.5;
        }
        hr {
          border: 0;
          border-top: 1px solid var(--glass-border);
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default SetupWizard;
