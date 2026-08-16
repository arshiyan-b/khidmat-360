# Khidmat 360

> Complete Masjid Management

Khidmat 360 is a web-based Masjid management platform that helps Masajid manage administration, members, finances, education, events, and community activities from a single system.

The project favors a single, simple application over a distributed one — it should stay easy enough for a Masjid committee member with limited technical knowledge to run and maintain.

## Features

- Masjid management
- Member management
- Donations and contributions
- Expense management
- Finance management
- Attendance tracking
- Quran and Islamic education classes
- Events management
- Announcements and notices
- Volunteer management
- Imam and staff management
- Reports and dashboards
- Document management
- Role-based access control

## Tech Stack

### Application

- Next.js (App Router)
- React
- TypeScript
- Server Actions / Route Handlers as the API layer

### Database

- PostgreSQL

### ORM

- Prisma

### Authentication

- Better Auth

### Forms & Validation

- React Hook Form
- Zod

### Charts & Reporting

- Recharts

### File Storage

- Private local server storage

### Infrastructure

- Ubuntu
- Nginx
- Node.js
- Git
- GitHub
- Let's Encrypt

## Why a Single Application

Earlier iterations of this project considered a separate NestJS API, Redis/BullMQ for background jobs, and Socket.IO for real-time updates. Those are solutions for high-traffic, multi-tenant systems.

Khidmat 360 serves one Masjid's committee at a time — low traffic, a handful of users, no need for horizontal scale. A single Next.js application keeps deployment, types, and auth in one place, with one dev server and one production target.

Background jobs (report generation, email receipts) can run as plain async functions or a scheduled cron task. Real-time feel (e.g. live donation totals) can be achieved with simple refetching rather than a persistent socket connection. These can be added later, individually, only if a specific feature genuinely needs them.

## Architecture

```text
                    Client
                       |
                       v
              Next.js (App Router)
                       |
        +--------------+--------------+
        |                             |
        v                             v
  Server Actions /              Better Auth
  Route Handlers                     |
        |                            v
        v                      Session / Users
     Prisma
        |
        v
   PostgreSQL
        |
        v
  Private File Storage
```

## Project Structure

```text
khidmat-360/
├── app/
│   ├── dashboard/
│   ├── donations/
│   ├── expenses/
│   ├── staff/
│   ├── salaries/
│   ├── members/
│   ├── attendance/
│   ├── classes/
│   ├── events/
│   ├── announcements/
│   ├── volunteers/
│   ├── reports/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── donations/
│   ├── expenses/
│   └── reports/
│
├── lib/
│   ├── auth/
│   ├── validations/
│   └── utils/
│
├── prisma/
│   └── schema.prisma
│
├── types/
│
├── public/
│
├── storage/
│   └── private/
│       ├── documents/
│       └── reports/
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Requirements

- Node.js 20+
- npm
- PostgreSQL
- Git

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd khidmat-360
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

## Environment Configuration

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/khidmat_360"

BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000
```

Never commit `.env` files containing secrets.

## Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio to inspect data:

```bash
npx prisma studio
```

## Development

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Authentication

Better Auth handles authentication and session management within the Next.js app.

Authentication includes:

- Registration
- Login
- Logout
- Session management
- Password management
- Protected routes
- Role-based authorization

## File Storage

Private documents are stored on the application server, not exposed through the public directory.

```text
storage/
└── private/
    ├── documents/
    └── reports/
```

Access to private files should go through authorized Server Actions or Route Handlers rather than direct filesystem paths.

## Application Layers

```text
Request
   |
   v
Route Handler / Server Action
   |
   v
Validation (Zod)
   |
   v
Service / lib function
   |
   v
Prisma
   |
   v
PostgreSQL
```

Business logic should be kept in dedicated functions under `lib/`, not scattered across route handlers or components.

## Modules

The application can be organized into domain-specific route groups and libs:

```text
donations/
expenses/
finance/
members/
attendance/
classes/
events/
announcements/
volunteers/
staff/
reports/
```

## Production Deployment

```text
                Internet
                   |
                   v
                 Nginx
                   |
                   v
             Next.js (Node.js)
                   |
        +----------+----------+
        |                     |
        v                     v
   PostgreSQL           Private Storage
```

Let's Encrypt can be used for HTTPS certificates.

## Security

- Validate all incoming requests (Zod)
- Protect authenticated routes
- Apply role-based authorization
- Keep private files protected
- Keep database credentials private
- Never commit `.env` files
- Use HTTPS in production
- Keep dependencies updated
- Use secure password hashing (handled by Better Auth)
- Restrict database access
- Maintain regular backups

## Development Guidelines

### TypeScript

TypeScript is used throughout the application for type safety and maintainability.

### Separation of Concerns

Keep responsibilities separated: route/action → validation → service function → Prisma → PostgreSQL.

### Database Access

Database operations should be handled through Prisma.

### API

Server Actions are preferred for internal mutations; Route Handlers are used where a REST-style endpoint is needed (e.g. for future external integrations).

## Future Additions

Add only when a concrete need arises:

- Background job runner (e.g. cron-based) for scheduled reports
- Real-time updates for live dashboards
- Separate API service, if the platform needs to serve non-web clients

## License

This project is currently intended for private development and deployment.

Add an appropriate license before public distribution.