"use client";

import { useMemo, useState, useEffect } from "react";
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
  Box,
  ShieldCheck,
  Users,
  History,
} from "lucide-react";
import Sidebar from "../Sidebar";
import { apiRequest } from "../../../lib/api";

type View = "notifications" | "activity";

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

type Category = "alerts" | "approvals" | "bookings";
type Filter = "All" | "Alerts" | "Approvals" | "Bookings";

type Tone = "sky" | "odoo" | "rose" | "amber" | "red";

// Full literal class strings so Tailwind's JIT can detect them.
const TONES: Record<Tone, { dot: string; chip: string }> = {
  sky: { dot: "bg-sky-500", chip: "bg-sky-50 text-sky-600 border-sky-100" },
  odoo: { dot: "bg-odoo-500", chip: "bg-odoo-50 text-odoo-600 border-odoo-100" },
  rose: { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-600 border-rose-100" },
  amber: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-600 border-amber-100" },
  red: { dot: "bg-red-500", chip: "bg-red-50 text-red-600 border-red-100" },
};

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  category: Category;
  tone: Tone;
  icon: React.ElementType;
  read: boolean;
}

const FILTERS: Filter[] = ["All", "Alerts", "Approvals", "Bookings"];

// ─── Activity Log (audit trail: who did what, when) ───────────────────────────
type ActivityCategory = "assets" | "bookings" | "maintenance" | "transfers" | "audit" | "org";

const ACTIVITY_META: Record<
  ActivityCategory,
  { label: string; icon: React.ElementType; chip: string; badge: string }
