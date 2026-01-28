import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const renderedContent = useMemo(() => {
    const parsed = marked.parse(post.content) as string;
    return DOMPurify.sanitize(parsed);
  }, [post.content]);

  return (
    <div className="post-card glass glass-hover fade-in">
      <div className="post-header">
        <h2>{post.title}</h2>
        <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: renderedContent }} 
      />
      
      <style>{`
        .post-card {
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .post-card h2 {
          font-size: 1.75rem;
          color: var(--text-primary);
          background: linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .post-date {
          font-size: 0.85rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
        }

        .post-content {
          color: var(--text-primary);
          font-size: 1.1rem;
          line-height: 1.7;
          opacity: 0.9;
        }

        .post-content p {
          margin-bottom: 1rem;
        }

        .post-content h1, .post-content h2, .post-content h3 {
          margin: 1.5rem 0 1rem 0;
          color: var(--accent-primary);
        }

        .post-content code {
          font-family: var(--font-mono);
          background: rgba(0, 0, 0, 0.3);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .post-content blockquote {
          border-left: 4px solid var(--accent-primary);
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default PostCard;
