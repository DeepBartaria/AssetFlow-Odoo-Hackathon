"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Plus, 
  Info, 
  Building2, 
  Tag, 
  Users, 
  Briefcase,
  X,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Sidebar";
import { apiRequest } from "../../../lib/api";

// Reusable Status Badge Component
interface StatusBadgeProps {
  status: "Active" | "Inactive";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
      isActive
        ? "bg-odoo-50 text-odoo-700 border-odoo-200"
        : "bg-rose-50 text-rose-700 border-rose-200"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        isActive ? "bg-odoo-500" : "bg-rose-500"
      }`} />
      {status}
    </span>
  );
}

interface Toast {
  id: string;
  message: string;
}

function makeToastId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function OrganizationSetupScreen() {
  const [activeTab, setActiveTab] = useState<"Departments" | "Categories" | "Employee">("Departments");
  
  // Toasts state for showing success messages
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Trigger toast notifications
  const showToast = (message: string) => {
    const id = makeToastId();
  };

  // Helper to extract initials from a full name
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // 1. Departments stored in React State
  const [departments, setDepartments] = useState<{ id: string; _id: string; name: string; head: string; parent: string; status: "Active" | "Inactive"; headInitials: string }[]>([]);

  // 2. Categories stored in React State
  const [categories, setCategories] = useState<{ id: string; _id: string; name: string; description: string; warranty: number; status: "Active" | "Inactive" }[]>([]);

  // 3. Employees stored in React State
  const [employees, setEmployees] = useState<{ id: string; _id: string; name: string; email: string; department: string; role: string; status: "Active" | "Inactive" }[]>([]);

  const fetchDepartments = async () => {
    try {
      const res = await apiRequest("/api/departments");
      const mapped = (res.data || res || []).map((d: { _id: string; name: string; head: string; parentDepartment?: string; status: "Active" | "Inactive" }) => ({
        ...d,
        id: d._id,
        parent: d.parentDepartment || "—",
        headInitials: getInitials(d.head)
      }));
      setTimeout(() => setDepartments(mapped), 0);
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Failed to load departments.";
      showToast(errorMsg);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiRequest("/api/categories");
      const mapped = (res.data || res || []).map((c: { _id: string; name: string; description: string; warrantyPeriod: number; status: "Active" | "Inactive" }) => ({
        ...c,
        id: c._id,
        warranty: c.warrantyPeriod
      }));
      setTimeout(() => setCategories(mapped), 0);
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Failed to load categories.";
      showToast(errorMsg);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await apiRequest("/api/employees");
      const mapped = (res.data || res || []).map((emp: { _id: string; name: string; email: string; department: string | { name: string }; role: string; status: "Active" | "Inactive" }) => ({
        ...emp,
        id: emp._id,
        department: emp.department && typeof emp.department === "object" ? emp.department.name : emp.department
      }));
      setTimeout(() => setEmployees(mapped), 0);
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Failed to load employees.";
      showToast(errorMsg);
    }
  };

  const [activeRole, setActiveRole] = useState("Admin");

  // Load from database on mount
  useEffect(() => {
    const role = localStorage.getItem("assetflow_active_role");
    if (role) {
      setActiveRole(role);
    }
    setTimeout(() => {
      fetchDepartments();
      fetchCategories();
      fetchEmployees();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Department Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<"add" | "edit">("add");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Employee Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeModalMode, setEmployeeModalMode] = useState<"add" | "edit">("add");
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  // Department Modal Form States
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    parent: "",
    status: "Active" as "Active" | "Inactive"
  });

  // Category Modal Form States
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    warranty: "",
    status: "Active" as "Active" | "Inactive"
  });

  // Employee Modal Form States
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    status: "Active" as "Active" | "Inactive"
  });

  // Touch states for Department inline validation display
  const [touched, setTouched] = useState({
    name: false,
    head: false
  });

  // Touch states for Category inline validation display
  const [categoryTouched, setCategoryTouched] = useState({
    name: false,
    description: false,
    warranty: false
  });

  // Touch states for Employee inline validation display
  const [employeeTouched, setEmployeeTouched] = useState({
    name: false,
    email: false,
    department: false,
    role: false
  });



  // Department validation rules
  const nameError = useMemo(() => {
    const val = formData.name.trim();
    if (!val) {
      return "Department Name cannot be empty.";
    }
    const isDuplicate = departments.some((d) => {
      if (modalMode === "edit" && d.id === editingId) return false;
      return d.name.toLowerCase().trim() === val.toLowerCase();
    });
    if (isDuplicate) {
      return "Department Name already exists (duplicate names not allowed).";
    }
    return "";
  }, [formData.name, departments, modalMode, editingId]);

  const headError = useMemo(() => {
    const val = formData.head.trim();
    if (!val) {
      return "Department Head cannot be empty.";
    }
    return "";
  }, [formData.head]);

  const isValid = !nameError && !headError;

  // Category validation rules
  const categoryNameError = useMemo(() => {
    const val = categoryFormData.name.trim();
    if (!val) {
      return "Category Name cannot be empty.";
    }
    const isDuplicate = categories.some((c) => {
      if (categoryModalMode === "edit" && c.id === editingCategoryId) return false;
      return c.name.toLowerCase().trim() === val.toLowerCase();
    });
    if (isDuplicate) {
      return "Category Name already exists (duplicate names not allowed).";
    }
    return "";
  }, [categoryFormData.name, categories, categoryModalMode, editingCategoryId]);

  const categoryDescriptionError = useMemo(() => {
    const val = categoryFormData.description.trim();
    if (!val) {
      return "Description cannot be empty.";
    }
    return "";
  }, [categoryFormData.description]);

  const categoryWarrantyError = useMemo(() => {
    const val = categoryFormData.warranty.trim();
    if (!val) {
      return "Warranty Period is required.";
    }
    const num = Number(val);
    if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
      return "Warranty Period must be a positive integer.";
    }
    return "";
  }, [categoryFormData.warranty]);

  const isCategoryValid = !categoryNameError && !categoryDescriptionError && !categoryWarrantyError;

  // Employee validation rules
  const employeeNameError = useMemo(() => {
    const val = employeeFormData.name.trim();
    if (!val) {
      return "Name is required.";
    }
    return "";
  }, [employeeFormData.name]);

  const employeeEmailError = useMemo(() => {
    const val = employeeFormData.email.trim();
    if (!val) {
      return "Email is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return "Invalid email format.";
    }
    const isDuplicate = employees.some((emp) => {
      if (employeeModalMode === "edit" && emp.id === editingEmployeeId) return false;
      return emp.email.toLowerCase().trim() === val.toLowerCase();
    });
    if (isDuplicate) {
      return "Email already exists in the employee directory.";
    }
    return "";
  }, [employeeFormData.email, employees, employeeModalMode, editingEmployeeId]);

  const employeeDepartmentError = useMemo(() => {
    if (!employeeFormData.department) {
      return "Department is required.";
    }
    return "";
  }, [employeeFormData.department]);

  const employeeRoleError = useMemo(() => {
    if (!employeeFormData.role) {
      return "Role is required.";
    }
    return "";
  }, [employeeFormData.role]);

  const isEmployeeValid = !employeeNameError && !employeeEmailError && !employeeDepartmentError && !employeeRoleError;

  // Department action handlers
  const handleAdd = () => {
    setModalMode("add");
    setEditingId(null);
    setFormData({
      name: "",
      head: "",
      parent: "",
      status: "Active"
    });
    setTouched({
      name: false,
      head: false
    });
    setIsModalOpen(true);
  };

  const handleEdit = (dept: { id: string; name: string; head: string; parent: string; status: "Active" | "Inactive" }) => {
    setModalMode("edit");
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      head: dept.head,
      parent: dept.parent === "—" ? "" : dept.parent,
      status: dept.status
    });
    setTouched({
      name: false,
      head: false
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!isValid) return;

    try {
      const payload = {
        name: formData.name.trim(),
        head: formData.head.trim(),
        parentDepartment: formData.parent.trim() || "—",
        status: formData.status
      };

      if (modalMode === "add") {
        await apiRequest("/api/departments", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        showToast("Department created successfully");
      } else {
        await apiRequest(`/api/departments/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        showToast("Department updated successfully");
      }
      await fetchDepartments();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Error saving department";
      showToast(errorMsg);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await apiRequest(`/api/departments/${id}`, {
        method: "DELETE"
      });
      showToast("Department deactivated");
      await fetchDepartments();
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Error deactivating department";
      showToast(errorMsg);
    }
  };

  // Category action handlers
  const handleCategoryAdd = () => {
    setCategoryModalMode("add");
    setEditingCategoryId(null);
    setCategoryFormData({
      name: "",
      description: "",
      warranty: "",
      status: "Active"
    });
    setCategoryTouched({
      name: false,
      description: false,
      warranty: false
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryEdit = (cat: { id: string; name: string; description: string; warranty: number; status: "Active" | "Inactive" }) => {
    setCategoryModalMode("edit");
    setEditingCategoryId(cat.id);
    setCategoryFormData({
      name: cat.name,
      description: cat.description,
      warranty: String(cat.warranty),
      status: cat.status
    });
    setCategoryTouched({
      name: false,
      description: false,
      warranty: false
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategorySave = async () => {
    if (!isCategoryValid) return;

    try {
      const payload = {
        name: categoryFormData.name.trim(),
        description: categoryFormData.description.trim(),
        warrantyPeriod: Number(categoryFormData.warranty),
        status: categoryFormData.status
      };

      if (categoryModalMode === "add") {
        await apiRequest("/api/categories", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        showToast("Category created successfully");
      } else {
        await apiRequest(`/api/categories/${editingCategoryId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        showToast("Category updated successfully");
      }
      await fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Error saving category";
      showToast(errorMsg);
    }
  };

  const handleCategoryDeactivate = async (id: string) => {
    try {
      await apiRequest(`/api/categories/${id}`, {
        method: "DELETE"
      });
      showToast("Category deactivated successfully");
      await fetchCategories();
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Error deactivating category";
      showToast(errorMsg);
    }
  };

  // Employee action handlers
  const handleEmployeeAdd = () => {
    setEmployeeModalMode("add");
    setEditingEmployeeId(null);
    setEmployeeFormData({
      name: "",
      email: "",
      department: "",
      role: "",
      status: "Active"
    });
    setEmployeeTouched({
      name: false,
      email: false,
      department: false,
      role: false
    });
    setIsEmployeeModalOpen(true);
  };

  const handleEmployeeEdit = (emp: { id: string; name: string; email: string; department: string; role: string; status: "Active" | "Inactive" }) => {
    setEmployeeModalMode("edit");
    setEditingEmployeeId(emp.id);
    setEmployeeFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      role: emp.role,
      status: emp.status
    });
    setEmployeeTouched({
      name: false,
      email: false,
      department: false,
      role: false
    });
    setIsEmployeeModalOpen(true);
  };

  const handleEmployeeSave = async () => {
    if (!isEmployeeValid) return;

    try {
      // Find department ID by name
      const deptDoc = departments.find(d => d.name === employeeFormData.department);
      if (!deptDoc) {
        showToast("Selected department is invalid.");
        return;
      }

      const payload = {
        name: employeeFormData.name.trim(),
        email: employeeFormData.email.trim(),
        department: deptDoc._id || deptDoc.id,
        role: employeeFormData.role,
        status: employeeFormData.status
      };

      if (employeeModalMode === "add") {
        await apiRequest("/api/employees", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        showToast("Employee created successfully");
      } else {
        await apiRequest(`/api/employees/${editingEmployeeId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        showToast("Employee updated successfully");
      }
      await fetchEmployees();
      setIsEmployeeModalOpen(false);
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Error saving employee";
      showToast(errorMsg);
    }
  };

  const handleEmployeeDeactivate = async (id: string) => {
    try {
      await apiRequest(`/api/employees/${id}`, {
        method: "DELETE"
      });
      showToast("Employee deactivated successfully");
      await fetchEmployees();
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string }).message || "Error deactivating employee";
      showToast(errorMsg);
    }
  };

  if (activeRole !== "Admin") {
    return (
      <div className="min-h-screen flex bg-[#ffffff] text-slate-800 relative font-sans">
        {/* Sidebar */}
        <Sidebar activeItem="Organization Setup" />

        {/* Main Content Access Denied Card */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50 flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full text-center space-y-4 bg-white border border-slate-200 p-8 rounded-3xl card-shadow">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100 mx-auto animate-bounce">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
            <p className="text-xs font-semibold text-slate-550 leading-relaxed">
              You do not have the administrative privileges required to configure company hierarchy, asset categories, or employee directories.
            </p>
            <p className="text-[11px] font-bold text-slate-400">
              Please switch your Active Session Role to Admin in the sidebar to access this section.
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
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800 relative">
      {/* Sidebar */}
      <Sidebar activeItem="Organization Setup" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-odoo-600" />
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
                    ? "bg-white text-odoo-600 shadow-sm border border-slate-200"
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
                    ? "bg-white text-odoo-600 shadow-sm border border-slate-200"
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
                    ? "bg-white text-odoo-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                <Users className="w-4 h-4" />
                Employee
              </button>
            </div>

            {/* Add Button */}
            {activeTab === "Departments" && (
              <button 
                onClick={handleAdd}
                className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            )}
            {activeTab === "Categories" && (
              <button 
                onClick={handleCategoryAdd}
                className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
            {activeTab === "Employee" && (
              <button 
                onClick={handleEmployeeAdd}
                className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            )}
          </div>

          {/* Department Management UI */}
          {activeTab === "Departments" && (
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
                    {departments.map((dept) => (
                      <tr 
                        key={dept.id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {dept.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-odoo-50 border border-odoo-100 flex items-center justify-center text-xs font-bold text-odoo-700">
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
                              className="text-xs font-semibold text-odoo-600 hover:text-odoo-700 transition-colors"
                            >
                              Edit
                            </button>
                            {dept.status === "Active" ? (
                              <button
                                onClick={() => handleDeactivate(dept.id)}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-slate-300 select-none">
                                Deactivated
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category Management UI */}
          {activeTab === "Categories" && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Category Name
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Description
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Warranty Period
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
                    {categories.map((cat) => (
                      <tr 
                        key={cat.id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {cat.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                          {cat.description}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                          {cat.warranty} Months
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={cat.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleCategoryEdit(cat)}
                              className="text-xs font-semibold text-odoo-600 hover:text-odoo-700 transition-colors"
                            >
                              Edit
                            </button>
                            {cat.status === "Active" ? (
                              <button
                                onClick={() => handleCategoryDeactivate(cat.id)}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-slate-300 select-none">
                                Deactivated
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Employee Management UI */}
          {activeTab === "Employee" && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Name
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Email
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Department
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Role
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
                    {employees.map((emp) => (
                      <tr 
                        key={emp.id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-odoo-50 border border-odoo-100 flex items-center justify-center text-xs font-bold text-odoo-700 animate-fade-in shrink-0">
                              {getInitials(emp.name)}
                            </div>
                            <span className="font-semibold">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {emp.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                          {emp.department}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {emp.role}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={emp.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEmployeeEdit(emp)}
                              className="text-xs font-semibold text-odoo-600 hover:text-odoo-700 transition-colors"
                            >
                              Edit
                            </button>
                            {emp.status === "Active" ? (
                              <button
                                onClick={() => handleEmployeeDeactivate(emp.id)}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-slate-300 select-none">
                                Deactivated
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm shadow-inner"
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
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      touched.name && nameError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                    placeholder="e.g. Engineering"
                  />
                  {touched.name && nameError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{nameError}</p>
                  )}
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
                    onBlur={() => setTouched((prev) => ({ ...prev, head: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      touched.head && headError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                    placeholder="e.g. Aditi Rao"
                  />
                  {touched.head && headError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{headError}</p>
                  )}
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-odoo-500 transition-colors"
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
                  disabled={!isValid}
                  onClick={handleSave}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isValid
                      ? "bg-odoo-600 hover:bg-odoo-700 text-white cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm shadow-inner"
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
                  {categoryModalMode === "add" ? "Add Category" : "Edit Category"}
                </h3>
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form fields */}
              <div className="p-6 space-y-4">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    onBlur={() => setCategoryTouched((prev) => ({ ...prev, name: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      categoryTouched.name && categoryNameError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                    placeholder="e.g. Electronics"
                  />
                  {categoryTouched.name && categoryNameError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{categoryNameError}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    onBlur={() => setCategoryTouched((prev) => ({ ...prev, description: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors min-h-[80px] ${
                      categoryTouched.description && categoryDescriptionError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                    placeholder="e.g. Laptops, desktops, printers and monitors"
                  />
                  {categoryTouched.description && categoryDescriptionError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{categoryDescriptionError}</p>
                  )}
                </div>

                {/* Warranty Period */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Warranty Period (Months)
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.warranty}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, warranty: e.target.value })}
                    onBlur={() => setCategoryTouched((prev) => ({ ...prev, warranty: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      categoryTouched.warranty && categoryWarrantyError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                    placeholder="e.g. 24"
                  />
                  {categoryTouched.warranty && categoryWarrantyError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{categoryWarrantyError}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </label>
                  <select
                    value={categoryFormData.status}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-odoo-500 transition-colors"
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
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isCategoryValid}
                  onClick={handleCategorySave}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isCategoryValid
                      ? "bg-odoo-600 hover:bg-odoo-700 text-white cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Employee Modal */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmployeeModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm shadow-inner"
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
                  {employeeModalMode === "add" ? "Add Employee" : "Edit Employee"}
                </h3>
                <button 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form fields */}
              <div className="p-6 space-y-4">
                {/* Employee Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Name
                  </label>
                  <input
                    type="text"
                    value={employeeFormData.name}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, name: e.target.value })}
                    onBlur={() => setEmployeeTouched((prev) => ({ ...prev, name: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      employeeTouched.name && employeeNameError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                    placeholder="e.g. Ankit Mishra"
                  />
                  {employeeTouched.name && employeeNameError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{employeeNameError}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={employeeFormData.email}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                    onBlur={() => setEmployeeTouched((prev) => ({ ...prev, email: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      employeeTouched.email && employeeEmailError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                    placeholder="e.g. ankit@example.com"
                  />
                  {employeeTouched.email && employeeEmailError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{employeeEmailError}</p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Department
                  </label>
                  <select
                    value={employeeFormData.department}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, department: e.target.value })}
                    onBlur={() => setEmployeeTouched((prev) => ({ ...prev, department: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      employeeTouched.department && employeeDepartmentError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {employeeTouched.department && employeeDepartmentError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{employeeDepartmentError}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </label>
                  <select
                    value={employeeFormData.role}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, role: e.target.value })}
                    onBlur={() => setEmployeeTouched((prev) => ({ ...prev, role: true }))}
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors ${
                      employeeTouched.role && employeeRoleError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select Role</option>
                    <option value="Employee">Employee</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Asset Manager">Asset Manager</option>
                  </select>
                  {employeeTouched.role && employeeRoleError && (
                    <p className="text-rose-500 text-xs font-semibold mt-1">{employeeRoleError}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </label>
                  <select
                    value={employeeFormData.status}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-odoo-500 transition-colors"
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
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isEmployeeValid}
                  onClick={handleEmployeeSave}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isEmployeeValid
                      ? "bg-odoo-600 hover:bg-odoo-700 text-white cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold pointer-events-auto border border-slate-800"
            >
              <div className="w-2 h-2 rounded-full bg-odoo-500 animate-pulse" />
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
