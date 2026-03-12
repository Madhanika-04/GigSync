# GigSync - Admin DashBoard
# GigSync Admin Dashboard

GigSync Admin Dashboard is a modern insure-tech operations console for managing gig worker protection data.

It provides a single interface for riders, policies, claims, payouts, alerts, and risk zones with a premium dark-first UI and responsive layouts.

## Highlights

- Dark-first interface with light mode toggle
- Multi-panel operations dashboard
- Rider monitoring table with detailed profile modal
- Policy creation and assignment workflows
- Claim lifecycle actions and payout tracking
- Alert handling with resolve and escalation actions
- Risk zone management with severity controls
- Live analytics and KPI summary panels
- Demo reset and settings controls for test workflows

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- Recharts
- Lucide React
- clsx

## Project Structure

- src/App.tsx: Admin shell, state management, page routing logic
- src/components/Sidebar.tsx: Left navigation and page switching
- src/components/Navbar.tsx: Top bar and page context controls
- src/components/StatCards.tsx: Main KPI cards
- src/components/RiderTable.tsx: Rider list, filtering, and detailed rider modal
- src/components/AlertsPanel.tsx: Incident alerts and quick actions
- src/components/RiskZonesPanel.tsx: Zone severity and risk operations
- src/components/AnalyticsPanel.tsx: Charts and trend analytics
- src/components/SummaryPanels.tsx: Aggregated health and operations summaries
- src/context/ThemeContext.tsx: Theme provider and toggle behavior
- src/data/mockData.ts: Seed data for riders, policies, claims, payouts, alerts, and zones
- src/types/index.ts: Shared TypeScript types

## Getting Started

Prerequisites:

- Node.js 18 or newer
- npm 9 or newer

Installation:

1. Open a terminal in the project folder.
2. Run npm install.

Run in development:

1. Run npm run dev.
2. Open http://localhost:5173

Build for production:

1. Run npm run build.
2. Preview with npm run preview.

## Available Scripts

- npm run dev: Start local development server
- npm run build: Type-check and create production build
- npm run preview: Serve the production build locally

## Data and Environment Notes

- The dashboard uses in-memory mock data from src/data/mockData.ts.
- Actions in the UI update local client state and reset on full reload.
- No backend API is required for the current demo version.

## Current Scope

This repository currently ships the admin dashboard experience only.

## Future Enhancements

- Backend API integration for persistence
- Role-based access and authentication
- Audit logs and action history
- Automated alerts via external weather and disruption feeds
- Exportable reports for operations and finance teams

## License

Internal or project-specific usage unless a separate license is added.
