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
<<<<<<< HEAD
  Lock,
=======
  Sparkles,
  X,
  Printer
>>>>>>> 1b75fc5f8719443f4da8700dac4f5567a7166ea5
} from "lucide-react";
import Sidebar from "../Sidebar";
import { apiRequest } from "../../../lib/api";
import ReactMarkdown from "react-markdown";

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
  const [activeRole, setActiveRole] = useState("Admin");
  const [period, setPeriod] = useState(PERIODS[0]);
  const [kpis, setKpis] = useState(KPIS);
  const [utilization, setUtilization] = useState(UTILIZATION);
  const [idleAssets, setIdleAssets] = useState(IDLE);
  const [attentionAssets, setAttentionAssets] = useState(ATTENTION);
  const [mostUsedAssets] = useState(MOST_USED);

  const [showAiModal, setShowAiModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReportContent, setAiReportContent] = useState("");

  const handleGenerateAiReport = async () => {
    setShowAiModal(true);
    setIsGeneratingAi(true);
    setAiReportContent("");

    try {
      const response = await fetch("/api/reports/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stats: {
            period,
            kpis,
            utilization,
            idleAssets,
            maintenanceTrend: MAINTENANCE,
            topAttention: attentionAssets
          }
        })
      });
      const data = await response.json();
      if (data.report) {
        setAiReportContent(data.report);
      } else {
        setAiReportContent("Failed to generate report. Please try again.");
      }
    } catch (error) {
      setAiReportContent("Error generating AI report.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePrintPdf = () => {
    // A simple window.print() that prints the current page.
    // We can use CSS media queries (@media print) to hide everything except the modal content.
    window.print();
  };

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
    const role = localStorage.getItem("assetflow_active_role");
    if (role) {
      setActiveRole(role);
    }
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

  if (activeRole === "Employee") {
    return (
      <div className="min-h-screen flex bg-[#ffffff] text-slate-800 font-sans">
        {/* Sidebar */}
        <Sidebar activeItem="Reports" />

        {/* Main Content Access Denied Card */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50 flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full text-center space-y-4 bg-white border border-slate-200 p-8 rounded-3xl card-shadow">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100 mx-auto animate-bounce">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
            <p className="text-xs font-semibold text-slate-555 leading-relaxed">
              Authorization Required: This section is restricted to Asset Managers and Department Heads.
            </p>
            <p className="text-[11px] font-bold text-slate-400">
              Please switch your Active Session Role in the sidebar to access.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-odoo-600 hover:bg-odoo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-odoo-600/10 inline-block"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

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
                className="bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-odoo-500 card-shadow cursor-pointer print:hidden"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button
                onClick={handleGenerateAiReport}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 print:hidden"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Report
              </button>
              <button
                onClick={exportCSV}
                className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 print:hidden"
              >
                <Download className="w-4 h-4" />
                Export CSV
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

          <p className="text-center text-sm font-medium text-slate-400 print:hidden">
            Analytics reflect {period.toLowerCase()} · Export downloads a CSV snapshot.
          </p>

        </div>
      </main>

      {/* AI Report Modal & Printable Area */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm print:bg-white print:static print:block print:z-0">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden print:max-h-none print:shadow-none print:rounded-none">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">AI Executive Summary</h3>
                  <p className="text-xs text-slate-500 font-medium">Generated by Tara AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrintPdf} disabled={isGeneratingAi} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2">
                  <Printer className="w-4 h-4" /> Download PDF
                </button>
                <button onClick={() => setShowAiModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-200 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Body / Print Area */}
            <div className="p-8 overflow-y-auto print:overflow-visible">
              {/* Print Only Header */}
              <div className="hidden print:block mb-8 border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-900">AssetFlow Executive Report</h1>
                <p className="text-slate-500 font-medium mt-1">Generated dynamically on {new Date().toLocaleDateString()}</p>
              </div>

              {isGeneratingAi ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 print:hidden">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <p className="font-bold text-slate-700">Analyzing operational data...</p>
                  <p className="text-sm mt-1">Tara is writing your report.</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown
                    components={{
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-100" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-600 mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-6 text-slate-600 space-y-2" {...props} />,
                      li: ({node, ...props}) => <li className="" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-slate-900 bg-slate-50 px-1 rounded" {...props} />,
                    }}
                  >
                    {aiReportContent}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Print Only Footer */}
              <div className="hidden print:block mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                End of Report · Powered by AssetFlow Intelligence
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
