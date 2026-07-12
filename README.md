<div align="center">

# AssetFlow

### Enterprise Asset & Resource Management System

*A modern, full-stack ERP platform for managing the complete lifecycle of physical assets and shared organizational resources.*

<br/>

<!-- Tech Stack Badges -->
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)

</div>

---

## Live Demo Credentials

Use the following demo account to explore the platform without setting up your own users:

| Field    | Value              |
| :------- | :----------------- |
|  Email    | `demo@assetflow.com`   |
|  Password | `password123`      |

For admin
| Field    | Value              |
| :------- | :----------------- |
|  Email    | `admin@assetflow.com`   |
|  Password | `admin123`      |

> Sign in at `/login` and you'll be taken straight to the dashboard.

---

##  Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Core Modules](#-core-modules)
- [Role-Based Access Control](#-role-based-access-control-rbac)
- [System Workflow](#-system-workflow)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

##  Overview

**AssetFlow** enables organizations to efficiently manage the complete lifecycle of physical assets and shared resources through a centralized ERP platform.

Designed with scalability, security, and operational efficiency in mind, AssetFlow replaces fragmented spreadsheets, paper registers, and manual approval processes with structured digital workflows. The platform is **industry-agnostic** and can be deployed across enterprises, educational institutions, hospitals, manufacturing facilities, government organizations, and startups to manage IT assets, office equipment, vehicles, furniture, laboratories, meeting rooms, and other shared organizational resources.

Rather than focusing on procurement or accounting, AssetFlow specializes in **asset lifecycle management, allocation, maintenance, auditing, and resource scheduling** while ensuring complete accountability through role-based access control and activity tracking.

---

##  Problem Statement

Many organizations continue to rely on spreadsheets, paper logs, or disconnected software for asset management. These approaches create several operational challenges:

-  Assets become misplaced or untraceable.
-  Double allocation causes scheduling conflicts.
-  Maintenance requests are delayed due to informal communication.
-  Audit processes become time-consuming and error-prone.
-  Asset ownership and responsibility remain unclear.
-  Managers lack real-time visibility into organizational resources.
-  Historical asset records are fragmented or unavailable.

AssetFlow addresses these challenges by providing a centralized ERP platform that standardizes asset operations, automates workflows, and maintains a complete audit trail throughout an asset's lifecycle.

---

##  Key Features

| | Feature |
| :--: | :--- |
|  | Complete asset lifecycle management |
|  | Organization-wide asset visibility |
|  | Shared resource booking with conflict prevention |
|  | Structured maintenance workflows |
|  | Department-based asset allocation |
|  | Automated audit cycles |
|  | Role-based access control (RBAC) |
|  | Real-time dashboards and analytics |
|  | QR-code based asset scanning |
|  | **Tara** — built-in AI assistant for reports & queries |
|  | Light / dark theme support |
|  | Responsive, animated modern web interface |

---

## Core Modules

### 1.  Organization Setup

Establishes the organizational structure used throughout the system.

- **Department Management** — create, edit, and archive departments; configure parent-child hierarchy; assign Department Heads; view department-wise asset ownership.
- **Asset Categories** — define standardized classifications (Electronics, Furniture, Vehicles, Laboratory Equipment, Office Equipment, Infrastructure) with configurable metadata fields.
- **Employee Directory** — a centralized employee database that forms the foundation for authentication and role assignment. Admins can promote employees into roles such as *Asset Manager* or *Department Head*.

### 2.  Asset Registration & Directory

A centralized repository containing every organizational asset.

- **Registration** captures Asset ID, Asset Tag, Serial Number, Category, Manufacturer, Model, Purchase Details, Location, Department, Assigned Employee, Warranty, Condition, and Supporting Documents.
- **Asset Lifecycle** — every asset progresses through a controlled, validated lifecycle:

  `Available → Reserved → Allocated → Under Maintenance → Lost → Retired → Disposed`

- **Asset History** — a permanent record of allocations, transfers, maintenance, audits, condition changes, and activity logs.

### 3.  Asset Allocation & Transfer

Manages asset ownership while preventing conflicts.

- **Allocation** to individual employees or departments, recording allocation date, expected return date, custodian, and notes.
- **Conflict Prevention** — an asset cannot be allocated to multiple users simultaneously; already-allocated assets are routed to the Transfer Request workflow.
- **Transfer Workflow** — request creation → department approval → Asset Manager approval → ownership transfer → activity logging.
- **Asset Return** — captures return condition, damage notes, missing accessories, and timestamp. Assets transition back to **Available** after check-in, and overdue returns trigger automated notifications.

### 4.  Resource Booking

Supports reservation of shared resources such as meeting rooms, company vehicles, conference halls, training labs, and shared equipment.

- **Calendar-Based Booking** — view availability, reserve slots, modify, and cancel.
- **Booking Validation** — prevents overlapping reservations, double booking, and invalid durations.
- **Booking Lifecycle** — `Upcoming → Ongoing → Completed → Cancelled`, with automated reminders before scheduled bookings.

### 5.  Maintenance Management

Provides a structured workflow for asset repairs.

- **Request Creation** — report issues with asset, description, priority, and attachments.
- **Approval Workflow:**

  `Pending → Approved / Rejected → Technician Assignment → In Progress → Resolved → Closed`

- **Automatic Status Updates** — assets move to **Under Maintenance** on approval and back to **Available** on resolution. Every request becomes part of the asset's permanent service history.

### 6.  Asset Audit Management

Enables systematic physical verification of organizational assets.

- **Audit Cycle Creation** by department, location, category, and date range.
- **Physical Verification** — auditors mark each asset as `Verified`, `Missing`, or `Damaged`.
- **Discrepancy Reports** — auto-generated reports for missing/damaged assets and exceptions. Closing an audit locks the records and updates statuses (e.g. `Missing → Lost`).

### 7.  Dashboards, Reports & Analytics

Real-time operational insights.

- **Dashboard Metrics** — Total Assets, Available, Allocated, Under Maintenance, Active Bookings, Overdue Returns, Pending Maintenance, Active Audit Cycles.
- **Reports** — asset utilization, department-wise inventory, allocation history, maintenance frequency, booking analytics, and audit discrepancy reports.
- **Activity Log** — every critical action is recorded for complete traceability and accountability.

---

##  Role-Based Access Control (RBAC)

AssetFlow implements strict role separation to ensure secure operations.

| Role | Responsibilities |
| :--- | :--- |
|  **Administrator** | Manage departments, categories, and employees; assign roles; configure system settings; view organization-wide reports. |
|  **Asset Manager** | Register & allocate assets; approve transfers and maintenance; manage lifecycle; resolve audit discrepancies; generate reports. |
|  **Department Head** | View departmental assets; approve internal transfers; monitor inventory; book shared resources; review department reports. |
|  **Employee** | View assigned assets; request transfers; return assets; book resources; submit maintenance requests; track status. |

---

##  System Workflow

```
Organization Setup
        │
        ▼
Asset Registration
        │
        ▼
Asset Allocation
        │
        ▼
Resource Booking
        │
        ▼
Maintenance Management
        │
        ▼
Audit Cycle
        │
        ▼
Reports & Analytics
```

---

##  Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations & **Three.js** for the WebGL starfield background
- **lucide-react** icons, **next-themes** for theming, **react-markdown** for rich content
- **@yudiel/react-qr-scanner** for QR-based asset scanning

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Next.js API](https://img.shields.io/badge/Next.js_API_Routes-000000?style=flat-square&logo=nextdotjs&logoColor=white)

- **Next.js API Routes** (REST endpoints under `app/api`)
- **Node.js** runtime with **Server Components / Server Actions**

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)

- **MongoDB Atlas** with **Mongoose ODM**

### AI
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-6E56CF?style=flat-square&logo=openai&logoColor=white)

