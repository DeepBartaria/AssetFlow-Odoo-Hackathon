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
  Bell
} from "lucide-react";
import Link from "next/link";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Settings, label: "Organization Setup", href: "/dashboard/organization-setup" },
  { icon: Box, label: "Assets", href: "/dashboard/assets" },
  { icon: ArrowRightLeft, label: "Allocation & Transfer", href: "/dashboard/allocation-transfer" },
  { icon: CalendarClock, label: "Resource Booking", href: "/dashboard/resource-booking" },
  { icon: Wrench, label: "Maintenance", href: "/dashboard/maintenance" },
  { icon: ShieldCheck, label: "Audit", href: "/dashboard/audit" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
];

interface SidebarProps {
  activeItem: string;
}

export default function Sidebar({ activeItem }: SidebarProps) {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col p-6 hidden md:flex shrink-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-odoo-600 flex items-center justify-center shadow-sm">
          <Box className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">AssetFlow</span>
      </div>

      <nav className="flex-1 space-y-1">
        {SIDEBAR_ITEMS.map((item, idx) => {
          const isActive = item.label === activeItem;
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

      {/* User profile snippet */}
      <div className="pt-6 border-t border-slate-200 mt-auto flex items-center gap-3 cursor-pointer group hover:bg-slate-100 p-2 -mx-2 rounded-lg transition-colors">
        <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-sm font-medium text-slate-700">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-odoo-600 transition-colors">Jane Doe</p>
          <p className="text-xs text-slate-500 truncate">Employee</p>
        </div>
      </div>
    </aside>
  );
}
