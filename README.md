# 🚀 AssetFlow - Enterprise Asset & Resource Management System

AssetFlow is a modern Enterprise Asset & Resource Management System developed for the **Odoo Hackathon**. It helps organizations efficiently manage physical assets, shared resources, maintenance workflows, audits, and employee allocations through a centralized platform.

---

## 📌 Overview

Managing company assets manually using spreadsheets and paper records often leads to:

- Asset misplacement
- Double allocation
- Maintenance delays
- Booking conflicts
- Lack of operational visibility

AssetFlow digitizes the complete asset lifecycle and provides a centralized dashboard for managing assets across departments.

---

## ✨ Features

### 🔐 Authentication

- Secure Login
- User Registration
- Role-Based Access Control (RBAC)

### 👥 User Roles

- Admin
- Asset Manager
- Department Head
- Employee

---

## 🏢 Organization Setup

- Department Management
- Employee Directory
- Asset Categories
- Role Assignment

---

## 💻 Asset Management

- Register Assets
- Auto Generated Asset ID
- Asset Categories
- Asset Images
- Asset Location
- Asset Status Tracking
- Asset Search & Filters
- Asset History

Asset Status includes:

- Available
- Allocated
- Reserved
- Under Maintenance
- Lost
- Retired
- Disposed

---

## 🔄 Asset Allocation

- Allocate Asset
- Transfer Asset
- Return Asset
- Conflict Detection
- Prevent Double Allocation
- Expected Return Date

---

## 📅 Resource Booking

Book shared resources like:

- Meeting Rooms
- Vehicles
- Projectors
- Equipment

Features:

- Calendar View
- Time Slot Booking
- Overlap Validation
- Booking Reminder
- Cancel / Reschedule Booking

---

## 🛠 Maintenance Management

Maintenance Workflow

```
Pending
    ↓
Approved
    ↓
Technician Assigned
    ↓
In Progress
    ↓
Resolved
```

Features

- Raise Maintenance Request
- Attach Images
- Priority Levels
- Technician Assignment
- Maintenance History

---

## ✅ Asset Audit

Audit Workflow

- Create Audit Cycle
- Assign Auditors
- Verify Assets
- Mark Assets as:
  - Verified
  - Missing
  - Damaged
- Auto Generate Discrepancy Report
- Close Audit Cycle

---

## 📊 Dashboard

Dashboard provides:

- Assets Available
- Assets Allocated
- Active Bookings
- Pending Transfers
- Maintenance Requests
- Upcoming Returns
- Notifications

---

## 📈 Reports

Generate reports for:

- Asset Utilization
- Maintenance History
- Department Allocation
- Resource Booking
- Audit Reports

Export formats:

- PDF
- Excel
- CSV

---

## 🔔 Notifications

Receive notifications for:

- Asset Assigned
- Transfer Approved
- Booking Confirmed
- Booking Reminder
- Maintenance Approved
- Maintenance Completed
- Audit Completed
- Overdue Returns

---

## 🏗 Tech Stack

### Frontend

- React.js
- TypeScript
- Tailwind CSS
- Next.js

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Authentication

- JWT Authentication

### Version Control

- Git
- GitHub

---

## 📂 Project Structure

```
AssetFlow/
│
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── assets/
│   ├── allocation/
│   ├── maintenance/
│   ├── booking/
│   ├── audit/
│   └── reports/
│
├── components/
│
├── lib/
│
├── models/
│
├── public/
│
├── styles/
│
├── package.json
└── README.md
```

---

## ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/AssetFlow.git
```

Move into the project directory

```bash
cd AssetFlow
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:3000
```

---

## 📌 Business Workflow

```
Admin
    │
    ▼
Create Departments
    │
    ▼
Register Employees
    │
    ▼
Register Assets
    │
    ▼
Allocate Assets
    │
    ▼
Book Shared Resources
    │
    ▼
Raise Maintenance Request
    │
    ▼
Approve Maintenance
    │
    ▼
Conduct Asset Audit
    │
    ▼
Generate Reports
```

---

## 🎯 Future Enhancements

- QR Code Asset Tracking
- Barcode Scanner
- Email Notifications
- Mobile Application
- AI Asset Recommendation
- Predictive Maintenance
- OCR Document Upload
- Interactive Analytics Dashboard

---

## 👨‍💻 Team Members

- Member 1 – Authentication & Organization Setup
- Member 2 – Asset Management
- Member 3 – Allocation & Resource Booking
- Member 4 – Maintenance, Audit & Reports

---

## 📄 License

This project was developed for the **Odoo Hackathon** and is intended for educational and demonstration purposes.

---

## ⭐ Acknowledgements

Developed as part of the **Odoo Hackathon** to demonstrate an enterprise-grade Asset & Resource Management System with modern web technologies.