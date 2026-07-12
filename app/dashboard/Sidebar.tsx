"use client";

import { 
  LayoutDashboard, 
  Settings, 
  Box, 
  ArrowRightLeft, 
  CalendarClock, 
  Wrench, 
  ShieldCheck, 
  BarChart3, 
  Bell,
  QrCode,
  Lock,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import ThemeToggle from "../components/ThemeToggle";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: QrCode, label: "Scan Asset", href: "/dashboard/scanner" },
  { icon: Settings, label: "Organization Setup", href: "/dashboard/organization-setup" },
  { icon: Box, label: "Assets", href: "/dashboard/assets" },
  { icon: ArrowRightLeft, label: "Allocation & Transfer", href: "/dashboard/allocation-transfer" },
  { icon: CalendarClock, label: "Resource Booking", href: "/dashboard/resource-booking" },
  { icon: Wrench, label: "Maintenance", href: "/dashboard/maintenance" },
  { icon: ShieldCheck, label: "Audit", href: "/dashboard/audit" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Bell, label: "Notifications & Activity log", href: "/dashboard/notifications" },
];

interface SidebarProps {
  activeItem: string;
}

export default function Sidebar({ activeItem }: SidebarProps) {
  const [activeRole, setActiveRole] = useState("Employee");
  const [userName, setUserName] = useState("Jane Doe");
  const [isLoggedInAsAdmin, setIsLoggedInAsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("assetflow_active_role");
    if (role) {
      setActiveRole(role);
    } else {
      localStorage.setItem("assetflow_active_role", "Employee");
      setActiveRole("Employee");
    }

    const name = localStorage.getItem("assetflow_active_name");
    if (name) {
      setUserName(name);
    } else {
      localStorage.setItem("assetflow_active_name", "Jane Doe");
      setUserName("Jane Doe");
    }

    const isAdmin = localStorage.getItem("assetflow_logged_in_as_admin") === "true";
    setIsLoggedInAsAdmin(isAdmin);
  }, []);

  const getInitials = (nameStr: string) => {
    return nameStr
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoleChange = (newRole: string) => {
    localStorage.setItem("assetflow_active_role", newRole);
    setActiveRole(newRole);
    window.dispatchEvent(new Event("assetflow-role-changed"));
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("assetflow_active_role");
    localStorage.removeItem("assetflow_active_name");
    localStorage.removeItem("assetflow_logged_in_as_admin");
    window.location.href = "/login";
  };

  // Dynamically partition panels for Admin vs Users
  const filteredItems = useMemo(() => {
    if (activeRole === "Admin") {
      // Admin only sees Organization Setup, Reports, Dashboard, Notifications
      return SIDEBAR_ITEMS.filter(item => 
        ["Dashboard", "Organization Setup", "Reports", "Notifications & Activity log"].includes(item.label)
      );
    } else {
      // Non-admins see everything EXCEPT Admin-only Organization Setup
      return SIDEBAR_ITEMS.filter(item => item.label !== "Organization Setup");
    }
  }, [activeRole]);

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col p-6 hidden md:flex shrink-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-odoo-600 flex items-center justify-center shadow-sm">
          <Box className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">AssetFlow</span>
      </div>

      {/* Dynamic Role Badge */}
      <div className="mb-4">
        {activeRole === "Admin" ? (
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-950 text-white text-[10px] font-extrabold uppercase tracking-wider text-center select-none shadow-sm flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
            Admin Control Panel
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-odoo-600 border border-odoo-700 text-white text-[10px] font-extrabold uppercase tracking-wider text-center select-none shadow-sm flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-450 rounded-full animate-pulse" />
            User Work Portal
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {filteredItems.map((item, idx) => {
          const isActive = item.label === activeItem;
          
          // Role-based restrictions (only applies to Non-Admins since Admins are filtered above)
          let isLocked = false;
          const managerPages = ["Assets", "Allocation & Transfer", "Audit", "Reports"];
          if (managerPages.includes(item.label) && activeRole === "Employee") {
            isLocked = true;
          }

          if (isLocked) {
            return (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-350 cursor-not-allowed select-none"
                title="Authorization Required: Restricted to managers/admin"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-[18px] h-[18px] opacity-40" />
                  <span>{item.label}</span>
                </div>
                <Lock className="w-3.5 h-3.5 opacity-60" />
              </div>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-white text-odoo-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div className="pt-4 mt-auto">
        <ThemeToggle />
      </div>

      {/* User profile snippet */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between p-2 -mx-2 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-sm font-medium text-slate-700 select-none">
              {getInitials(userName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{activeRole}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector dropdown - only visible to System Admin */}
        {isLoggedInAsAdmin && (
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Simulate Role (Admin Impersonate)</label>
            <select
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-odoo-500 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none transition-all cursor-pointer shadow-3xs"
            >
              <option value="Admin">Admin</option>
              <option value="Asset Manager">Asset Manager</option>
              <option value="Department Head">Department Head</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
        )}
      </div>

    </aside>
  );
}
