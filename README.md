# 🌸 Florabox

> A warm little gift, just for them.

Send virtual wish cards and flower bouquets to anyone, anywhere — no account needed.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express.js
- **Database**: PostgreSQL on [Neon](https://neon.tech)
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone and install

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Set up your database

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy your connection string from the Neon dashboard
3. In `/server`, copy `.env.example` to `.env` and paste your connection string
4. Run the SQL in `server/schema.sql` in the Neon SQL editor to create your tables

### 3. Run locally

Open two terminals:

```bash
# Terminal 1 — start the backend
cd server
npm run dev

# Terminal 2 — start the frontend
cd client
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) 🌸

---

## Project Structure

```
florabox/
├── client/               # React frontend
│   └── src/
│       ├── pages/        # Home, CardBuilder, BouquetBuilder, CardView, MyCreations
│       ├── components/   # Shared UI components
│       ├── hooks/        # Custom React hooks
│       └── utils/        # Helper functions
└── server/               # Express backend
    ├── routes/           # cards.js, bouquets.js, users.js
    ├── db.js             # PostgreSQL connection
    ├── schema.sql        # Database tables
    └── index.js          # Server entry point
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — pick what to create |
| `/card/new` | Card builder |
| `/bouquet/new` | Bouquet builder |
| `/view/:id` | Recipient view — envelope flip reveal |
| `/u/:username` | Creator's personal gallery |

---

Made with 🌿 and a lot of warmth.
