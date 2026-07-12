"use client";

import { useState } from "react";
import Sidebar from "../Sidebar";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ArrowRightLeft, Undo2, Laptop, Wrench, User, Box } from "lucide-react";

export default function ScannerPage() {
  const [scannedAsset, setScannedAsset] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      setScannedAsset(result[0].rawValue);
    }
  };

  const closeOverlay = () => {
    setScannedAsset(null);
  };

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      <Sidebar activeItem="Scan Asset" />

      <main className="flex-1 relative overflow-hidden bg-slate-50/50 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full">
           <header className="mb-8 text-center">
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Scan Asset QR</h1>
             <p className="text-slate-500 mt-2 font-medium">Point your camera at an AssetFlow QR code to pull up its digital twin.</p>
           </header>
           
           <div className="bg-slate-900 p-2 md:p-4 rounded-[2rem] shadow-2xl overflow-hidden relative aspect-square md:aspect-video flex items-center justify-center ring-1 ring-slate-800">
             {!scannedAsset ? (
               <Scanner 
                 onScan={handleScan}
                 formats={['qr_code']}
                 styles={{ container: { width: '100%', height: '100%', borderRadius: '1.5rem', overflow: 'hidden' } }}
               />
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-500">
                 <Box className="w-16 h-16 mb-4 opacity-50" />
                 <p className="font-medium">Scanner Paused</p>
               </div>
             )}
             
             {/* Scanner Overlay UI */}
             {!scannedAsset && (
               <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                 <div className="w-48 h-48 sm:w-64 sm:h-64 border-2 border-white/50 rounded-3xl relative">
                   {/* Corner Accents */}
                   <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-odoo-500 rounded-tl-3xl" />
                   <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-odoo-500 rounded-tr-3xl" />
                   <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-odoo-500 rounded-bl-3xl" />
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-odoo-500 rounded-br-3xl" />
                 </div>
                 <p className="mt-6 text-white/70 text-sm font-semibold tracking-widest uppercase">Align QR Code</p>
               </div>
             )}
           </div>
        </div>

        {/* Digital Twin Overlay */}
        <AnimatePresence>
          {scannedAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm"
              onClick={closeOverlay}
            >
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-odoo-100 flex items-center justify-center text-odoo-600 shadow-inner">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">MacBook Pro M3 Max</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-slate-500">{scannedAsset}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Active</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={closeOverlay} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  
                  {/* Current Owner */}
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Current Allocation</h3>
                    <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        PS
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">Priya Shah</p>
                        <p className="text-xs font-medium text-slate-500">Engineering Dept</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-400">Assigned On</p>
                        <p className="text-sm font-bold text-slate-700">Oct 12, 2025</p>
                      </div>
                    </div>
                  </section>

                  {/* Quick Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Warranty</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">Valid</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Expires Jan 2027</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <Wrench className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Condition</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">Good</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Last audited 2mo ago</p>
                    </div>
                  </div>

                  {/* Maintenance History */}
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recent History</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Wrench className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Battery Replacement</p>
                          <p className="text-xs text-slate-500 font-medium">Apple Care Service • Mar 15, 2026</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Transferred from IT Pool</p>
                          <p className="text-xs text-slate-500 font-medium">Assigned to Priya Shah • Oct 12, 2025</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                  <button className="flex-1 bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-slate-700 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <Undo2 className="w-4 h-4" />
                    Log Return
                  </button>
                  <button className="flex-1 bg-odoo-600 hover:bg-odoo-700 shadow-md shadow-odoo-600/20 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Asset
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
