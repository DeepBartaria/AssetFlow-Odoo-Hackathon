"use client";

import { useState } from "react";
import { 
  Plus, 
  Info, 
  Building2, 
  Tag, 
  Users, 
  Briefcase,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Sidebar";

// Mock data representing the departments exactly as requested in specifications
const DEPARTMENTS_DATA = [
  { id: 1, name: "Engineering", head: "Aditi Rao", headInitials: "AR", parent: "—", status: "Active" as const },
  { id: 2, name: "Facilities", head: "Rohan Mehta", headInitials: "RM", parent: "—", status: "Active" as const },
  { id: 3, name: "Field Ops (East)", head: "Sana Iqbal", headInitials: "SI", parent: "Field Ops", status: "Inactive" as const },
];

interface StatusBadgeProps {
  status: "Active" | "Inactive";
}

// Reusable Status Badge Component
export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
      isActive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-rose-50 text-rose-700 border-rose-200"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        isActive ? "bg-emerald-500" : "bg-rose-500"
      }`} />
      {status}
    </span>
  );
}

export default function OrganizationSetupScreen() {
  const [activeTab, setActiveTab] = useState<"Departments" | "Categories" | "Employee">("Departments");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  
  // Modal form states (visual-only, no validation/backend submission)
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    parent: "",
    status: "Active" as "Active" | "Inactive"
  });

  const handleAdd = () => {
    setModalMode("add");
    setFormData({
      name: "",
      head: "",
      parent: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleEdit = (dept: typeof DEPARTMENTS_DATA[0]) => {
    setModalMode("edit");
    setFormData({
      name: dept.name,
      head: dept.head,
      parent: dept.parent === "—" ? "" : dept.parent,
      status: dept.status
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      {/* Sidebar */}
      <Sidebar activeItem="Organization Setup" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                Organization Setup
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Configure your company structure, asset categories, and corporate directory.
              </p>
            </div>
          </header>

          {/* Controls Bar (Tabs + Add Button) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
              <button
                onClick={() => setActiveTab("Departments")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "Departments"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Departments
              </button>
              <button
                onClick={() => setActiveTab("Categories")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "Categories"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                <Tag className="w-4 h-4" />
                Categories
              </button>
              <button
                onClick={() => setActiveTab("Employee")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "Employee"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                <Users className="w-4 h-4" />
                Employee
              </button>
            </div>

            {/* Add Button */}
            <button 
              onClick={handleAdd}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          </div>

          {/* Department Management UI */}
          {activeTab === "Departments" ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Department
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Department Head
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Parent Department
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DEPARTMENTS_DATA.map((dept) => (
                      <tr 
                        key={dept.id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {dept.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                              {dept.headInitials}
                            </div>
                            <span className="font-medium">{dept.head}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                          {dept.parent === "—" ? (
                            <span className="text-slate-400 italic">—</span>
                          ) : (
                            dept.parent
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={dept.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(dept)}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              Deactivate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 card-shadow">
              Select the Departments tab to manage company departments.
            </div>
          )}

          {/* Informational Callout */}
          <div className="flex items-start sm:items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 card-shadow">
            <Info className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0 text-blue-600" />
            <p className="text-sm font-semibold">
              Editing a department here also drives the picklist in Screen 4 & 5.
            </p>
          </div>

        </div>
      </main>

      {/* Add / Edit Department Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden z-50 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  {modalMode === "add" ? "Add Department" : "Edit Department"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form fields */}
              <div className="p-6 space-y-4">
                {/* Department Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                    placeholder="e.g. Engineering"
                  />
                </div>

                {/* Department Head */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Department Head
                  </label>
                  <input
                    type="text"
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                    placeholder="e.g. Aditi Rao"
                  />
                </div>

                {/* Parent Department */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Parent Department
                  </label>
                  <input
                    type="text"
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                    placeholder="e.g. Operations (optional)"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
