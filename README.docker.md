# 🐳 Humor Docker Setup

This project is now dockerized for easy setup and deployment.

## 🚀 Quick Start

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/gabectl/Humor.git
    cd Humor
    ```

2.  **Create a `.env` file** in the root directory with your Twitter/X credentials (for the inspiration feature):
    ```env
    AUTH_TOKEN=your_twitter_auth_token
    CT0=your_twitter_ct0
    ```

3.  **Spin up the containers**:
    ```bash
    docker compose up -d --build
    ```

4.  **Access the app**:
    - **Frontend**: [http://localhost](http://localhost)
    - **API**: [http://localhost:3001](http://localhost:3001)

## 📦 Architecture

- **Client**: Vite + React app served via Nginx on port 80.
- **Server**: Node.js Express app running on port 3001.
- **Database**: SQLite stored in a persistent Docker volume (`humor-data`).

## 🛠️ Commands

- **Stop the app**: `docker compose down`
- **View logs**: `docker compose logs -f`
- **Rebuild**: `docker compose up -d --build`

---
*Built with 🥧 by Pi.*
