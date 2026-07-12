"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wrench,
  Clock,
  Box,
  CalendarClock,
  Building2,
  Download,
  Activity,
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../Sidebar";
import { apiRequest } from "../../../lib/api";

// ─── Data (front-end mock, mirrors the rest of the app) ───────────────────────

const KPIS = [
  { label: "Overall Utilization", value: "71%", trend: "+5%", icon: Activity },
  { label: "Assets Tracked", value: "204", trend: "+8", icon: Box },
  { label: "Avg. Maintenance / mo", value: "7.3", trend: "+1.2", icon: Wrench },
  { label: "Idle Assets", value: "12", trend: "-3", icon: Clock },
];

const UTILIZATION = [
  { dept: "Eng", value: 82 },
  { dept: "IT", value: 90 },
  { dept: "Sales", value: 71 },
  { dept: "Facilities", value: 64 },
  { dept: "Ops", value: 56 },
  { dept: "Field", value: 48 },
];

const MAINTENANCE = [
  { m: "Feb", v: 4 },
  { m: "Mar", v: 6 },
  { m: "Apr", v: 5 },
  { m: "May", v: 9 },
  { m: "Jun", v: 8 },
  { m: "Jul", v: 12 },
];

const MOST_USED = [
  { name: "Room B2", meta: "34 bookings this month", tag: "AF-B002" },
  { name: "Van", meta: "21 trips this month", tag: "AF-0343" },
  { name: "Projector", meta: "18 uses this month", tag: "AF-0335" },
];

const IDLE = [
  { name: "Camera", meta: "Unused 60+ days", tag: "AF-0301" },
  { name: "Office Chair", meta: "Unused 45 days", tag: "AF-0410" },
  { name: "Monitor", meta: "Unused 38 days", tag: "AF-0290" },
];

type AttnTone = "amber" | "red";
const ATTENTION: { name: string; note: string; tag: string; tone: AttnTone; icon: React.ElementType }[] = [
  { name: "Forklift", note: "Service due in 5 days", tag: "AF-0087", tone: "amber", icon: Wrench },
  { name: "AC Unit", note: "Service due in 9 days", tag: "AF-0044", tone: "amber", icon: Wrench },
  { name: "Laptop", note: "4 years old · nearing retirement", tag: "AF-0020", tone: "red", icon: AlertCircle },
];