- **Tara**, an in-app AI assistant powered via the **OpenRouter API** for report generation and natural-language queries.

---

##  Getting Started

### Prerequisites

- **Node.js** 18.18+ (or 20+ recommended)
- A **MongoDB Atlas** connection string
- An **OpenRouter API key** (for the Tara AI assistant)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/AssetFlow.git
cd AssetFlow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# MongoDB Atlas connection string
MONGODB_URI="your-mongodb-connection-string"

# OpenRouter API key for the Tara AI assistant
OPENROUTER_API_KEY="your-openrouter-api-key"
```

### 4. Start the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Log in with the demo account

| Field    | Value              |
| :------- | :----------------- |
| Email    | `demo@assetflow.com`   |
|  Password | `password123`      |

### Available Scripts

| Command         | Description                        |
| :-------------- | :--------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Create a production build          |
| `npm run start` | Run the production build           |
| `npm run lint`  | Run ESLint across the project      |

---

##  Project Structure

```
AssetFlow-Odoo-Hackathon/
├── app/
│   ├── api/                  # REST API routes (assets, allocations, transfers, ...)
│   │   ├── allocations/
│   │   ├── assets/
│   │   ├── categories/
│   │   ├── chat/             # Tara AI assistant endpoint
│   │   ├── dashboard/
│   │   ├── departments/
│   │   ├── employees/
│   │   ├── notifications/
│   │   ├── reports/
│   │   └── transfers/
│   ├── components/           # Shared UI (TaraChatbot, ThemeToggle, ...)
│   ├── dashboard/            # Authenticated app pages
│   │   ├── allocation-transfer/
│   │   ├── assets/
│   │   ├── audit/
│   │   ├── maintenance/
│   │   ├── notifications/
│   │   ├── organization-setup/
│   │   ├── reports/
│   │   └── resource-booking/
│   ├── login/                # Authentication screen
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .env                      # Environment variables (not committed)
└── package.json
```

---
## Scanner to Check

Scan the QR code below to access the application.

<p align="center">
  <img src="https://github.com/user-attachments/assets/283c94f5-31d9-4d1b-bf0e-12862ce408e6"
       alt="QR code to access the application"
       width="400" />
</p>

## Future Enhancements

-  QR Code & Barcode asset tracking expansion
-  RFID integration
-  Native mobile application
-  Multi-organization support
-  Predictive maintenance using analytics
-  Email and SMS notifications
-  Advanced approval workflows
-  Asset depreciation tracking
-  REST API integrations
-  Business Intelligence dashboards

---

##  License

This project was developed as a demonstration of an enterprise-grade Asset & Resource Management System, showcasing scalable ERP architecture, secure role-based workflows, and modern full-stack web development practices. It is intended for **educational, research, and demonstration purposes**.

<div align="center">

<br/>

**Built with ❤️ using Next.js, React & MongoDB**

</div>
