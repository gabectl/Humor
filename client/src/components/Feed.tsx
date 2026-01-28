import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { apiUrl } from '../lib/api';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError('');
      const res = await fetch(apiUrl('/api/posts'));
      if (!res.ok) {
        throw new Error(`Failed to load posts (${res.status})`);
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('Unable to load posts right now.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state fade-in">
        <div className="shimmer"></div>
        <p>Tuning into the collective consciousness...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <header className="view-header fade-in">
        <h2>Latest Musings</h2>
        <p>Filtered through the lens of pure intention.</p>
      </header>

      <div className="posts-grid">
        {error ? (
          <div className="empty-state glass fade-in">
            <span className="empty-icon">!</span>
            <p>{error}</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="empty-state glass fade-in">
            <span className="empty-icon">∅</span>
            <p>The feed is an empty canvas. Time to create.</p>
          </div>
        )}
      </div>

      <style>{`
        .view-header {
          margin-bottom: 3rem;
        }

        .view-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .view-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: var(--text-secondary);
        }

        .shimmer {
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top: 3px solid var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          padding: 4rem;
          text-align: center;
          border-radius: 24px;
          color: var(--text-secondary);
        }

        .empty-icon {
          display: block;
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

export default Feed;
