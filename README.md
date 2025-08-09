# Prepstation Backend (Node.js + Express + MongoDB)

## Quickstart (Local)
1. Copy `.env.example` to `.env` and set `MONGO_URI` (default: mongodb://localhost:27017/prepstation)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (it will auto-run the seeder which inserts only if collections are empty and performs updates if records changed):
   ```bash
   npm start
   ```
4. Server runs on http://localhost:5000 by default.

## Seed & Data
- The seeding logic runs automatically on startup via `tools/seedRunner.js` called from `server.js`.
- Seed JSON files are in `data/` (users.json, courses.json, lessons.json, quizzes.json, schools.json).
- To run the seed manually: `npm run seed`

## Notes
- Logs are written to `logs/seeding.log` and also printed to console (same entries) using Winston.
- Environment variables are in `.env.example`.
