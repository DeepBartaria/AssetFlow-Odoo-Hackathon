"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
<<<<<<< HEAD
import { LogIn, Mail, Lock, User, EyeOff, Eye } from "lucide-react";
=======
import { LogIn, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
>>>>>>> 1b75fc5f8719443f4da8700dac4f5567a7166ea5
import StarfieldBackground from "@/components/StarfieldBackground";
import { apiRequest } from "../../lib/api";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
<<<<<<< HEAD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isLogin) {
      // 1. Admin login override
      if (email.trim().toLowerCase() === "admin@assetflow.com" && password === "admin123") {
        localStorage.setItem("assetflow_active_role", "Admin");
        localStorage.setItem("assetflow_active_name", "System Admin");
        localStorage.setItem("assetflow_logged_in_as_admin", "true");
        setSuccessMsg("Successfully logged in as System Admin.");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
        return;
      }

      // 2. Fetch Employee list for verification
      try {
        const res = await apiRequest("/api/employees");
        const list = res.data || res || [];
        const employee = list.find((emp: any) => emp.email.trim().toLowerCase() === email.trim().toLowerCase());

        if (employee) {
          localStorage.setItem("assetflow_active_role", employee.role);
          localStorage.setItem("assetflow_active_name", employee.name);
          localStorage.setItem("assetflow_logged_in_as_admin", "false");
          setSuccessMsg(`Welcome back, ${employee.name}!`);
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 800);
        } else {
          setErrorMsg("Login failed: email address not found in the employee directory.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to contact database directory.");
      }
    } else {
      // Signup flow: Create dynamic employee account
      try {
        // Fetch departments first to obtain a valid reference
        const deptRes = await apiRequest("/api/departments");
        const depts = deptRes.data || deptRes || [];
        if (depts.length === 0) {
          setErrorMsg("Error: Please seed/create departments before signing up employees.");
          return;
        }

        const defaultDeptId = depts[0].id || depts[0]._id;

        // Register employee account
        await apiRequest("/api/employees", {
          method: "POST",
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            role: "Employee",
            department: defaultDeptId,
            status: "Active"
          })
        });

        localStorage.setItem("assetflow_active_role", "Employee");
        localStorage.setItem("assetflow_active_name", fullName.trim());
        localStorage.setItem("assetflow_logged_in_as_admin", "false");
        
        setSuccessMsg("Account registered successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } catch (err: any) {
        setErrorMsg(err.message || "Registration failed. Try again.");
      }
    }
  };
=======
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> 1b75fc5f8719443f4da8700dac4f5567a7166ea5

  return (
    <>
    {/* Same fixed WebGL starfield used across the site, behind the auth card */}
    <StarfieldBackground />
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-slate-100 font-sans">

      {/* Soft Odoo-purple glows layered over the stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#714B67]/25 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#714B67]/15 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-4"
      >
        <div className="bg-white/[0.04] backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-black/50 border border-white/10 relative overflow-hidden">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center mb-5">
              <LogIn className="w-6 h-6 text-odoo-300" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-slate-300 text-sm px-2 font-medium leading-relaxed">
              {isLogin
                ? "Manage your enterprise assets and resources seamlessly in one place."
                : "Register a new employee account to access the corporate directory."}
            </p>
          </div>

          {/* Error and Success states */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-350 text-xs font-bold rounded-xl text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-350 text-xs font-bold rounded-xl text-center">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {!isLogin && (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-odoo-400 focus:ring-4 focus:ring-odoo-400/20 pl-12 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-odoo-400 focus:ring-4 focus:ring-odoo-400/20 pl-12 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-odoo-400 focus:ring-4 focus:ring-odoo-400/20 pl-12 pr-12 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
                  required
                />
<<<<<<< HEAD
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
=======
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
>>>>>>> 1b75fc5f8719443f4da8700dac4f5567a7166ea5
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end pt-1 pb-1">
                  <a href="#" className="text-xs font-semibold text-odoo-300 hover:text-odoo-200 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#714B67] to-[#5a3c52] hover:from-[#5a3c52] hover:to-[#714B67] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#714B67]/30 mt-6 cursor-pointer"
              >
                {isLogin ? "Sign in to AssetFlow" : "Create Account"}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Toggle between login and signup */}
          <div className="mt-8 text-center text-sm font-medium text-slate-350">
            {isLogin ? (
               <span>
                 New to AssetFlow?{" "}
                 <button onClick={() => { setIsLogin(false); setErrorMsg(null); setSuccessMsg(null); }} className="font-bold text-odoo-300 hover:text-odoo-200 transition-colors cursor-pointer bg-transparent border-none">
                   Sign up
                 </button>
               </span>
            ) : (
               <span>
                 Already have an account?{" "}
                 <button onClick={() => { setIsLogin(true); setErrorMsg(null); setSuccessMsg(null); }} className="font-bold text-odoo-300 hover:text-odoo-200 transition-colors cursor-pointer bg-transparent border-none">
                   Sign in
                 </button>
               </span>
            )}
          </div>

        </div>
      </motion.div>
    </div>
    </>
  );
}
