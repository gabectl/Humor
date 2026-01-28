import React, { useEffect, useState } from 'react';
import { useTheme, type Theme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { config, token, refreshStatus } = useAuth();
  
  const [siteName, setSiteName] = useState(config.site_name);
  const [siteTagline, setSiteTagline] = useState(config.site_tagline);
  const [saving, setSaving] = useState(false);
  const isConfigValid = !!siteName.trim() && !!siteTagline.trim();

  useEffect(() => {
    setSiteName(config.site_name);
    setSiteTagline(config.site_tagline);
  }, [config.site_name, config.site_tagline]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(apiUrl('/api/config'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ site_name: siteName, site_tagline: siteTagline })
      });
      if (res.ok) {
        await refreshStatus();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { id: 'midnight', name: 'Midnight Purple', color: '#a855f7' },
    { id: 'emerald', name: 'Emerald Night', color: '#10b981' },
    { id: 'gold', name: 'Solar Gold', color: '#fbbf24' },
    { id: 'ocean', name: 'Deep Ocean', color: '#0ea5e9' },
  ];

  return (
    <div className="settings-container fade-in">
      <header className="view-header">
        <h2>Settings</h2>
        <p>Personalize your window into the humor.</p>
      </header>

      <section className="settings-section glass">
        <h3>Site Customization</h3>
        <p className="section-desc">Change how your home appears to the world.</p>
        
        <form onSubmit={handleSaveConfig} className="config-form">
          <div className="form-group">
            <label>Site Name</label>
            <input 
              type="text" 
              value={siteName} 
              onChange={e => setSiteName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Site Tagline</label>
            <input 
              type="text" 
              value={siteTagline} 
              onChange={e => setSiteTagline(e.target.value)} 
            />
          </div>
          <button type="submit" disabled={saving || !isConfigValid}>
            {saving ? 'Saving...' : 'Save Site Settings'}
          </button>
        </form>
      </section>

      <section className="settings-section glass">
        <h3>Aesthetics</h3>
        <p className="section-desc">Choose a color palette that resonates with your current state.</p>
        
        <div className="theme-grid">
          {themes.map((t) => (
            <button
              key={t.id}
              className={`theme-card ${theme === t.id ? 'active' : ''}`}
              onClick={() => setTheme(t.id as Theme)}
            >
              <div className="theme-preview" style={{ backgroundColor: t.color }}></div>
              <span className="theme-name">{t.name}</span>
              {theme === t.id && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section glass">
        <h3>System</h3>
        <div className="system-info">
          <div className="info-row">
            <span>Version</span>
            <span>2.1.0 (Owner Layer)</span>
          </div>
          <div className="info-row">
            <span>Backend</span>
            <span>SQLite v3.x</span>
          </div>
          <div className="info-row">
            <span>Frontend</span>
            <span>React + Vite</span>
          </div>
        </div>
      </section>

      <style>{`
        .settings-section {
          padding: 2.5rem;
          border-radius: 24px;
          margin-bottom: 2rem;
        }

        .settings-section h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--accent-primary);
        }

        .section-desc {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .config-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 400px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .form-group input {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          color: white;
          outline: none;
        }

        .config-form button {
          padding: 0.9rem;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .theme-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .theme-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .theme-card.active {
          border-color: var(--accent-primary);
          background: rgba(168, 85, 247, 0.05);
        }

        .theme-preview {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .theme-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .check {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          color: var(--accent-primary);
          font-weight: bold;
        }

        .system-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .info-row span:first-child {
          color: var(--text-secondary);
        }

        .info-row span:last-child {
          font-family: var(--font-mono);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Settings;
