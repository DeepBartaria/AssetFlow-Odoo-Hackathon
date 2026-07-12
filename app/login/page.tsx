"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, User, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fafafa]">
      
      {/* Subtle modern background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-emerald-50 to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/50 blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-4"
      >
        <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5">
              <LogIn className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-slate-500 text-sm px-2 font-medium leading-relaxed">
              {isLogin 
                ? "Manage your enterprise assets and resources seamlessly in one place." 
                : "Register a new employee account to access the corporate directory."}
            </p>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}
            >
              {!isLogin && (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-12 pr-4 py-3 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-12 pr-4 py-3 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-12 pr-12 py-3 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  required
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end pt-1 pb-3">
                  <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-slate-900/20 mt-4"
              >
                {isLogin ? "Sign in to AssetFlow" : "Create Account"}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Social Logins */}
          {isLogin && (
            <div className="mt-8">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Or continue with</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <button className="w-full h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                  <span className="font-bold text-slate-700 text-sm">Google</span>
                </button>
                <button className="w-full h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                  <span className="font-bold text-slate-700 text-sm">Apple</span>
                </button>
              </div>
            </div>
          )}

          {/* Toggle between login and signup */}
          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            {isLogin ? (
               <span>
                 New to AssetFlow?{" "}
                 <button onClick={() => setIsLogin(false)} className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                   Sign up
                 </button>
               </span>
            ) : (
               <span>
                 Already have an account?{" "}
                 <button onClick={() => setIsLogin(true)} className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                   Sign in
                 </button>
               </span>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
