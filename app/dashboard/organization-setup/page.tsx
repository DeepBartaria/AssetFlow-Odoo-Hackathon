"use client";

import { useState, useMemo, useEffect } from "react";
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
const INITIAL_DEPARTMENTS_DATA = [
  { id: 1, name: "Engineering", head: "Aditi Rao", headInitials: "AR", parent: "—", status: "Active" as const },
  { id: 2, name: "Facilities", head: "Rohan Mehta", headInitials: "RM", parent: "—", status: "Active" as const },
  { id: 3, name: "Field Ops (East)", head: "Sana Iqbal", headInitials: "SI", parent: "Field Ops", status: "Inactive" as const },
];

// Mock data representing the categories exactly as requested in specifications
const INITIAL_CATEGORIES_DATA = [
  { id: 1, name: "Electronics", description: "Laptops, desktops, printers and monitors", warranty: 24, status: "Active" as const },
  { id: 2, name: "Furniture", description: "Office furniture", warranty: 12, status: "Active" as const },
  { id: 3, name: "Vehicles", description: "Cars and transport", warranty: 36, status: "Inactive" as const },
];

// Mock data representing the employees exactly as requested in specifications
const INITIAL_EMPLOYEES_DATA = [
  { id: 1, name: "Ankit Mishra", email: "ankit@example.com", department: "Engineering", role: "Employee", status: "Active" as const },
  { id: 2, name: "Priya Shah", email: "priya@example.com", department: "Facilities", role: "Department Head", status: "Active" as const },
  { id: 3, name: "Rahul Patel", email: "rahul@example.com", department: "Finance", role: "Asset Manager", status: "Inactive" as const },
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
  id: number;
  message: string;
}

