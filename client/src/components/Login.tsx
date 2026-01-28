import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';

const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cleanUsername = username.trim();
      const res = await fetch(apiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password })
      });
      const data = await res.json();
      if (res.ok) {
        await login(data.token);
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box glass">
      <h3>Owner Login</h3>
      <p>Please sign in to access restricted features.</p>
      
      {error && <div className="error-msg">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      <style>{`
        .login-box {
          max-width: 400px;
          margin: 4rem auto;
          padding: 2.5rem;
          border-radius: 20px;
        }
        .login-box h3 {
          margin-top: 0;
          color: var(--accent-primary);
        }
        .login-box p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        input {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          color: white;
          outline: none;
        }
        input:focus {
          border-color: var(--accent-primary);
        }
        button {
          width: 100%;
          padding: 0.9rem;
          margin-top: 0.5rem;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default Login;
