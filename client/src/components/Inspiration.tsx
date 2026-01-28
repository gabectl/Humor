import React, { useEffect, useState } from 'react';
import { apiUrl } from '../lib/api';

interface NewsItem {
  headline: string;
  category: string;
}

interface InspirationProps {
  onInspire: (content: string) => void;
}

const Inspiration: React.FC<InspirationProps> = ({ onInspire }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInspiration();
  }, []);

  const fetchInspiration = async () => {
    setLoading(true);
    try {
      setError('');
      const res = await fetch(apiUrl('/api/inspiration'));
      if (!res.ok) {
        throw new Error(`Failed to fetch inspiration (${res.status})`);
      }
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('Unable to reach the inspiration engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inspiration-container fade-in">
      <header className="view-header">
        <div className="header-flex">
          <div>
            <h2>Inspiration Stream</h2>
            <p>Real-time signals from the global noise machine.</p>
          </div>
          <button className="refresh-btn glass" onClick={fetchInspiration} disabled={loading}>
            {loading ? '...' : '↻'}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-state glass">
          <div className="shimmer"></div>
          <p>Intercepting signals...</p>
        </div>
      ) : (
        <div className="news-list">
          {error ? (
            <div className="empty-state glass">
              <p>{error}</p>
            </div>
          ) : news.length > 0 ? (
            news.map((item, i) => (
              <div key={i} className="news-card glass glass-hover fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="news-category">{item.category}</div>
                <p className="news-headline">{item.headline}</p>
                <div className="news-footer">
                  <span className="source-tag">via feed</span>
                  <button 
                    className="inspire-btn"
                    onClick={() => onInspire(`> ${item.headline}\n\nInspired by this bird news, I think...`)}
                  >
                    Inspire ✎
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state glass">
              <p>The void is unusually quiet today.</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .refresh-btn {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 1.5rem;
          color: var(--accent-primary);
        }

        .refresh-btn:hover:not(:disabled) {
          transform: rotate(90deg);
          color: var(--text-primary);
        }

        .news-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .news-card {
          padding: 2rem;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .news-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-primary);
          font-weight: 700;
        }

        .news-headline {
          font-size: 1.25rem;
          font-weight: 500;
          line-height: 1.4;
          flex: 1;
        }

        .news-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .inspire-btn {
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          color: var(--accent-primary);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .inspire-btn:hover {
          background: var(--accent-primary);
          color: #fff;
        }

        .source-tag {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .loading-state {
          padding: 4rem;
          border-radius: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Inspiration;
