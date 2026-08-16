# Khidmat 360

### Masjid Management System

**Khidmat-360** is a modern web-based Masjid Management System designed to help mosques manage their daily administrative and financial activities in a simple, organized, and transparent way.

The system is designed with a focus on simplicity and suitability for Masajid in Pakistan.

---

## 🚀 Technology Stack

### Frontend & Application

* **Next.js** — Full-stack React framework
* **TypeScript** — Type-safe development
* **Tailwind CSS** — UI styling
* **React Hook Form** — Form management
* **Zod** — Validation and schema definitions
* **Recharts** — Dashboard charts and financial analytics

### Backend & Database

* **Supabase** — Backend-as-a-Service
* **PostgreSQL** — Relational database
* **Supabase Auth** — Authentication and user management
* **Supabase Storage** — File and document storage
* **Row Level Security (RLS)** — Database-level authorization

### Additional Tools

* **PDF Generation** — Donation receipts and financial reports
* **Git & GitHub** — Version control
* **Vercel** — Deployment

---

## 🏗️ Architecture

```text
                    KHIDMAT-360
                        │
                     Next.js
                        │
             ┌──────────┴──────────┐
             │                     │
          Frontend              Server
             │                     │
             └──────────┬──────────┘
                        │
                     Supabase
                        │
          ┌─────────────┼─────────────┐
          │             │             │
      PostgreSQL       Auth        Storage
          │
     Row Level Security
```

---

## ✨ Core Features

### Dashboard

The dashboard provides an overview of the Masjid's activities and finances.

* Total donations
* Total expenses
* Current balance
* Monthly income
* Monthly expenses
* Recent transactions
* Upcoming events
* Pending payments

### 💰 Donations

Manage all donations received by the Masjid.

* Add donations
* Donor records
* Donation categories
* Donation purposes
* Payment methods
* Donation history
* Donation receipts
* Monthly donation reports

Example categories:

* General Donation
* Masjid Construction
* Maintenance
* Ramadan
* Zakat
* Fitrah
* Other

### 💸 Expenses

Track Masjid expenses.

* Electricity
* Water
* Gas
* Cleaning
* Maintenance
* Construction
* Staff salaries
* Security
* Other expenses

### 👨‍💼 Staff Management

Manage Masjid staff and their salaries.

Supported roles can include:

* Imam
* Muazzin
* Teacher
* Cleaner
* Security
* Other staff

Information can include:

* Name
* Role
* Contact information
* Joining date
* Salary
* Status

### 💵 Salary Management

Track staff salary payments.

* Monthly salary
* Payment status
* Payment date
* Payment history
* Outstanding salaries

### 📊 Reports

Generate financial and administrative reports.

* Monthly income report
* Monthly expense report
* Donation report
* Expense breakdown
* Salary report
* Balance report
* Transaction history

### 🧾 Receipts

Generate printable or downloadable receipts.

Donation receipts can contain:

* Receipt number
* Donor name
* Amount
* Purpose
* Payment method
* Date
* Masjid information

### 📅 Events

Manage Masjid events and activities.

Examples:

* Jummah
* Taraweeh
* Eid prayers
* Quran classes
* Islamic lectures
* Fundraising events

---

## 🔐 Authentication & Authorization

Authentication is handled using **Supabase Auth**.

The system can support role-based access such as:

### Admin

Full access to the system.

### Accountant

Access to:

* Donations
* Expenses
* Transactions
* Reports
* Receipts

### Staff

Limited access based on assigned permissions.

Database-level security is implemented using **Supabase Row Level Security (RLS)**.

---

## 🗄️ Initial Database Structure

The initial database may contain tables such as:

```text
users
mosques
donors
donations
expenses
staff
salary_payments
events
assets
```

The database structure can be expanded as the application grows.

---

## 📁 Suggested Project Structure

```text
khidmat-360/
│
├── app/
│   ├── dashboard/
│   ├── donations/
│   ├── expenses/
│   ├── staff/
│   ├── salaries/
│   ├── reports/
│   ├── receipts/
│   └── events/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── donations/
│   ├── expenses/
│   └── reports/
│
├── lib/
│   ├── supabase/
│   ├── validations/
│   └── utils/
│
├── types/
│
├── public/
│
├── supabase/
│   └── migrations/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Requirements

Before running the project, make sure you have:

* Node.js 20+
* npm
* Git
* Supabase account
* PostgreSQL database through Supabase

---

## 🔧 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd khidmat-360
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
.env.local
```

Add the required Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🏭 Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## 🔒 Environment Variables

Never commit sensitive credentials to GitHub.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Make sure `.env.local` is included in `.gitignore`.

---

## 🎯 Project Goals

Khidmat-360 aims to provide Masajid with a simple digital system for:

* Financial transparency
* Donation management
* Expense tracking
* Staff management
* Salary management
* Reporting
* Receipt generation
* Event management

The primary goal is **simplicity**.

Khidmat-360 should remain easy enough for a Masjid committee member with limited technical knowledge to use comfortably.

---

## 🛣️ Future Features

Potential future additions include:

* Multiple Masjid support
* Urdu language support
* Arabic language support
* Mosque asset management
* Maintenance requests
* Donation campaigns
* Zakat management
* Ramadan management
* Quran/Madrasa management
* Committee member management
* Announcement management
* SMS notifications
* WhatsApp notifications
* Automated financial reports
* Public transparency page

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Commit your changes.
6. Open a pull request.

---

## 📄 License

The project license will be defined before public distribution.

---

## 🕌 About

**Khidmat-360**

نظام الأمانة لإدارة المساجد

**Trusted Management for Every Masjid**

Built to help Masajid manage their administration, finances, staff, and community activities with simplicity and transparency.
