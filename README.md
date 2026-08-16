# Khidmat 360

> Complete Masjid Management

Khidmat 360 is a self-hosted web-based Masjid Management / ERP platform
designed to help Masajid manage their day-to-day operations from one
place.

The project is designed around open-source technologies and avoids
dependency on paid third-party backend platforms such as Supabase.

## Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript / TypeScript
-   Modern responsive UI

### Backend

-   Laravel
-   PHP
-   Laravel Sanctum for API authentication
-   Laravel Reverb for real-time functionality
-   Laravel Queue for background jobs

### Database

-   PostgreSQL

### File Storage

-   Laravel local/private filesystem
-   Files are stored on the application's own server instead of a paid
    storage provider

### Infrastructure

-   Ubuntu Linux
-   Nginx
-   Git
-   Let's Encrypt SSL

## Architecture

``` text
React + Vite
      |
      v
 Laravel API
      |
      +--------------------+
      |                    |
      v                    v
 PostgreSQL          Private File Storage
      |
      v
 Laravel Services / Jobs / Events
```

## Supabase Replacements

Khidmat 360 does not require Supabase.

  -----------------------------------------------------------------------
  Supabase Feature                    Khidmat 360 Replacement
  ----------------------------------- -----------------------------------
  PostgreSQL                          Self-hosted PostgreSQL

  Supabase Auth                       Laravel Sanctum

  Supabase Storage                    Laravel private/local storage

  Supabase Realtime                   Laravel Reverb

  Supabase Edge Functions             Laravel Controllers, Jobs and
                                      Commands

  Supabase API                        Laravel API

  Database Triggers                   PostgreSQL triggers or Laravel
                                      Events / Observers
  -----------------------------------------------------------------------

This keeps the application under our own control and avoids vendor
dependency.

## Core Modules

The platform can be extended with modules such as:

-   Masjid management
-   Members and community management
-   Donations
-   Expenses
-   Finance and accounting
-   Attendance
-   Classes and Quran education
-   Announcements
-   Events
-   Volunteers
-   Notices
-   Reports
-   Document management

## Project Structure

### Backend

``` text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Services/
├── Jobs/
├── Events/
└── Observers/
```

### Frontend

``` text
resources/
└── js/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── services/
    └── routes/
```

## Requirements

Before installing the project, make sure the server has:

-   PHP 8.2+
-   Composer
-   Node.js
-   npm
-   PostgreSQL
-   Nginx
-   Git

## Installation

Clone the repository:

``` bash
git clone <repository-url>
cd khidmat-360
```

Install PHP dependencies:

``` bash
composer install
```

Install frontend dependencies:

``` bash
npm install
```

Create the environment file:

``` bash
cp .env.example .env
```

Generate the Laravel application key:

``` bash
php artisan key:generate
```

## Database Configuration

Configure PostgreSQL in `.env`:

``` env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=khidmat_360
DB_USERNAME=postgres
DB_PASSWORD=
```

Run migrations:

``` bash
php artisan migrate
```

If seeders are available:

``` bash
php artisan db:seed
```

## Frontend Development

Start the Vite development server:

``` bash
npm run dev
```

## Laravel Development

Start the Laravel development server:

``` bash
php artisan serve
```

## Production Build

Build the frontend:

``` bash
npm run build
```

Optimize Laravel:

``` bash
php artisan optimize
```

## Storage

Khidmat 360 uses Laravel's filesystem instead of an external storage
provider.

Private files can be stored using:

``` php
$file->store('books', 'private');
```

Private files should be served through authorized Laravel endpoints
rather than exposing their filesystem path directly.

## Authentication

Laravel Sanctum is used for API authentication.

Authentication responsibilities include:

-   Login
-   Logout
-   Session/token management
-   User authorization
-   Protected API routes

## Real-Time Features

Laravel Reverb can be used for real-time functionality such as:

-   Live notifications
-   Donation updates
-   Administrative alerts
-   Community updates
-   Real-time dashboard information

## Background Jobs

Laravel Queue can handle tasks that should run outside the request
lifecycle, such as:

-   Notifications
-   Emails
-   Report generation
-   File processing
-   Other long-running tasks

The database queue driver can be used when an external queue service is
not required.

## Development Principles

### Service Layer

Business logic should be kept inside service classes rather than large
controllers.

Example:

``` text
Controller
    ↓
Form Request
    ↓
Service
    ↓
Model
```

### Form Requests

Validation should be handled through dedicated Form Request classes.

Example:

``` bash
php artisan make:request StoreBookRequest
```

### Private Files

Sensitive or restricted documents should not be stored in publicly
accessible directories.

### API Design

API endpoints should follow consistent RESTful conventions and return
predictable JSON responses.

### Database

PostgreSQL should be used as the primary database for production.

## Security

The application should follow standard security practices:

-   Validate all incoming requests
-   Authorize access to resources
-   Keep private files protected
-   Never commit `.env` files
-   Hash passwords using Laravel's supported mechanisms
-   Use HTTPS in production
-   Keep dependencies updated
-   Restrict database access to trusted hosts
-   Use appropriate database backups

## Environment Variables

Never commit sensitive values such as:

``` text
APP_KEY
DB_PASSWORD
MAIL_PASSWORD
API_KEYS
```

The `.env` file should remain private.

## Deployment

A typical production deployment is:

``` text
Internet
   |
   v
Nginx
   |
   v
Laravel / PHP-FPM
   |
   +---------> PostgreSQL
   |
   +---------> Private Storage
   |
   +---------> Queue
   |
   +---------> Reverb
```

## License

This project is currently intended for private development and
deployment.

Add the appropriate open-source or proprietary license before public
distribution.
