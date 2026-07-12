"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Box } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0514] text-white relative overflow-hidden font-sans">
      
      {/* Background Starry/Noise Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/30 blur-[150px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-emerald-500/10 blur-[100px]" />
        {/* Subtle overlay grid for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBoMjBWMHptMTkgMTlIMVYxSDE5eiIgZmlsbD0icmdiYSgyNTUsIDI1NSLCAyNTUsIDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AssetFlow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors">Discover</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Modules</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-6 py-2.5 rounded-full text-sm font-medium transition-all">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-32 max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
        >
          Simplify Asset Tracking with <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            Intelligent ERP
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mb-10 leading-relaxed"
        >
          Digitize your physical assets, centralize resource bookings, and streamline maintenance workflows for your entire organization.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <a href="#" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md text-white font-medium transition-all shadow-lg">
            Try for free
          </a>
          <Link href="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105">
            Get Started
          </Link>
        </motion.div>

        {/* 3D Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-4xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-transparent to-transparent z-10 bottom-0 h-32 mt-auto" />
          <Image 
            src="/hero-3d.png" 
            alt="AssetFlow 3D Concept" 
            width={1200} 
            height={800} 
            className="w-full h-auto object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_50px_rgba(124,58,237,0.3)]"
            priority
          />
        </motion.div>
      </main>

    </div>
  );
}
