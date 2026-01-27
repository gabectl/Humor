import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { execSync } from 'child_process';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const db = new Database('humor.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

// Marked config
marked.use(gfmHeadingId());

app.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  const info = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run(title, content);
  res.json({ id: info.lastInsertRowid, title, content });
});

app.get('/api/inspiration', (req, res) => {
  try {
    // Fetch latest news/trends using bird
    const output = execSync('bird news -n 5 --json', { 
      encoding: 'utf-8',
      env: { ...process.env, AUTH_TOKEN: process.env.AUTH_TOKEN, CT0: process.env.CT0 }
    });
    const news = JSON.parse(output);
    res.json(news);
  } catch (error) {
    console.error('Failed to fetch inspiration:', error);
    res.status(500).json({ error: 'Failed to fetch inspiration from the void.' });
  }
});

app.listen(port, () => {
  console.log(`Humor server humming at http://localhost:${port}`);
});
