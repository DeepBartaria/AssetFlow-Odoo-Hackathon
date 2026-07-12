"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus,
  CalendarPlus,
  AlertCircle,
  Wrench,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import Sidebar from "./Sidebar";
import { apiRequest } from "../../lib/api";

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface MetricItem {
  label: string;
  value: string;
  trend: string;
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

export default function DashboardScreen() {
  const [activeRole, setActiveRole] = useState("Admin");
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const fetchDashboard = async () => {
    try {
      const res = await apiRequest("/api/dashboard");
      const d = res.data || res || {};
      
      // Let's also check active bookings from local storage if not available on backend, or count reserved assets
      const bookingsCount = d.reservedAssets || 0;

      setTimeout(() => {
        setMetrics([
          { label: "Available", value: String(d.availableAssets ?? 0), trend: "+4" },
          { label: "Allocated", value: String(d.allocatedAssets ?? 0), trend: "+12" },
          { label: "Under Maintenance", value: String(d.maintenanceAssets ?? 0), trend: "-2" },
          { label: "Active Bookings", value: String(bookingsCount), trend: "+3" },
          { label: "Pending Transfers", value: String(d.pendingTransfers ?? 0), trend: "0" },
          { label: "Upcoming Returns", value: String(d.overdueAllocations ?? 0), trend: "+1" },
        ]);
      }, 0);
    } catch {
      // ignore
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await apiRequest("/api/notifications");
      const list = res.data || res || [];
      const mapped = list.slice(0, 5).map((n: { _id: string; message: string; createdAt: string }, idx: number) => ({
        id: n._id || String(idx),
        text: n.message || "Notification",
        time: formatTime(n.createdAt)
      }));
      setTimeout(() => setRecentActivity(mapped), 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("assetflow_active_role");
    if (role) {
      setActiveRole(role);
    }
    setTimeout(() => {
      fetchDashboard();
      fetchRecentActivity();
    }, 0);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      
      {/* Sidebar */}
      <Sidebar activeItem="Dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10 overflow-y-auto bg-slate-55/50">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Today&apos;s Overview</h1>
              <p className="text-slate-500 text-sm mt-1">Here is what&apos;s happening with your assets today.</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => window.location.href = '/dashboard/resource-booking'}
                className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all card-shadow flex items-center gap-2 cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-slate-400" />
                Book Resource
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard/maintenance'}
                className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all card-shadow flex items-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-slate-400" />
                Raise Request
              </button>
              {activeRole !== "Employee" && (
                <button 
                  onClick={() => window.location.href = '/dashboard/assets'}
                  className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center gap-2 cursor-pointer animate-pulse"
                >
                  <Plus className="w-4 h-4" />
                  Register Asset
                </button>
              )}
            </div>
          </header>

          {/* Overdue Alerts */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 card-shadow"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Action Required: Overdue Returns</h3>
              <p className="text-sm text-red-600/90 mt-1">3 assets are overdue for return. They have been flagged for follow-up.</p>
            </div>
          </motion.div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 card-shadow hover:card-shadow-lg hover:-translate-y-0.5 transition-all cursor-default"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{metric.label}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{metric.value}</h2>
                    <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend.startsWith('+') ? 'text-odoo-600' : metric.trend === '0' ? 'text-slate-400' : 'text-red-600'}`}>
                      {metric.trend !== '0' && (metric.trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />)}
                      {metric.trend !== '0' ? metric.trend : '-'}
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5 tracking-tight">Recent Activity</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
              <div className="divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-odoo-500"></div>
                      <p className="text-sm font-medium text-slate-700">{activity.text}</p>
                    </div>
                    <span className="text-sm text-slate-400 font-medium whitespace-nowrap ml-4">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
