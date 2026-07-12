"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Box, CheckCircle2, CalendarClock, Wrench, ShieldCheck, ArrowRightLeft, Users, FileText, BarChart3, ChevronDown, MessageSquare } from "lucide-react";

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative overflow-clip font-sans">
      
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#714B67]/5 to-transparent">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#714B67]/20 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-[#714B67]/15 to-transparent blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-[#714B67]/10 blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-8">
        <nav className="flex items-center justify-between w-full max-w-6xl px-8 py-3.5 rounded-full bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm shadow-slate-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-odoo-50 border border-odoo-100 flex items-center justify-center shadow-sm">
              <Box className="w-4 h-4 text-odoo-600" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">AssetFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Discover</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Modules</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center">
            <Link href="/login" className="bg-slate-900 hover:bg-slate-800 px-6 py-2 rounded-full text-sm font-semibold transition-all text-white shadow-md shadow-slate-900/10">
              Sign In
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 pt-32 pb-32 max-w-5xl mx-auto">
        
        {/* Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-odoo-50 border border-odoo-200 text-sm font-bold text-odoo-700 shadow-sm">
            🚀 The Modern standard for ERP
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900"
        >
          Enterprise Asset & <br className="hidden md:block" />
          <span className="text-[#714B67]">
            Resource Management
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-500 max-w-3xl mb-12 leading-relaxed font-medium"
        >
          Simplify and digitize how your organization tracks, allocates, and maintains physical assets and shared resources through a centralized ERP platform.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24"
        >
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#714B67] to-[#5a3c52] hover:from-[#5a3c52] hover:to-[#714B67] text-white font-bold shadow-lg shadow-[#714B67]/20 transition-all transform hover:-translate-y-0.5">
            Get Started
          </Link>
          <a href="#" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-sm">
            View Live Demo
          </a>
        </motion.div>

      </main>

      {/* Horizontal Scroll Section */}
      <section ref={targetRef} className="relative h-[300vh] w-full bg-[#fafafa]">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-8 px-4 md:px-24 w-max">
            
            {/* Card 1: Asset Registration */}
            <div className="w-[85vw] md:w-[800px] h-[500px] shrink-0 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row group">
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white z-10 relative">
                <div className="w-12 h-12 rounded-2xl bg-odoo-50 border border-odoo-100 flex items-center justify-center mb-6">
                  <Box className="w-6 h-6 text-[#714B67]" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Asset Registration & Directory</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Track assets through a flexible lifecycle. Instantly see what is Available, Allocated, Reserved, or Under Maintenance.
                </p>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Auto-generated Asset Tags
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Full History & Audit Trail
                  </li>
                </ul>
              </div>
              
              <div className="hidden md:flex md:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-8 border-l border-slate-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-odoo-100 rounded-full blur-3xl opacity-40 transform group-hover:scale-110 transition-transform duration-700" />
                
                {/* Mock UI */}
                <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">AF</div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">MacBook Pro M3</div>
                        <div className="text-xs text-slate-500">AF-0012</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">Available</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-odoo-500 w-3/4 rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Condition: Excellent</span>
                      <span>Acquired: 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Conflict-Free Allocations */}
            <div className="w-[85vw] md:w-[800px] h-[500px] shrink-0 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row group">
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white z-10 relative">
                <div className="w-12 h-12 rounded-2xl bg-odoo-50 border border-odoo-100 flex items-center justify-center mb-6">
                  <ArrowRightLeft className="w-6 h-6 text-[#714B67]" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Conflict-Free Allocations</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  The system actively blocks double-allocation. Attempting to assign an already-held asset prompts a direct Transfer Request.
                </p>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Real-time Conflict Blocking
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Hand-off Approvals
                  </li>
                </ul>
              </div>
              
              <div className="hidden md:flex md:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-8 border-l border-slate-100">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-40 transform group-hover:scale-110 transition-transform duration-700" />
                
                {/* Mock UI */}
                <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm border border-rose-200 p-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4 text-rose-600 bg-rose-50 p-3 rounded-xl">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold">Allocation Blocked</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 font-medium">This asset is currently held by <strong>Priya Shah</strong>. You cannot allocate it to another user.</p>
                  <button className="w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-md">
                    Initiate Transfer Request
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Resource Booking */}
            <div className="w-[85vw] md:w-[800px] h-[500px] shrink-0 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row group">
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white z-10 relative">
                <div className="w-12 h-12 rounded-2xl bg-odoo-50 border border-odoo-100 flex items-center justify-center mb-6">
                  <CalendarClock className="w-6 h-6 text-[#714B67]" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Shared Resource Booking</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Book shared resources like meeting rooms and vehicles by time slot. Strict overlap validation completely prevents scheduling conflicts.
                </p>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Smart Overlap Validation
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Automated Reminders
                  </li>
                </ul>
              </div>
              
              <div className="hidden md:flex md:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-8 border-l border-slate-100">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-40 transform group-hover:scale-125 transition-transform duration-700" />
                
                {/* Mock UI */}
                <div className="relative w-full max-w-sm space-y-3 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between opacity-50 grayscale">
                    <div className="text-sm font-bold text-slate-900">09:00 - 10:00 AM</div>
                    <span className="text-xs font-bold text-slate-500">Booked</span>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border-2 border-odoo-500 p-4 flex items-center justify-between relative scale-105 z-10">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-odoo-500 rounded-r-md" />
                    <div className="text-sm font-bold text-odoo-700">10:00 - 11:30 AM</div>
                    <span className="px-2.5 py-1 bg-odoo-100 text-odoo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Your Slot</span>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900">11:30 - 01:00 PM</div>
                    <span className="text-xs font-bold text-emerald-500">Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Automated Audits */}
            <div className="w-[85vw] md:w-[800px] h-[500px] shrink-0 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row group">
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white z-10 relative">
                <div className="w-12 h-12 rounded-2xl bg-odoo-50 border border-odoo-100 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-[#714B67]" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Structured Audits</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Run scheduled audit cycles with assigned auditors. The system automatically generates discrepancy reports for missing or damaged items.
                </p>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Discrepancy Reporting
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-odoo-500" /> Status Auto-updates
                  </li>
                </ul>
              </div>
              
              <div className="hidden md:flex md:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-8 border-l border-slate-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-odoo-100 rounded-full blur-3xl opacity-40 transform group-hover:-translate-x-8 transition-transform duration-700" />
                
                {/* Mock UI */}
                <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Q3 HQ Audit Cycle</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">AF-0012</p>
                          <p className="text-[10px] text-slate-500">Verified</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Box className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">AF-0145</p>
                          <p className="text-[10px] text-rose-600 font-semibold">Missing - Flagged</p>
                        </div>
                      </div>
                      <button className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* 1. Trusted By (Social Proof) */}
      <section className="relative z-10 py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by Visionary Enterprises</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-extrabold text-slate-800">AcmeCorp</span>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">Global<span className="text-[#714B67]">Dynamics</span></span>
            <span className="text-2xl font-bold text-slate-800 font-serif">Stark Ind.</span>
            <span className="text-2xl font-extrabold text-slate-800 uppercase tracking-widest">Initech</span>
            <span className="text-2xl font-medium text-slate-800 italic">Soylent</span>
          </div>
        </div>
      </section>

      {/* 2. Core Modules */}
      <section className="relative z-10 py-32 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Structured Lifecycles & <br/> Centralized Booking</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Reduce manual inefficiencies with real-time visibility into who holds what, where it is, and its condition.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-odoo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Box className="w-8 h-8 text-[#714B67]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Asset Registration & Tracking</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Track assets through a flexible lifecycle (Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed) with automatic state transitions.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-odoo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <CalendarClock className="w-8 h-8 text-[#714B67]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Shared Resource Booking</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Book shared resources like meeting rooms, vehicles, and equipment by time slot, backed by strict overlap validation to prevent double-booking.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-odoo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Wrench className="w-8 h-8 text-[#714B67]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Maintenance Workflows</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Route maintenance requests through a structured approval workflow before repair work starts. Asset status auto-updates dynamically.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-odoo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-[#714B67]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Scheduled Audit Cycles</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Run structured audit cycles with assigned auditors who verify asset conditions, automatically generating discrepancy reports for missing items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. All Features */}
      <section className="relative z-10 py-32 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Core ERP Functionality</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Clean architecture and user-centric workflows designed to manage organizational assets flawlessly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Role-Based Workflows", desc: "Securely defined roles for Employees, Department Heads, and Asset Managers." },
              { icon: ArrowRightLeft, title: "Conflict Handling", desc: "System actively prevents double-allocation of a single asset across departments." },
              { icon: FileText, title: "Activity Logging", desc: "A complete, immutable audit log of who did what, and when." },
              { icon: MessageSquare, title: "Proactive Notifications", desc: "Get alerted immediately for overdue returns, bookings, and maintenance events." },
              { icon: BarChart3, title: "KPI Dashboard", desc: "Real-time snapshot of assets allocated, maintenance today, and active bookings." },
              { icon: CheckCircle2, title: "Transfer Workflows", desc: "Structured approval workflows for transferring assets between employees." }
            ].map((feat, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-lg transition-all">
                <feat.icon className="w-8 h-8 text-[#714B67] mb-6" />
                <h4 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h4>
                <p className="text-slate-500 font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Built for Any Industry */}
      <section className="relative z-10 py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#714B67]/20 to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Built for Any Industry</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium mb-12">Whether you are tracking IT hardware, heavy machinery, or office spaces, AssetFlow scales to meet your exact organizational needs without touching accounting concerns.</p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
              <span className="text-white font-bold text-sm">Equipment</span>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
              <span className="text-white font-bold text-sm">Furniture</span>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
              <span className="text-white font-bold text-sm">Vehicles</span>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
              <span className="text-white font-bold text-sm">Facilities</span>
            </div>
          </div>
          
          <Link href="/login" className="inline-block px-8 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg transition-all">
            See the Live Demo
          </Link>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="relative z-10 py-32 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-500 font-medium">Find quick answers to common questions about AssetFlow workflows.</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Can employees select their own roles when signing up?", a: "No. Security is paramount. Signup creates a standard Employee account only. An Admin must securely promote users to Department Head or Asset Manager roles via the Employee Directory." },
              { q: "What happens if two people try to book the same room?", a: "AssetFlow includes strict overlap validation. If a user attempts to book a resource during an existing reservation (e.g., 9:30–10:30 overlapping with 9:00–10:00), the system will automatically reject the request." },
              { q: "Can I allocate an asset that someone else is currently using?", a: "No, the system actively blocks double-allocation. If you try to allocate a laptop held by Priya, you will be prompted to initiate a Transfer Request instead." },
              { q: "How are maintenance requests handled?", a: "An employee raises a request detailing the issue and priority. This enters a workflow where an Asset Manager must explicitly approve it before repair work begins. The asset state updates to 'Under Maintenance'." }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-900">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </span>
                </summary>
                <div className="text-slate-500 p-6 pt-0 font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#714B67] to-[#4b3045]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 blur-[100px] rounded-full" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">Ready to Simplify <br/> Asset Management?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium mb-12">Stop losing assets and wasting time on manual paper logs. Start tracking your organization's resources securely and efficiently.</p>
          
          <Link href="/login" className="inline-block px-10 py-5 rounded-full bg-white hover:bg-slate-100 text-[#714B67] font-extrabold text-lg shadow-2xl transition-all transform hover:-translate-y-1">
            Sign up as an Employee
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-odoo-50 border border-odoo-100 flex items-center justify-center">
              <Box className="w-4 h-4 text-[#714B67]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">AssetFlow</span>
          </div>
          
          <div className="flex flex-wrap gap-8 text-sm font-semibold text-slate-500 justify-center">
            <a href="#" className="hover:text-slate-900 transition-colors">Platform</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Services</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
          
          <p className="text-sm text-slate-400 font-medium">© 2026 AssetFlow. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
