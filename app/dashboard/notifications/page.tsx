"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  UserCheck,
  Wrench,
  CalendarClock,
  ArrowRightLeft,
  Clock,
  ShieldAlert,
  BellOff,
} from "lucide-react";
import Sidebar from "../Sidebar";

type Category = "alerts" | "approvals" | "bookings";
type Filter = "All" | "Alerts" | "Approvals" | "Bookings";

type Tone = "sky" | "emerald" | "rose" | "amber" | "red";

// Full literal class strings so Tailwind's JIT can detect them.
const TONES: Record<Tone, { dot: string; chip: string }> = {
  sky: { dot: "bg-sky-500", chip: "bg-sky-50 text-sky-600 border-sky-100" },
  emerald: { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  rose: { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-600 border-rose-100" },
  amber: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-600 border-amber-100" },
  red: { dot: "bg-red-500", chip: "bg-red-50 text-red-600 border-red-100" },
};

interface NotificationItem {
  id: number;
  text: string;
  time: string;
  category: Category;
  tone: Tone;
  icon: React.ElementType;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, text: "Laptop AF-0014 assigned to Priya Shah", time: "2m ago", category: "alerts", tone: "sky", icon: UserCheck, read: false },
  { id: 2, text: "Maintenance request AF-0055 approved", time: "18m ago", category: "approvals", tone: "emerald", icon: Wrench, read: false },
  { id: 3, text: "Booking confirmed : Room B2 : 2:00 to 3:00 PM", time: "1h ago", category: "bookings", tone: "sky", icon: CalendarClock, read: false },
  { id: 4, text: "Transfer approved : AF-0033 to facilities dept", time: "3h ago", category: "approvals", tone: "rose", icon: ArrowRightLeft, read: true },
  { id: 5, text: "Overdue return : AF-0021 was due 3 days ago", time: "1d ago", category: "alerts", tone: "amber", icon: Clock, read: true },
  { id: 6, text: "Audit discrepancy flagged : AF-0088 damaged", time: "2d ago", category: "alerts", tone: "red", icon: ShieldAlert, read: true },
];

const FILTERS: Filter[] = ["All", "Alerts", "Approvals", "Bookings"];

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const counts = useMemo(() => {
    return {
      All: notifications.length,
      Alerts: notifications.filter((n) => n.category === "alerts").length,
      Approvals: notifications.filter((n) => n.category === "approvals").length,
      Bookings: notifications.filter((n) => n.category === "bookings").length,
    } as Record<Filter, number>;
  }, [notifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const visible = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n) => n.category === activeFilter.toLowerCase());
  }, [activeFilter, notifications]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      {/* Sidebar */}
      <Sidebar activeItem="Notifications" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </span>
                Notifications
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                  : "You're all caught up."}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all card-shadow disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-4 h-4 text-emerald-500" />
                Mark all as read
              </button>
            </div>
          </header>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all shadow-sm ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full min-w-[1.25rem] font-bold ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {counts[filter]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                <BellOff className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-500">No notifications here</p>
                <p className="text-sm text-slate-400 mt-1">Nothing in this category right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                <AnimatePresence initial={false}>
                  {visible.map((n, idx) => {
                    const tone = TONES[n.tone];
                    const Icon = n.icon;
                    return (
                      <motion.button
                        key={n.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        onClick={() => toggleRead(n.id)}
                        className={`w-full text-left flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50 ${n.read ? 'bg-white' : 'bg-slate-50/50'}`}
                      >
                        {/* Icon chip */}
                        <div className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center shadow-sm ${tone.chip}`}>
                          <Icon className="w-5 h-5" strokeWidth={2.5} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : tone.dot}`} />
                          <p
                            className={`text-sm truncate ${
                              n.read
                                ? "text-slate-500 font-medium"
                                : "text-slate-900 font-bold"
                            }`}
                          >
                            {n.text}
                          </p>
                        </div>

                        {/* Time */}
                        <span className={`text-sm whitespace-nowrap ml-2 shrink-0 ${n.read ? "text-slate-400 font-medium" : "text-slate-600 font-semibold"}`}>
                          {n.time}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          <p className="text-center text-sm font-medium text-slate-400">
            Tap a notification to toggle read / unread.
          </p>

        </div>
      </main>
    </div>
  );
}
