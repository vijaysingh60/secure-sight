# SecureSight Dashboard

SecureSight is a modern CCTV monitoring dashboard that allows you to view, manage, and resolve security incidents detected by computer vision models across multiple camera feeds.

## Features
- **Dashboard UI** with stylish navbar, incident player, and incident list
- **Incident List**: View, filter, and resolve incidents (with optimistic UI)
- **Incident Player**: Large video/image frame with camera thumbnails
- **Live Active Incident Count** in the navbar
- **Profile section** in the navbar
- **Postgres (Neon) database** integration

## Tech Stack
- Next.js 15 (App Router)
- React 18
- Tailwind CSS
- PostgreSQL (Neon)
- Node.js (API routes)

## Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/vijaysingh60/secure-sight.git
   cd secure-sight
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and set your Neon Postgres connection string:
     ```env
     DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require&channel_binding=require
     ```

4. **Create the database tables**
   - Use the provided SQL to create tables in your Neon DB:
     ```sql
     CREATE TABLE IF NOT EXISTS cameras (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       name text UNIQUE NOT NULL,
       location text NOT NULL,
       created_at timestamptz DEFAULT now()
     );
     CREATE TABLE IF NOT EXISTS incidents (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       camera_id uuid NOT NULL REFERENCES cameras(id) ON DELETE CASCADE,
       type text NOT NULL,
       ts_start timestamptz NOT NULL,
       ts_end timestamptz NOT NULL,
       thumbnail_url text NOT NULL,
       resolved boolean DEFAULT false,
       created_at timestamptz DEFAULT now()
     );
     ```

5. **Seed the database**
   - Run the provided `seed.sql` to insert sample cameras and incidents:
     ```sh
     psql "$DATABASE_URL" -f seed.sql
     ```

6. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## Folder Structure
- `app/` - Next.js app directory (pages, API routes)
- `components/` - React UI components
- `lib/` - Database connection utility
- `public/` - Static assets (images, etc.)

## Environment Variables
- `DATABASE_URL` - Your Neon Postgres connection string

## License
MIT 