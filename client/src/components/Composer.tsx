import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';

interface ComposerProps {
  initialContent?: string;
  onPostCreated: () => void;
}

const Composer: React.FC<ComposerProps> = ({ initialContent = '', onPostCreated }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsPosting(true);
    try {
      const res = await fetch(apiUrl('/api/posts'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ title: title.trim(), content })
      });
      if (!res.ok) {
        throw new Error(`Failed to publish (${res.status})`);
      }
      setTitle('');
      setContent('');
      onPostCreated();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="composer-container fade-in">
      <header className="view-header">
        <h2>Compose</h2>
        <p>Channel your thoughts. Markdown supported.</p>
      </header>

      <form onSubmit={handleSubmit} className="composer-form glass">
        <div className="input-group">
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="A compelling title..." 
            className="composer-input"
          />
        </div>
        
        <div className="input-group">
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Write your story here..."
            rows={12}
            className="composer-textarea"
          />
        </div>

        <div className="composer-footer">
          <div className="markdown-hint">
            <span>M↓</span> Markdown active
          </div>
          <button type="submit" className="post-button" disabled={isPosting || !title.trim() || !content.trim()}>
            {isPosting ? 'Manifesting...' : 'Publish Post'}
          </button>
        </div>
      </form>

      <style>{`
        .composer-form {
          padding: 2.5rem;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .composer-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--glass-border);
          color: #fff;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          font-size: 1.25rem;
          font-weight: 600;
          outline: none;
          transition: all 0.3s ease;
        }

        .composer-input:focus {
          border-color: var(--accent-primary);
          background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
        }

        .composer-textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--glass-border);
          color: #fff;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          font-size: 1.1rem;
          line-height: 1.6;
          outline: none;
          resize: vertical;
          min-height: 300px;
          transition: all 0.3s ease;
          font-family: var(--font-main);
        }

        .composer-textarea:focus {
          border-color: var(--accent-primary);
          background: rgba(0, 0, 0, 0.4);
        }

        .composer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        .markdown-hint {
          color: var(--text-secondary);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .markdown-hint span {
          background: var(--glass-border);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.8rem;
        }

        .post-button {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: #fff;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
        }

        .post-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
        }

        .post-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Composer;