export default function OrganizationSetupScreen() {
  const [activeTab, setActiveTab] = useState<"Departments" | "Categories" | "Employee">("Departments");
  
  // 1. Departments stored in React State
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS_DATA);

  // 2. Categories stored in React State
  const [categories, setCategories] = useState(INITIAL_CATEGORIES_DATA);

  // 3. Employees stored in React State
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES_DATA);

  // Load from localStorage on mount
  useEffect(() => {
    const storedDepts = localStorage.getItem("assetflow_departments");
    if (storedDepts) {
      try {
        const parsed = JSON.parse(storedDepts);
        setTimeout(() => setDepartments(parsed), 0);
      } catch {}
    } else {
      localStorage.setItem("assetflow_departments", JSON.stringify(INITIAL_DEPARTMENTS_DATA));
    }

    const storedCats = localStorage.getItem("assetflow_categories");
    if (storedCats) {
      try {
        const parsed = JSON.parse(storedCats);
        setTimeout(() => setCategories(parsed), 0);
      } catch {}
    } else {
      localStorage.setItem("assetflow_categories", JSON.stringify(INITIAL_CATEGORIES_DATA));
    }

    const storedEmps = localStorage.getItem("assetflow_employees");
    if (storedEmps) {
      try {
        const parsed = JSON.parse(storedEmps);
        setTimeout(() => setEmployees(parsed), 0);
      } catch {}
    } else {
      localStorage.setItem("assetflow_employees", JSON.stringify(INITIAL_EMPLOYEES_DATA));
    }
  }, []);
  const saveDepartments = (updated: typeof departments | ((prev: typeof departments) => typeof departments)) => {
    setDepartments((prev) => {
      const next = typeof updated === "function" ? updated(prev) : updated;
      localStorage.setItem("assetflow_departments", JSON.stringify(next));
      return next;
    });
  };

  const saveCategories = (updated: typeof categories | ((prev: typeof categories) => typeof categories)) => {
    setCategories((prev) => {
      const next = typeof updated === "function" ? updated(prev) : updated;
      localStorage.setItem("assetflow_categories", JSON.stringify(next));
      return next;
    });
  };

  const saveEmployees = (updated: typeof employees | ((prev: typeof employees) => typeof employees)) => {
    setEmployees((prev) => {
      const next = typeof updated === "function" ? updated(prev) : updated;
      localStorage.setItem("assetflow_employees", JSON.stringify(next));
      return next;
    });
  };

  // Department Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<"add" | "edit">("add");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  // Employee Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeModalMode, setEmployeeModalMode] = useState<"add" | "edit">("add");
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

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

  // Toasts state for showing success messages
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Trigger toast notifications
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
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

  const handleEdit = (dept: typeof INITIAL_DEPARTMENTS_DATA[0]) => {
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

  const handleSave = () => {
    if (!isValid) return;

    if (modalMode === "add") {
      const newDept = {
        id: Date.now(),
        name: formData.name.trim(),
        head: formData.head.trim(),
        headInitials: getInitials(formData.head),
        parent: formData.parent.trim() || "—",
        status: formData.status
      };
      saveDepartments((prev) => [...prev, newDept]);
      showToast("Department created successfully");
    } else {
      saveDepartments((prev) =>
        prev.map((d) => {
          if (d.id === editingId) {
            return {
              ...d,
              name: formData.name.trim(),
              head: formData.head.trim(),
              headInitials: getInitials(formData.head),
              parent: formData.parent.trim() || "—",
              status: formData.status
            };
          }
          return d;
        })
      );
      showToast("Department updated successfully");
    }
    setIsModalOpen(false);
  };

  const handleDeactivate = (id: number) => {
    saveDepartments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, status: "Inactive" as const };
        }
        return d;
      })
    );
    showToast("Department deactivated");
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

  const handleCategoryEdit = (cat: typeof INITIAL_CATEGORIES_DATA[0]) => {
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

  const handleCategorySave = () => {
    if (!isCategoryValid) return;

    if (categoryModalMode === "add") {
      const newCat = {
        id: Date.now(),
        name: categoryFormData.name.trim(),
        description: categoryFormData.description.trim(),
        warranty: Number(categoryFormData.warranty),
        status: categoryFormData.status
      };
      saveCategories((prev) => [...prev, newCat]);
      showToast("Category created successfully");
    } else {
      saveCategories((prev) =>
        prev.map((c) => {
          if (c.id === editingCategoryId) {
            return {
              ...c,
              name: categoryFormData.name.trim(),
              description: categoryFormData.description.trim(),
              warranty: Number(categoryFormData.warranty),
              status: categoryFormData.status
            };
          }
          return c;
        })
      );
      showToast("Category updated successfully");
    }
    setIsCategoryModalOpen(false);
  };

  const handleCategoryDeactivate = (id: number) => {
    saveCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: "Inactive" as const };
        }
        return c;
      })
    );
    showToast("Category deactivated successfully");
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

  const handleEmployeeEdit = (emp: typeof INITIAL_EMPLOYEES_DATA[0]) => {
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

  const handleEmployeeSave = () => {
    if (!isEmployeeValid) return;

    if (employeeModalMode === "add") {
      const newEmp = {
        id: Date.now(),
        name: employeeFormData.name.trim(),
        email: employeeFormData.email.trim(),
        department: employeeFormData.department,
        role: employeeFormData.role,
        status: employeeFormData.status
      };
      saveEmployees((prev) => [...prev, newEmp]);
      showToast("Employee created successfully");
    } else {
      saveEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === editingEmployeeId) {
            return {
              ...emp,
              name: employeeFormData.name.trim(),
              email: employeeFormData.email.trim(),
              department: employeeFormData.department,
              role: employeeFormData.role,
              status: employeeFormData.status
            };
          }
          return emp;
        })
      );
      showToast("Employee updated successfully");
    }
    setIsEmployeeModalOpen(false);
  };

  const handleEmployeeDeactivate = (id: number) => {
    saveEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          return { ...emp, status: "Inactive" as const };
        }
        return emp;
      })
    );
    showToast("Employee deactivated successfully");
  };

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
