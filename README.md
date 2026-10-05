# Kommunicate Platform

A full-stack communication request management platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Prisma** (SQLite).

Based on the [Kommunicate Platform Behance design](https://www.behance.net/gallery/231584073/Kommunicate-Platform).

## Features

- **Login** — Welcome screen with organization branding
- **New Request** — Create communication requests with full form fields
- **Track Request** — Search, filter, and manage requests with status badges
- **Templates** — Browse and download email/presentation templates
- **Delivery Calendar** — Monthly calendar with color-coded delivery events
- **Metrics** — Dashboard with project stats, effort hours, and utilization
- **Gallery** — Recent projects showcase and category cards
- **SOPs and TATs** — Process workflow and downloadable resources
- **Our Team** — Team member management
- **Add Hours** — Log effort hours against projects

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Login**.

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | Next.js 15, React 19, Tailwind CSS 4 |
| Backend    | Next.js API Routes            |
| Database   | SQLite via Prisma ORM         |
| Icons      | Lucide React                  |

## API Endpoints

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | `/api/requests`       | List/search requests       |
| POST   | `/api/requests`       | Create new request         |
| GET    | `/api/requests/[id]`  | Get request by ID/number   |
| PATCH  | `/api/requests/[id]`  | Update request             |
| GET    | `/api/hours`          | List hour entries          |
| POST   | `/api/hours`          | Add hour entry             |
| GET    | `/api/templates`      | List templates             |
| GET    | `/api/calendar`       | Calendar events            |
| GET    | `/api/gallery`        | Gallery projects/categories|
| GET    | `/api/metrics`        | Monthly metrics            |
| GET    | `/api/team`           | Team members               |
| POST   | `/api/team`           | Add team member            |

## Project Structure

```
src/
├── app/
│   ├── api/           # Backend API routes
│   ├── dashboard/     # All dashboard pages
│   └── page.tsx       # Login page
├── components/
│   ├── calendar/      # Calendar grid
│   ├── layout/        # Sidebar, dashboard layout
│   └── ui/            # Reusable UI components
└── lib/               # Prisma client, types, utils
prisma/
├── schema.prisma      # Database schema
└── seed.ts            # Sample data
```
