# MGNREGA Maharashtra Dashboard

A lightweight, mobile-first bilingual web application that displays a district-level MGNREGA performance dashboard for Maharashtra. The running site implements the dashboard view only (no alerts/reports/extra pages).

## Summary

- Purpose: District KPI dashboard with 12-month trends.
- Scope: Dashboard view only — district selector, KPI cards, and trend charts.
- Languages: English + Marathi.
- Intended for local development and small deployments.

## Implemented Features

- District selector and list
- Performance dashboard with core KPIs:
  - Workers Employed
  - Person-Days Generated
  - Wages Paid
  - Assets Created
  - Work Completion Rate
  - Active Job Cards
- 12-month trend charts per district
- Bilingual UI (English + Marathi)
- Database seeding script with sample Maharashtra district data

## Technology Stack

- Frontend: React 18 + TypeScript, Wouter, TanStack Query, Tailwind CSS
- Backend: Express.js + TypeScript
- Database: PostgreSQL (local Docker recommended) using node-postgres (pg)
- ORM / Migrations: Drizzle ORM / drizzle-kit
- Dev tooling: Vite, tsx, cross-env
- Note: Neon-specific serverless code removed — local Postgres is the default for development

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── lib/            # Utilities and contexts
│   │   └── App.tsx         # Main application component
│   └── public/
│       ├── manifest.json   # PWA manifest
│       └── sw.js           # Service worker
├── server/
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database layer
│   ├── db.ts               # Database connection
│   └── seed.ts             # Database seeding
└── shared/
    └── schema.ts           # Shared TypeScript types and Drizzle schema
```

## Database Schema

### Districts
- 36 Maharashtra districts with bilingual names
- Geolocation coordinates for auto-detection
- Unique district codes

### Monthly Performance
- 12 months of historical data per district
- Metrics: workers, person-days, wages, assets, completion rates, job cards
- Indexed by district and month for fast queries

### Alerts
- System-generated irregularity alerts
- Severity levels: critical, warning, info
- Bilingual titles and descriptions

## API Endpoints

- `GET /api/districts` - List all Maharashtra districts
- `GET /api/districts/:id` - Get single district details
- `GET /api/districts/:id/performance` - Get current month performance
- `GET /api/districts/:id/trends` - Get 12-month performance history
- `GET /api/districts/:id/compare` - Get comparison with state averages and rankings
- `GET /api/alerts/:districtId` - Get district-specific alerts

## Design System

### Colors
- **Primary**: Blue (#3b82f6) - Government, trust, civic
- **Success**: Green (#22c55e) - Good performance
- **Warning**: Amber (#f59e0b) - Moderate performance
- **Destructive**: Red (#ef4444) - Poor performance / Critical alerts

### Typography
- **Font**: Noto Sans / Noto Sans Devanagari
- **Sizes**: 48-64px for KPI values, 16-18px for body, 14px minimum

### Spacing
- Consistent spacing units: 4px, 8px, 12px, 16px, 20px, 24px
- Card padding: 16-24px
- Section gaps: 32px

## User Journeys

1. **First-time user**: Select district → View dashboard → Explore trends
2. **Regular monitoring**: Auto-load last district → Check latest metrics → Review alerts
3. **Offline mode**: Load with cached data → View last update timestamp
4. **Report generation**: Navigate to reports → Download/print summary
5. **Comparison**: View how district performs vs state and other districts

## Development

### Running Locally
```bash
npm install
npm run dev
```

### Database Setup
```bash
npm run db:push          # Push schema changes
tsx server/seed.ts       # Seed with sample data
```

### Building for Production
```bash
npm run build
```

## Production Considerations

- Designed for deployment on Replit
- PostgreSQL database included
- Environment variables managed securely
- Service worker handles offline scenarios
- 24-hour API cache duration balances freshness and offline availability

## Recent Changes

- Implemented complete data schema for districts, performance, and alerts
- Built all frontend components with Material Design 3 principles
- Created comprehensive API layer with proper error handling
- Added PWA support with offline caching
- Implemented bilingual interface with text-to-speech
- Seeded database with 36 districts and 12 months of data

## User Preferences

- Mobile-first design is non-negotiable
- Accessibility for low-literacy users is paramount
- Bilingual support (English/Marathi) required throughout
- Visual communication prioritized over text
- Government civic design aesthetic (blue, green, red color system)
