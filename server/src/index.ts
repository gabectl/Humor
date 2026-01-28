import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { execFileSync } from 'child_process';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const dbPath = process.env.DB_PATH || 'humor.db';
const db = new Database(dbPath);
const sessionTtlHoursEnv = Number(process.env.SESSION_TTL_HOURS);
const passwordRoundsEnv = Number(process.env.PASSWORD_ROUNDS);
const sessionTtlHours = Number.isFinite(sessionTtlHoursEnv) && sessionTtlHoursEnv > 0 ? sessionTtlHoursEnv : 24 * 7;
const passwordRounds = Number.isFinite(passwordRoundsEnv) && passwordRoundsEnv >= 8 ? passwordRoundsEnv : 12;

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS owner (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    site_name TEXT DEFAULT 'Humor.',
    site_tagline TEXT DEFAULT 'Mindful shit or horseshit. You decide.'
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  );
`);

try {
  db.exec(`ALTER TABLE sessions ADD COLUMN expires_at DATETIME`);
} catch (error) {
  // Column already exists or migration not needed.
}

const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length > 0 ? corsOrigins : '*'
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.type('text/plain').send('Humor API is running. Try /api/status.');
});

const isOwner = () => {
  const row = db.prepare<[], { count: number }>('SELECT COUNT(*) as count FROM owner').get();
  return (row?.count ?? 0) > 0;
};

const isValidToken = (token: string | undefined) => {
  if (!token) return false;
  const session = db.prepare<[string], { expires_at?: string | null }>('SELECT expires_at FROM sessions WHERE token = ?').get(token);
  if (!session) return false;
  if (session.expires_at && new Date(session.expires_at).getTime() <= Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return false;
  }
  return true;
};

const createSession = () => {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + sessionTtlHours * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO sessions (token, expires_at) VALUES (?, ?)').run(token, expiresAt);
  return token;
};

const getOwnerConfig = () => {
  const row = db.prepare<[], { site_name: string; site_tagline: string }>('SELECT site_name, site_tagline FROM owner WHERE id = 1').get();
  return row || { site_name: 'Humor.', site_tagline: 'Mindful shit or horseshit. You decide.' };
};

const normalizeInspiration = (payload: unknown) => {
  let items: unknown[] = [];
  if (Array.isArray(payload)) {
    items = payload;
  } else if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) items = record.items;
    if (Array.isArray(record.data)) items = record.data;
  }
  if (items.length === 0) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const headline = String(record.headline || record.title || record.text || '').trim();
      if (!headline) return null;
      const category = String(record.category || record.section || record.topic || 'Trending').trim();
      return { headline, category };
    })
    .filter(Boolean);
};

app.get('/api/status', (req, res) => {
  const token = req.headers.authorization;
  res.json({
    initialized: isOwner(),
    authenticated: isValidToken(token),
    config: getOwnerConfig()
  });
});

app.post('/api/setup', (req, res) => {
  if (isOwner()) {
    return res.status(403).json({ error: 'Already initialized.' });
  }
  const { username, password, site_name, site_tagline } = req.body;
  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const passwordHash = bcrypt.hashSync(password, passwordRounds);
  db.prepare('INSERT INTO owner (id, username, password, site_name, site_tagline) VALUES (1, ?, ?, ?, ?)').run(
    username.trim(),
    passwordHash,
    site_name || 'Humor.', 
    site_tagline || 'Mindful shit or horseshit. You decide.'
  );
  const token = createSession();
  res.json({ success: true, token });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const owner = db.prepare<[string], { password: string }>('SELECT password FROM owner WHERE username = ?').get(username);
  if (!owner) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const passwordValue = String(owner.password || '');
  const isHashed = passwordValue.startsWith('$2');
  const passwordMatches = isHashed
    ? bcrypt.compareSync(password, passwordValue)
    : passwordValue === password;

  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!isHashed) {
    const upgraded = bcrypt.hashSync(password, passwordRounds);
    db.prepare('UPDATE owner SET password = ? WHERE id = 1').run(upgraded);
  }
  const token = createSession();
  return res.json({ token });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
  res.json({ success: true });
});

app.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC, id DESC').all();
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  if (!isValidToken(req.headers.authorization)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { title, content } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }
  const info = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run(title.trim(), content);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
  res.json(post);
});

app.post('/api/config', (req, res) => {
  if (!isValidToken(req.headers.authorization)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { site_name, site_tagline } = req.body;
  if (!site_name?.trim() || !site_tagline?.trim()) {
    return res.status(400).json({ error: 'Site name and tagline are required.' });
  }
  db.prepare('UPDATE owner SET site_name = ?, site_tagline = ? WHERE id = 1').run(site_name.trim(), site_tagline.trim());
  res.json({ success: true });
});

app.get('/api/inspiration', (req, res) => {
  try {
    // Fetch latest news/trends using bird
    const output = execFileSync('bird', ['news', '-n', '5', '--json'], {
      encoding: 'utf-8',
      env: { ...process.env, AUTH_TOKEN: process.env.AUTH_TOKEN, CT0: process.env.CT0 },
      timeout: 3000
    });
    const news = JSON.parse(output);
    const normalized = normalizeInspiration(news);
    res.json(normalized);
  } catch (error) {
    console.error('Failed to fetch inspiration:', error);
    res.json([
      { headline: 'Write about the last small thing that surprised you.', category: 'Prompt' },
      { headline: 'Describe a local place that feels like a hidden world.', category: 'Prompt' },
      { headline: 'What would your future self thank you for writing today?', category: 'Prompt' },
      { headline: 'Tell a story that starts with a sound you heard this week.', category: 'Prompt' },
      { headline: 'Pick one belief you changed your mind about and why.', category: 'Prompt' }
    ]);
  }
});

app.listen(port, () => {
  console.log(`Humor server humming at http://localhost:${port}`);
});
