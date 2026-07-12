# AssetFlow - Enterprise Asset & Resource Management System

AssetFlow is a modern Enterprise Asset & Resource Management System developed to simplify and digitize how organizations track, allocate, and maintain their physical assets and shared resources through a centralized ERP platform. 

This platform is designed to be industry-agnostic—whether an organization manages IT equipment, furniture, corporate vehicles, or shared facilities (such as offices, schools, hospitals, or factories), AssetFlow provides the structured workflows necessary to eliminate manual tracking inefficiencies.

---

## Overview and Problem Statement

Organizations relying on manual tracking (spreadsheets, paper logs, ad-hoc emails) often suffer from:
- Asset misplacement and lack of operational visibility.
- Double-allocation of resources and booking conflicts.
- Unstructured maintenance routing leading to delayed repairs.
- Inaccurate audits and unflagged discrepancies.

AssetFlow resolves these issues by delivering core ERP functionality. It focuses on clean architecture, secure role-based workflows, and scalable module design without touching purchasing, invoicing, or accounting concerns. It provides real-time visibility into who holds an asset, where it is located, and its current condition.

---

## Core System Modules

### 1. Organization Setup
The foundation of the ERP system requires structured master data:
- **Department Management:** Create, edit, and deactivate departments. Assign Department Heads and establish hierarchical relationships (Parent Departments).
- **Asset Categories:** Define global categories (e.g., Electronics, Furniture, Vehicles) and configure optional category-specific metadata fields.
- **Employee Directory:** Centralized record of employee data. Administrators utilize this directory to promote standard employees to specialized roles (Department Head, Asset Manager).

### 2. Asset Registration & Directory
A centralized hub for searching and tracking organizational assets:
- **Registration:** Capture detailed asset information including auto-generated Asset Tags, Serial Numbers, Acquisition Data, Condition, and Location.
- **Lifecycle Tracking:** Assets exist within a strict state machine. Valid states include: Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed.
- **Historical Data:** Maintain an immutable ledger of an asset's allocation history and maintenance records.

### 3. Asset Allocation & Transfer
Manage custody and enforce explicit conflict resolution rules:
- **Allocation:** Assign assets to employees or departments with an expected return date.
- **Conflict Prevention:** The system strictly prevents double-allocation. If an asset is currently held, users are routed to a structured "Transfer Request" workflow rather than allowing an override.
- **Return Workflow:** Process asset returns, capture check-in condition notes, and automatically revert the asset status back to "Available". Overdue returns trigger automated system alerts.

### 4. Resource Booking
Time-slot booking for shared organizational resources:
- **Calendar Integration:** View existing bookings for shared assets (e.g., meeting rooms, shared fleet vehicles).
- **Overlap Validation:** The system strictly validates time-slots and automatically rejects overlapping booking requests.
- **Lifecycle:** Manage bookings through states (Upcoming, Ongoing, Completed, Cancelled) with automated pre-booking reminders.

### 5. Maintenance Management
Route repair requests through a formal approval hierarchy before work commences:
- **Request Workflows:** Users raise requests detailing the issue and priority.
- **Approval Chain:** Requests move from Pending to Approved/Rejected (by Asset Managers), followed by Technician Assignment, In-Progress, and Resolution.
- **Automated State Changes:** Asset status automatically shifts to "Under Maintenance" upon approval, and reverts to "Available" once the ticket is resolved.

### 6. Asset Audit Cycle
Execute structured, cycle-based verification rather than ad-hoc checks:
- **Cycle Generation:** Define an audit scope by department, location, and date range.
- **Verification:** Assigned auditors physically verify items, marking them as Verified, Missing, or Damaged.
- **Discrepancy Reporting:** The system auto-generates discrepancy reports for flagged items. Closing the audit cycle securely locks the records and updates affected asset statuses accordingly (e.g., transitioning missing items to "Lost").

### 7. Dashboards, Reports, & Notifications
Provide operational intelligence across all organizational tiers:
- **KPI Dashboards:** Real-time visibility into Assets Available, Overdue Returns, Maintenance Loads, and Active Bookings.
- **Analytics:** Exportable reports detailing asset utilization trends, maintenance frequency, and resource booking heatmaps.
- **Activity Logging:** A comprehensive audit log tracks all administrative and employee actions to ensure absolute accountability.

---

## Role-Based Access Control (RBAC)

The system enforces strict role boundaries:

- **Administrator:** Provisions the master organization data (departments, categories) and assigns elevated roles from the standard employee directory.
- **Asset Manager:** Responsible for registering and allocating assets, approving transfers, authorizing maintenance requests, and overseeing audit discrepancy resolutions.
- **Department Head:** Possesses visibility over their department's allocated assets, approves internal transfer requests, and books shared resources on behalf of their department.
- **Employee:** Can view assets assigned to them, book shared resources, raise maintenance requests, and initiate transfer or return workflows.

---

## Technical Architecture

### Frontend
- React.js & Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend & Infrastructure
- Node.js & Express.js architecture principles (Next.js Server Actions/APIs)
- MongoDB
- JWT Authentication

---

## Local Development Setup

To run the system locally for development or demonstration purposes:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AssetFlow.git
   ```

2. Navigate to the project directory:
   ```bash
   cd AssetFlow
   ```

3. Install all dependencies:
   ```bash
   npm install
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`.

---

## License & Acknowledgements

Developed to demonstrate an enterprise-grade Asset & Resource Management System with modern web technologies, showcasing scalable ERP architecture and secure role-based workflows.