import React from 'react';
import { useAuth } from '../context/AuthContext';

type View = 'feed' | 'compose' | 'inspiration' | 'settings';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { config, authenticated, logout } = useAuth();

  const navItems = [
    { id: 'feed', label: 'Feed', icon: '✦' },
    { id: 'inspiration', label: 'Inspiration', icon: '◈' },
  ];

  const restrictedItems = [
    { id: 'compose', label: 'Compose', icon: '✎' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <div className="sidebar-nav glass">
      <div className="logo">
        <h1>{config.site_name}</h1>
        <div className="logo-dot"></div>
      </div>
      
      <nav>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id as View)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}

        <div className="nav-divider"></div>

        {authenticated && restrictedItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id as View)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="quote">{config.site_tagline}</p>
        {authenticated ? (
          <button className="logout-btn" onClick={logout}>Logout</button>
        ) : (
          <button className="login-btn" onClick={() => setCurrentView('compose')}>
            Owner Login
          </button>
        )}
      </div>

      <style>{`
        .sidebar-nav {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 2.5rem;
          z-index: 100;
          border-left: none;
          border-top: none;
          border-bottom: none;
          border-right: 1px solid var(--glass-border);
        }

        .logo {
          margin-bottom: 4rem;
          position: relative;
          display: flex;
          align-items: center;
        }

        .logo h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-secondary);
          border-radius: 50%;
          margin-left: 4px;
          flex-shrink: 0;
          box-shadow: 0 0 15px var(--accent-secondary);
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }

        .nav-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 0.5rem 0;
          opacity: 0.5;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item.active {
          color: var(--text-primary);
          background: rgba(168, 85, 247, 0.1);
          border-color: rgba(168, 85, 247, 0.2);
        }

        .nav-icon {
          font-size: 1.4rem;
          color: var(--accent-primary);
        }

        .sidebar-footer {
          margin-top: auto;
          font-size: 0.85rem;
          color: var(--text-secondary);
          opacity: 0.7;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quote {
          font-style: italic;
        }

        .logout-btn, .login-btn {
          background: transparent;
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          text-align: center;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }

        .login-btn {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .login-btn:hover {
          background: rgba(168, 85, 247, 0.1);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