> = {
  assets: { label: "Asset", icon: Box, chip: "bg-sky-50 text-sky-600 border-sky-100", badge: "bg-sky-50 text-sky-700 border-sky-200" },
  bookings: { label: "Booking", icon: CalendarClock, chip: "bg-odoo-50 text-odoo-600 border-odoo-100", badge: "bg-odoo-50 text-odoo-700 border-odoo-200" },
  maintenance: { label: "Maintenance", icon: Wrench, chip: "bg-amber-50 text-amber-600 border-amber-100", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  transfers: { label: "Transfer", icon: ArrowRightLeft, chip: "bg-rose-50 text-rose-600 border-rose-100", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  audit: { label: "Audit", icon: ShieldCheck, chip: "bg-red-50 text-red-600 border-red-100", badge: "bg-red-50 text-red-700 border-red-200" },
  org: { label: "Organization", icon: Users, chip: "bg-violet-50 text-violet-600 border-violet-100", badge: "bg-violet-50 text-violet-700 border-violet-200" },
};

interface ActivityEntry {
  id: string;
  actor: string;
  initials: string;
  role: string;
  action: string;
  category: ActivityCategory;
  time: string;
  timestamp: number;
}

type ActivityFilter = "All" | "Assets" | "Bookings" | "Maintenance" | "Transfers" | "Audit" | "Org";

const ACTIVITY_FILTERS: { label: ActivityFilter; value: ActivityCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Assets", value: "assets" },
  { label: "Bookings", value: "bookings" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Transfers", value: "transfers" },
  { label: "Audit", value: "audit" },
  { label: "Org", value: "org" },
];

export default function NotificationsScreen() {
  const [view, setView] = useState<View>("notifications");

  // Notifications state
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Activity log state
  const [activityFilter, setActivityFilter] = useState<ActivityCategory | "all">("all");
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await apiRequest("/api/notifications");
      const list = res.data || res || [];
      const mapped = list.map((n: { _id: string; type: string; title: string; message: string; read: boolean; createdAt: string }) => {
        let Icon = UserCheck;
        let tone: Tone = "sky";
        const titleL = (n.title || "").toLowerCase();
        if (titleL.includes("maintenance") || titleL.includes("wrench")) {
          Icon = Wrench;
          tone = "odoo";
        } else if (titleL.includes("transfer") || titleL.includes("arrow")) {
          Icon = ArrowRightLeft;
          tone = "rose";
        } else if (titleL.includes("overdue") || titleL.includes("clock")) {
          Icon = Clock;
          tone = "amber";
        } else if (titleL.includes("discrepancy") || titleL.includes("alert")) {
          Icon = ShieldAlert;
          tone = "red";
        }

        return {
          id: n._id,
          text: n.message || "",
          time: formatTime(n.createdAt),
          category: (titleL.includes("booking") ? "bookings" : titleL.includes("transfer") || titleL.includes("approve") ? "approvals" : "alerts") as Category,
          tone,
          icon: Icon,
          read: n.read || false
        };
      });
      setTimeout(() => setNotifications(mapped), 0);
    } catch {
      // ignore
    }
  };

  const fetchActivityLog = async () => {
    try {
      const res = await apiRequest("/api/assets");
      const assets = res.data || res || [];
      const logs: ActivityEntry[] = [];
      assets.forEach((asset: { _id: string; assetTag?: string; tag?: string; history?: { type: string; details: string; actor?: string; date?: string }[] }) => {
        if (asset.history && Array.isArray(asset.history)) {
          asset.history.forEach((h: { type: string; details: string; actor?: string; date?: string }, idx: number) => {
            const actorName = h.actor || "Jane Doe";
            const initials = actorName
              .trim()
              .split(/\s+/)
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            let category: ActivityCategory = "assets";
            if (h.type === "Maintenance" || h.details?.toLowerCase().includes("maintenance")) {
              category = "maintenance";
            } else if (h.type === "Allocation" || h.details?.toLowerCase().includes("allocation") || h.details?.toLowerCase().includes("checkout")) {
              category = "assets";
            } else if (h.details?.toLowerCase().includes("transfer")) {
              category = "transfers";
            } else if (h.type === "Audit" || h.details?.toLowerCase().includes("audit")) {
              category = "audit";
            } else if (h.type === "Registration" || h.details?.toLowerCase().includes("register")) {
              category = "org";
            }

            logs.push({
              id: `${asset._id}-${idx}`,
              actor: actorName,
              initials,
              role: "System Actor",
              action: `${h.type}: ${h.details} (${asset.assetTag || asset.tag || "Asset"})`,
              category,
              time: h.date ? formatTime(h.date) : "Just now",
              timestamp: h.date ? new Date(h.date).getTime() : 0
            });
          });
        }
      });
      // Sort by date descending
      logs.sort((a, b) => b.timestamp - a.timestamp);
      setTimeout(() => setActivityLog(logs.slice(0, 15)), 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchNotifications();
      fetchActivityLog();
    }, 0);
  }, []);

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

  const activityCounts = useMemo(() => {
    const map: Record<string, number> = { all: activityLog.length };
    for (const e of activityLog) map[e.category] = (map[e.category] ?? 0) + 1;
    return map;
  }, [activityLog]);

  const visibleActivity = useMemo(() => {
    if (activityFilter === "all") return activityLog;
    return activityLog.filter((e) => e.category === activityFilter);
  }, [activityFilter, activityLog]);

  const markAllRead = async () => {
    try {
      await apiRequest("/api/notifications", {
        method: "PUT"
      });
      await fetchNotifications();
    } catch {
      // ignore
    }
  };

  const toggleRead = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (!notif) return;
    try {
      await apiRequest(`/api/notifications/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          read: !notif.read
        })
      });
      await fetchNotifications();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      {/* Sidebar */}
      <Sidebar activeItem="Notifications" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {view === "notifications" ? (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100">
                    <Bell className="w-5 h-5 text-odoo-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-odoo-500 ring-2 ring-white" />
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
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100">
                    <History className="w-5 h-5 text-odoo-600" />
                  </span>
                  Activity Log
                </h1>
                <p className="text-slate-500 text-sm mt-2">
                  A complete audit trail of who did what, and when.
                </p>
              </div>
            )}

            {view === "notifications" && (
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                  className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all card-shadow disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCheck className="w-4 h-4 text-odoo-500" />
                  Mark all as read
                </button>
              </div>
            )}
          </header>

          {/* View Switcher (Notifications | Activity Log) */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
            <button
              onClick={() => setView("notifications")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === "notifications"
                  ? "bg-white text-odoo-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setView("activity")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === "activity"
                  ? "bg-white text-odoo-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              }`}
            >
              <History className="w-4 h-4" />
              Activity Log
            </button>
          </div>

          {view === "notifications" ? (
            <>
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
                          ? "bg-odoo-50 text-odoo-700 border-odoo-200"
                          : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {filter}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full min-w-[1.25rem] font-bold ${
                          isActive
                            ? "bg-odoo-100 text-odoo-700"
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
            </>
          ) : (
            <>
              {/* Activity category filters */}
              <div className="flex flex-wrap items-center gap-2">
                {ACTIVITY_FILTERS.map((f) => {
                  const isActive = activityFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setActivityFilter(f.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all shadow-sm ${
                        isActive
                          ? "bg-odoo-50 text-odoo-700 border-odoo-200"
                          : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {f.label}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full min-w-[1.25rem] font-bold ${
                          isActive
                            ? "bg-odoo-100 text-odoo-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {activityCounts[f.value] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Activity Log List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
                {visibleActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                    <History className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-500">No activity here</p>
                    <p className="text-sm text-slate-400 mt-1">Nothing logged in this category yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    <AnimatePresence initial={false}>
                      {visibleActivity.map((e, idx) => {
                        const meta = ACTIVITY_META[e.category];
                        const Icon = meta.icon;
                        return (
                          <motion.div
                            key={e.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, delay: idx * 0.03 }}
                            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                          >
                            {/* Category icon chip */}
                            <div className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center shadow-sm ${meta.chip}`}>
                              <Icon className="w-5 h-5" strokeWidth={2.5} />
                            </div>

                            {/* Who did what */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-700 leading-snug">
                                <span className="font-bold text-slate-900">{e.actor}</span>
                                <span className="text-slate-400 font-medium"> · {e.role}</span>
                              </p>
                              <p className="text-sm text-slate-600 truncate mt-0.5">{e.action}</p>
                            </div>

                            {/* Entity badge + when */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${meta.badge}`}>
                                {meta.label}
                              </span>
                              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{e.time}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <p className="text-center text-sm font-medium text-slate-400">
                Activity logs are read-only and capture every action across AssetFlow.
              </p>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
