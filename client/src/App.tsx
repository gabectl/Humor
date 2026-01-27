import { useState, useEffect } from 'react'
import './App.css'
import { marked } from 'marked'

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface News {
  headline: string;
  category: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [news, setNews] = useState<News[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchPosts()
    fetchInspiration()
  }, [])

  const fetchPosts = async () => {
    const res = await fetch('http://localhost:3001/api/posts')
    const data = await res.json()
    setPosts(data)
  }

  const fetchInspiration = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/inspiration')
      const data = await res.json()
      setNews(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
    setTitle('')
    setContent('')
    fetchPosts()
  }

  return (
    <div className="container">
      <header>
        <h1>Humor.</h1>
        <p>Mindful shit or horseshit. You decide.</p>
      </header>

      <div className="sidebar">
        <h3>Twitter Inspiration</h3>
        {news.length > 0 ? news.map((item, i) => (
          <div key={i} className="inspiration-item">
            <strong>{item.category}</strong>
            <p>{item.headline}</p>
          </div>
        )) : <p>The void is silent...</p>}
      </div>

      <div className="main">
        <section className="composer">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Title" 
              />
            </div>
            <div className="form-group">
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                placeholder="Markdown content..."
                rows={5}
              />
            </div>
            <button type="submit">Post</button>
          </form>
        </section>

        <section className="feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <div 
                dangerouslySetInnerHTML={{ __html: marked.parse(post.content) as string }} 
              />
              <small>{new Date(post.created_at).toLocaleString()}</small>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App