const ATTN_TONE: Record<AttnTone, { chip: string; badge: string }> = {
  amber: { chip: "bg-amber-50 text-amber-600 border-amber-100", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  red: { chip: "bg-red-50 text-red-600 border-red-100", badge: "bg-red-50 text-red-700 border-red-200" },
};

// Booking heatmap (peak usage windows)
const HOURS = ["9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p"];
const HEAT: { day: string; cells: number[] }[] = [
  { day: "Mon", cells: [1, 3, 4, 2, 1, 3, 5, 3, 1] },
  { day: "Tue", cells: [2, 4, 3, 1, 2, 4, 4, 2, 1] },
  { day: "Wed", cells: [1, 2, 5, 3, 1, 5, 5, 4, 2] },
  { day: "Thu", cells: [0, 3, 4, 2, 2, 3, 4, 3, 1] },
  { day: "Fri", cells: [1, 2, 3, 1, 1, 4, 3, 2, 0] },
];
// Full literal class strings so Tailwind's JIT keeps them.
const HEAT_CLASS = ["bg-slate-100", "bg-odoo-100", "bg-odoo-200", "bg-odoo-300", "bg-odoo-400", "bg-odoo-500"];

const PERIODS = ["This Month", "This Quarter", "This Year"];

// ─── Reusable panel ───────────────────────────────────────────────────────────

function Panel({
  title,
  icon: Icon,
  subtitle,
  children,
  delay = 0,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-white border border-slate-200 rounded-2xl card-shadow overflow-hidden ${className}`}
    >
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 tracking-tight">
          <Icon className="w-4 h-4 text-odoo-600" />
          {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </motion.section>
  );
}

export default function ReportsScreen() {
  const [period, setPeriod] = useState(PERIODS[0]);
  const [kpis, setKpis] = useState(KPIS);
  const [utilization, setUtilization] = useState(UTILIZATION);
  const [idleAssets, setIdleAssets] = useState(IDLE);
  const [attentionAssets, setAttentionAssets] = useState(ATTENTION);
  const [mostUsedAssets] = useState(MOST_USED);

  const fetchReportData = async () => {
    try {
      const [assetsList, allocationsList] = await Promise.all([
        apiRequest("/api/reports/assets"),
        apiRequest("/api/reports/allocations")
      ]);
      const assets = assetsList.data || assetsList || [];
      const allocations = allocationsList.data || allocationsList || [];

      // Compute KPIs
      const total = assets.length;
      const allocated = assets.filter((a: { status: string }) => a.status === "Allocated").length;
      const maintenance = assets.filter((a: { status: string }) => a.status === "Under Maintenance").length;
      const available = assets.filter((a: { status: string }) => a.status === "Available").length;
      const utilizationPercent = total > 0 ? Math.round((allocated / total) * 100) : 0;

      // Group by department for Utilization chart
      const deptAllocCounts: Record<string, number> = {};
      allocations.forEach((alloc: { status: string; department?: { name: string } }) => {
        if (alloc.status === "Active" || alloc.status === "Overdue") {
          const deptName = alloc.department?.name || "Other";
          deptAllocCounts[deptName] = (deptAllocCounts[deptName] || 0) + 1;
        }
      });
      const utilizationChart = Object.entries(deptAllocCounts).map(([dept, val]) => ({
        dept: dept.slice(0, 5),
        value: total > 0 ? Math.round((val / total) * 100) : 0
      })).slice(0, 6);

      // Idle assets
      const idleMapped = assets
        .filter((a: { status: string; location?: string }) => a.status === "Available")
        .slice(0, 3)
        .map((a: { name: string; assetTag: string; location?: string }) => ({
          name: a.name,
          tag: a.assetTag,
          meta: a.location ? `In ${a.location}` : "Available"
        }));

      // Attention assets
      const attentionMapped = assets
        .filter((a: { status: string; condition: string }) => a.status === "Under Maintenance" || a.condition === "Poor")
        .slice(0, 3)
        .map((a: { name: string; assetTag: string; status: string }) => ({
          name: a.name,
          tag: a.assetTag,
          note: a.status === "Under Maintenance" ? "bulb / parts replacement or service ongoing" : "Condition reported as Poor.",
          tone: (a.status === "Under Maintenance" ? "amber" : "red") as "amber" | "red",
          icon: Wrench
        }));

      setTimeout(() => {
        setKpis([
          { label: "Overall Utilization", value: `${utilizationPercent}%`, trend: "+5%", icon: Activity },
          { label: "Assets Tracked", value: String(total), trend: "+8", icon: Box },
          { label: "Avg. Maintenance / mo", value: String(maintenance), trend: "+1.2", icon: Wrench },
          { label: "Idle Assets", value: String(available), trend: "-3", icon: Clock },
        ]);
        if (utilizationChart.length > 0) {
          setUtilization(utilizationChart);
        }
        if (idleMapped.length > 0) {
          setIdleAssets(idleMapped);
        }
        if (attentionMapped.length > 0) {
          setAttentionAssets(attentionMapped);
        }
      }, 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchReportData();
    }, 0);
  }, []);

  // Maintenance line chart geometry (0-100 viewBox)
  const { linePath, areaPath } = useMemo(() => {
    const max = 14;
    const pts = MAINTENANCE.map((d, i) => ({
      x: (i / (MAINTENANCE.length - 1)) * 100,
      y: 100 - (d.v / max) * 100,
    }));
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `M 0 100 ` + pts.map((p) => `L ${p.x} ${p.y}`).join(" ") + ` L 100 100 Z`;
    return { linePath, areaPath };
  }, []);

  const exportCSV = () => {
    const rows: string[][] = [["Section", "Item", "Metric"]];
    utilization.forEach((d) => rows.push(["Utilization by Dept", d.dept, `${d.value}%`]));
    MAINTENANCE.forEach((d) => rows.push(["Maintenance Frequency", d.m, String(d.v)]));
    mostUsedAssets.forEach((d) => rows.push(["Most Used", `${d.name} (${d.tag})`, d.meta]));
    idleAssets.forEach((d) => rows.push(["Idle Assets", `${d.name} (${d.tag})`, d.meta]));
    attentionAssets.forEach((d) => rows.push(["Needs Attention", `${d.name} (${d.tag})`, d.note]));

    const csv = rows
      .map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assetflow-report-${period.toLowerCase().replace(/\s+/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      {/* Sidebar */}
      <Sidebar activeItem="Reports" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100">
                  <BarChart3 className="w-5 h-5 text-odoo-600" />
                </span>
                Reports &amp; Analytics
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Operational insight across utilization, maintenance, and bookings.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-odoo-500 card-shadow cursor-pointer"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </header>

          {/* KPI summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              const positive = kpi.trend.startsWith("+");
              const neutralIdle = kpi.label === "Idle Assets"; // fewer idle assets is good, but keep it simple/visual
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 card-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-odoo-50 border border-odoo-100">
                      <Icon className="w-4 h-4 text-odoo-600" />
                    </span>
                    <span
                      className={`flex items-center gap-1 text-xs font-bold ${
                        positive ? "text-odoo-600" : neutralIdle ? "text-odoo-600" : "text-red-600"
                      }`}
                    >
                      {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {kpi.trend}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</h2>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{kpi.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Utilization by department */}
            <Panel title="Utilization by Department" icon={Building2} subtitle="Share of assets actively in use" delay={0.05}>
              <div className="h-56 flex items-end gap-2 sm:gap-3 pt-6">
                {utilization.map((d, i) => (
                  <div key={d.dept} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                    <div className="relative w-full flex-1 flex items-end justify-center">
                      <motion.div
                        initial={{ height: "0%" }}
                        animate={{ height: `${d.value}%` }}
                        transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                        className="w-full max-w-[2.75rem] rounded-t-lg bg-gradient-to-t from-odoo-500 to-odoo-400 relative"
                      >
                        <span className="absolute -top-5 left-0 right-0 text-center text-xs font-bold text-slate-600">
                          {d.value}
                        </span>
                      </motion.div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 text-center w-full truncate">{d.dept}</span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Maintenance frequency */}
            <Panel title="Maintenance Frequency" icon={TrendingUp} subtitle="Requests resolved per month" delay={0.1}>
              <div className="h-56 flex flex-col">
                <div className="relative flex-1">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="maintFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* gridlines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                      <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
                    ))}
                    <motion.path
                      d={areaPath}
                      fill="url(#maintFill)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                    <motion.path
                      d={linePath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
                <div className="flex justify-between pt-3">
                  {MAINTENANCE.map((d) => (
                    <span key={d.m} className="text-[11px] font-medium text-slate-500">{d.m}</span>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          {/* Most used / Idle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Panel title="Most Used Assets" icon={TrendingUp} delay={0.05}>
              <ul className="space-y-1">
                {mostUsedAssets.map((a, i) => (
                  <li key={a.tag} className="flex items-center gap-4 py-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-odoo-50 border border-odoo-100 text-xs font-bold text-odoo-700 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {a.name} <span className="text-slate-400 font-medium">· {a.tag}</span>
                      </p>
                      <p className="text-xs text-slate-500">{a.meta}</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-odoo-500 shrink-0" />
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Idle Assets" icon={Clock} delay={0.1}>
              <ul className="space-y-1">
                {idleAssets.map((a) => (
                  <li key={a.tag} className="flex items-center gap-4 py-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
                      <Box className="w-4 h-4 text-slate-400" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {a.name} <span className="text-slate-400 font-medium">· {a.tag}</span>
                      </p>
                      <p className="text-xs text-slate-500">{a.meta}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5 shrink-0">
                      Idle
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* Booking heatmap */}
          <Panel title="Resource Booking Heatmap" icon={CalendarClock} subtitle="Peak usage windows across the week" delay={0.05}>
            <div className="space-y-1.5">
              {/* hours header */}
              <div className="flex items-center gap-1.5">
                <span className="w-10 shrink-0" />
                {HOURS.map((h) => (
                  <span key={h} className="flex-1 text-center text-[10px] font-medium text-slate-400">{h}</span>
                ))}
              </div>
              {HEAT.map((row, r) => (
                <div key={row.day} className="flex items-center gap-1.5">
                  <span className="w-10 shrink-0 text-xs font-semibold text-slate-500 text-right pr-1">{row.day}</span>
                  {row.cells.map((v, c) => (
                    <motion.div
                      key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: (r * HOURS.length + c) * 0.008 }}
                      title={`${row.day} ${HOURS[c]} · ${v} bookings`}
                      className={`flex-1 aspect-square rounded-md border border-slate-200/60 ${HEAT_CLASS[v]}`}
                    />
                  ))}
                </div>
              ))}
              {/* legend */}
              <div className="flex items-center justify-end gap-1.5 pt-3">
                <span className="text-[10px] font-medium text-slate-400">Less</span>
                {HEAT_CLASS.map((cls) => (
                  <span key={cls} className={`w-3.5 h-3.5 rounded-sm border border-slate-200/60 ${cls}`} />
                ))}
                <span className="text-[10px] font-medium text-slate-400">More</span>
              </div>
            </div>
          </Panel>

          {/* Assets needing attention */}
          <Panel title="Due for Maintenance / Nearing Retirement" icon={PackageCheck} delay={0.05} className="!p-0">
            <div className="divide-y divide-slate-100 -m-5 sm:-m-6">
              {attentionAssets.map((a) => {
                const tone = ATTN_TONE[a.tone];
                const Icon = a.icon;
                return (
                  <div key={a.tag} className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center shadow-sm ${tone.chip}`}>
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {a.name} <span className="text-slate-400 font-medium">· {a.tag}</span>
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5">{a.note}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${tone.badge}`}>
                      {a.tone === "red" ? "Retire soon" : "Service due"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <p className="text-center text-sm font-medium text-slate-400">
            Analytics reflect {period.toLowerCase()} · Export downloads a CSV snapshot.
          </p>

        </div>
      </main>
    </div>
  );
}
