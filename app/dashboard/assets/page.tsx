"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, 
  Plus, 
  Search, 
  History, 
  Calendar, 
  MapPin, 
  User, 
  Wrench, 
  Info,
  Tag,
  CheckCircle2,
  X,
  FileText
} from "lucide-react";
import Sidebar from "../Sidebar";

interface HistoryEntry {
  type: "Registration" | "Allocation" | "Maintenance" | "Audit" | "StatusChange";
  date: string;
  details: string;
  actor: string;
}

interface Asset {
  tag: string;
  name: string;
  category: string;
  serialNumber: string;
  acquisitionDate: string;
  acquisitionCost: number;
  condition: "New" | "Good" | "Fair" | "Poor";
  location: string;
  status: "Available" | "Allocated" | "Reserved" | "Under Maintenance" | "Lost" | "Retired" | "Disposed";
  isSharedBookable: boolean;
  history: HistoryEntry[];
}

const DEFAULT_ASSETS: Asset[] = [
  {
    tag: "AF-0012",
    name: "Dell Latitude Laptop",
    category: "Electronics",
    serialNumber: "DL-99281-X",
    acquisitionDate: "2025-03-10",
    acquisitionCost: 45000,
    condition: "Good",
    location: "IT Storage Room",
    status: "Available",
    isSharedBookable: false,
    history: [
      { type: "Registration", date: "2025-03-10", details: "Registered new laptop by Asset Manager", actor: "Raj Verma" }
    ]
  },
  {
    tag: "AF-0114",
    name: "MacBook Pro M3",
    category: "Electronics",
    serialNumber: "AP-MBP-2026",
    acquisitionDate: "2026-01-15",
    acquisitionCost: 185000,
    condition: "New",
    location: "Desk E12",
    status: "Allocated",
    isSharedBookable: false,
    history: [
      { type: "Registration", date: "2026-01-15", details: "Registered new Macbook", actor: "Raj Verma" },
      { type: "Allocation", date: "2026-02-01", details: "Allocated to Priya Shah (Engineering)", actor: "Raj Verma" }
    ]
  },
  {
    tag: "AF-0062",
    name: "Epson 4K Projector",
    category: "Electronics",
    serialNumber: "EP-PROJ-662",
    acquisitionDate: "2024-08-20",
    acquisitionCost: 95000,
    condition: "Fair",
    location: "Conference Room B2",
    status: "Under Maintenance",
    isSharedBookable: true,
    history: [
      { type: "Registration", date: "2024-08-20", details: "Registered shared projector", actor: "Raj Verma" },
      { type: "StatusChange", date: "2026-07-06", details: "Status flipped to Under Maintenance (bulb failure)", actor: "Priya Shah" }
    ]
  },
  {
    tag: "AF-0003",
    name: "Voltas AC Unit",
    category: "Facilities",
    serialNumber: "VT-AC-0003",
    acquisitionDate: "2023-05-12",
    acquisitionCost: 35000,
    condition: "Good",
    location: "Building A - 1st Floor",
    status: "Available",
    isSharedBookable: false,
    history: [
      { type: "Registration", date: "2023-05-12", details: "Registered facilities asset", actor: "System Setup" }
    ]
  },
  {
    tag: "AF-0078",
    name: "Toyota Forklift",
    category: "Vehicles",
    serialNumber: "TY-FL-78",
    acquisitionDate: "2022-11-04",
    acquisitionCost: 850000,
    condition: "Fair",
    location: "Main Warehouse",
    status: "Allocated",
    isSharedBookable: false,
    history: [
      { type: "Registration", date: "2022-11-04", details: "Registered heavy vehicle", actor: "Raj Verma" },
      { type: "Allocation", date: "2023-01-10", details: "Allocated to Logistics Dept", actor: "Raj Verma" }
    ]
  },
  {
    tag: "AF-0897",
    name: "HP LaserJet Printer",
    category: "Electronics",
    serialNumber: "HP-LJ-897",
    acquisitionDate: "2025-06-22",
    acquisitionCost: 22000,
    condition: "Good",
    location: "Finance Wing B",
    status: "Available",
    isSharedBookable: true,
    history: [
      { type: "Registration", date: "2025-06-22", details: "Registered office printer", actor: "Raj Verma" }
    ]
  },
  {
    tag: "AF-0873",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    serialNumber: "HM-CH-873",
    acquisitionDate: "2024-04-18",
    acquisitionCost: 15000,
    condition: "Good",
    location: "Desk E14",
    status: "Available",
    isSharedBookable: false,
    history: [
      { type: "Registration", date: "2024-04-18", details: "Registered desk furniture", actor: "Raj Verma" }
    ]
  },
  {
    tag: "AF-0021",
    name: "Dell Executive Monitor",
    category: "Electronics",
    serialNumber: "DL-MON-21",
    acquisitionDate: "2025-02-14",
    acquisitionCost: 28000,
    condition: "Good",
    location: "IT Storage Room",
    status: "Available",
    isSharedBookable: false,
    history: [
      { type: "Registration", date: "2025-02-14", details: "Registered new monitor", actor: "Raj Verma" },
      { type: "Allocation", date: "2025-03-01", details: "Allocated to Aditi Rao", actor: "Raj Verma" },
      { type: "StatusChange", date: "2026-07-10", details: "Returned to storage, status Available", actor: "Aditi Rao" }
    ]
  },
  {
    tag: "AF-0088",
    name: "Samsung Curved Monitor",
    category: "Electronics",
    serialNumber: "SS-MON-88",
    acquisitionDate: "2024-10-05",
    acquisitionCost: 32000,
    condition: "Poor",
    location: "Building C - Lab 4",
    status: "Lost",
    isSharedBookable: false,
    history: [
      { type: "Registration", date: "2024-10-05", details: "Registered curved monitor", actor: "Raj Verma" },
      { type: "Audit", date: "2026-07-11", details: "Marked missing during Q3 Audit", actor: "Sana Iqbal" }
    ]
  }
];

const STATUSES = ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];
const CONDITIONS = ["New", "Good", "Fair", "Poor"];

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  // Registration Modal state
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regCategory, setRegCategory] = useState("");
  const [regSerial, setRegSerial] = useState("");
  const [regCost, setRegCost] = useState("");
  const [regDate, setRegDate] = useState("");
  const [regCondition, setRegCondition] = useState<"New" | "Good" | "Fair" | "Poor">("Good");
  const [regLocation, setRegLocation] = useState("");
  const [regIsShared, setRegIsShared] = useState(false);

  // Validation touch state
  const [regTouched, setRegTouched] = useState({
    name: false,
    serialNumber: false,
    cost: false,
    date: false,
    location: false
  });

  // Dynamic Categories from Organization Setup
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  // Asset Details Sidebar Modal state
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Load and save localStorage
  useEffect(() => {
    const stored = localStorage.getItem("assetflow_assets");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setAssets(parsed), 0);
      } catch {
        setTimeout(() => setAssets(DEFAULT_ASSETS), 0);
      }
    } else {
      setTimeout(() => setAssets(DEFAULT_ASSETS), 0);
      localStorage.setItem("assetflow_assets", JSON.stringify(DEFAULT_ASSETS));
    }
  }, []);

  interface OrgCategory {
    id: number;
    name: string;
    description: string;
    warranty: number;
    status: "Active" | "Inactive";
  }

  // Sync active categories from localStorage
  useEffect(() => {
    const storedCats = localStorage.getItem("assetflow_categories");
    let activeCats: string[] = [];
    if (storedCats) {
      try {
        const parsed = JSON.parse(storedCats) as OrgCategory[];
        activeCats = parsed.filter((c) => c.status === "Active").map((c) => c.name);
      } catch {
        // use defaults
      }
    }
    if (activeCats.length === 0) {
      activeCats = ["Electronics", "Furniture", "Vehicles"];
    }
    const catsToSet = activeCats;
    setTimeout(() => setCategoriesList(catsToSet), 0);
  }, []);

  // Default dropdown category to first active category
  useEffect(() => {
    if (categoriesList.length > 0 && (!regCategory || !categoriesList.includes(regCategory))) {
      const firstCat = categoriesList[0];
      setTimeout(() => setRegCategory(firstCat), 0);
    }
  }, [categoriesList, regCategory]);

  const saveAssetsToLocal = (updatedList: Asset[]) => {
    setAssets(updatedList);
    localStorage.setItem("assetflow_assets", JSON.stringify(updatedList));
  };

  // Filtered assets search and filter logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchSearch = 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === "All" || asset.category === selectedCategory;
      const matchStatus = selectedStatus === "All" || asset.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [assets, searchTerm, selectedCategory, selectedStatus]);

  // Validation Rules
  const regNameError = useMemo(() => {
    if (!regName.trim()) {
      return "Asset Name is required.";
    }
    return "";
  }, [regName]);

  const regCategoryError = useMemo(() => {
    if (!regCategory) {
      return "Category is required.";
    }
    return "";
  }, [regCategory]);

  const regSerialError = useMemo(() => {
    const val = regSerial.trim();
    if (!val) {
      return "Serial Number is required.";
    }
    const isDuplicate = assets.some(
      (a) => a.serialNumber.toLowerCase().trim() === val.toLowerCase()
    );
    if (isDuplicate) {
      return "Serial Number must be unique.";
    }
    return "";
  }, [regSerial, assets]);

  const regCostError = useMemo(() => {
    const val = regCost.trim();
    if (!val) {
      return "Acquisition Cost is required.";
    }
    const cleanVal = val.replace(/₹/g, "").replace(/,/g, "").trim();
    const num = parseFloat(cleanVal);
    if (isNaN(num) || num <= 0) {
      return "Acquisition Cost must be a positive number.";
    }
    return "";
  }, [regCost]);

  const regDateError = useMemo(() => {
    if (!regDate) {
      return "Acquisition Date is required.";
    }
    const selectedDate = new Date(regDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      return "Acquisition Date cannot be in the future.";
    }
    return "";
  }, [regDate]);

  const regLocationError = useMemo(() => {
    if (!regLocation.trim()) {
      return "Location is required.";
    }
    return "";
  }, [regLocation]);

  const isRegFormValid = !regNameError && !regCategoryError && !regSerialError && !regCostError && !regDateError && !regLocationError;

  // Handle register asset submit
  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegFormValid) return;

    // Auto-generate sequential tag
    const maxTagNum = assets.reduce((max, asset) => {
      const num = parseInt(asset.tag.replace("AF-", ""), 10);
      return num > max ? num : max;
    }, 0);
    const newTag = `AF-${String(maxTagNum + 1).padStart(4, "0")}`;

    const cleanCost = regCost.replace(/₹/g, "").replace(/,/g, "").trim();
    const acquisitionCost = parseFloat(cleanCost) || 0;

    const newAsset: Asset = {
      tag: newTag,
      name: regName.trim(),
      category: regCategory,
      serialNumber: regSerial.trim(),
      acquisitionDate: regDate,
      acquisitionCost: acquisitionCost,
      condition: regCondition,
      location: regLocation.trim(),
      status: "Available",
      isSharedBookable: regIsShared,
      history: [
        {
          type: "Registration",
          date: new Date().toISOString().split("T")[0],
          details: `Registered asset under tag ${newTag}`,
          actor: "Jane Doe (Asset Manager)"
        }
      ]
    };

    const updated = [newAsset, ...assets];
    saveAssetsToLocal(updated);
    setIsRegModalOpen(false);

    // Reset Form
    setRegName("");
    setRegCategory(categoriesList[0] || "");
    setRegSerial("");
    setRegCost("");
    setRegDate("");
    setRegCondition("Good");
    setRegLocation("");
    setRegIsShared(false);
    setRegTouched({
      name: false,
      serialNumber: false,
      cost: false,
      date: false,
      location: false
    });
  };

  // Helper for status badge styling
  const getStatusStyle = (status: Asset["status"]) => {
    switch (status) {
      case "Available":
        return "bg-odoo-50 text-odoo-700 border-odoo-100";
      case "Allocated":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Reserved":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Under Maintenance":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Lost":
        return "bg-red-50 text-red-700 border-red-100";
      case "Retired":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Disposed":
        return "bg-slate-200 text-slate-800 border-slate-300 line-through";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  // Helper for condition badge styling
  const getConditionStyle = (condition: Asset["condition"]) => {
    switch (condition) {
      case "New":
        return "bg-sky-50 text-sky-700 border-sky-100";
      case "Good":
        return "bg-odoo-50 text-odoo-700 border-odoo-100";
      case "Fair":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Poor":
        return "bg-red-50 text-red-700 border-red-100";
    }
  };

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800 font-sans">
      <Sidebar activeItem="Assets" />

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100 flex items-center justify-center">
                  <Box className="w-5 h-5 text-odoo-600" />
                </div>
                Asset Directory &amp; Registry
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Register assets, manage lifecycle states, and track historical check-ins, transfers, and maintenance events.
              </p>
            </div>

            <button
              onClick={() => setIsRegModalOpen(true)}
              className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Asset
            </button>
          </header>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Assets</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{assets.length}</h3>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100 flex items-center justify-center text-odoo-650 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Available</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{assets.filter(a => a.status === "Available").length}</h3>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-650 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Allocated</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{assets.filter(a => a.status === "Allocated").length}</h3>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-655 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">In Repair</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{assets.filter(a => a.status === "Under Maintenance").length}</h3>
              </div>
            </div>
          </div>

          {/* Filtering Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets by tag, serial, location, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-odoo-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 w-full md:w-auto">
                <div className="flex-1 md:w-44">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-odoo-500"
                  >
                    <option value="All">All Categories</option>
                    {categoriesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 md:w-44">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-odoo-500"
                  >
                    <option value="All">All Statuses</option>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Asset List Layout */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Asset Info</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Condition</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium text-sm">
                        No assets found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map(asset => (
                      <tr 
                        key={asset.tag} 
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedAsset(asset)}
                      >
                        {/* Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-odoo-50 group-hover:text-odoo-600 transition-colors">
                              <Box className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-slate-900 group-hover:text-odoo-650 transition-colors flex items-center gap-1.5">
                                {asset.name}
                                {asset.isSharedBookable && (
                                  <span className="text-[9px] font-bold bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Bookable</span>
                                )}
                              </div>
                              <div className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-2">
                                <span className="font-bold text-slate-500">{asset.tag}</span>
                                <span>·</span>
                                <span>SN: {asset.serialNumber}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="text-sm font-semibold text-slate-600">{asset.category}</span>
                        </td>

                        {/* Condition */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${getConditionStyle(asset.condition)}`}>
                            {asset.condition}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {asset.location}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAsset(asset);
                            }}
                            className="bg-slate-100 hover:bg-odoo-50 text-slate-500 hover:text-odoo-605 p-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer border border-slate-200 hover:border-odoo-100"
                          >
                            <History className="w-4 h-4" />
                            Timeline
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* 1. Register Asset Modal */}
      <AnimatePresence>
        {isRegModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden z-50 relative font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Box className="w-5 h-5 text-odoo-600" />
                  Register New Enterprise Asset
                </h3>
                <button 
                  onClick={() => setIsRegModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleRegisterAsset}>
                <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Asset Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      onBlur={() => setRegTouched(prev => ({ ...prev, name: true }))}
                      placeholder="e.g. Epson 4K Projector or Dell Latitude 5440"
                      className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white text-slate-900 font-medium transition-colors ${
                        regTouched.name && regNameError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                      }`}
                    />
                    {regTouched.name && regNameError && (
                      <p className="text-rose-500 text-xs font-semibold mt-1">{regNameError}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                      <select
                        value={regCategory}
                        onChange={(e) => setRegCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 text-slate-900 font-semibold"
                      >
                        {categoriesList.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {regTouched.name && regCategoryError && (
                        <p className="text-rose-500 text-xs font-semibold mt-1">{regCategoryError}</p>
                      )}
                    </div>

                    {/* Serial Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Serial Number</label>
                      <input
                        type="text"
                        value={regSerial}
                        onChange={(e) => setRegSerial(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, serialNumber: true }))}
                        placeholder="e.g. SN-XXXX-XXXX"
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white text-slate-900 font-medium ${
                          regTouched.serialNumber && regSerialError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {regTouched.serialNumber && regSerialError && (
                        <p className="text-rose-500 text-xs font-semibold mt-1">{regSerialError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Cost */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <span className="text-sm font-bold text-slate-500">₹</span> Acquisition Cost (₹)
                      </label>
                      <input
                        type="text"
                        value={regCost}
                        onChange={(e) => setRegCost(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, cost: true }))}
                        placeholder="e.g. 45,000"
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white text-slate-900 font-medium ${
                          regTouched.cost && regCostError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {regTouched.cost && regCostError && (
                        <p className="text-rose-500 text-xs font-semibold mt-1">{regCostError}</p>
                      )}
                    </div>

                    {/* Acquisition Date */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Acquisition Date
                      </label>
                      <input
                        type="date"
                        value={regDate}
                        onChange={(e) => setRegDate(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, date: true }))}
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 text-slate-900 font-semibold ${
                          regTouched.date && regDateError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {regTouched.date && regDateError && (
                        <p className="text-rose-500 text-xs font-semibold mt-1">{regDateError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Condition */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Initial Condition</label>
                      <select
                        value={regCondition}
                        onChange={(e) => setRegCondition(e.target.value as "New" | "Good" | "Fair" | "Poor")}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 text-slate-900 font-semibold"
                      >
                        {CONDITIONS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Location
                      </label>
                      <input
                        type="text"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, location: true }))}
                        placeholder="e.g. IT Storage or Floor 2"
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white text-slate-900 font-medium ${
                          regTouched.location && regLocationError ? "border-rose-300 focus:border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {regTouched.location && regLocationError && (
                        <p className="text-rose-500 text-xs font-semibold mt-1">{regLocationError}</p>
                      )}
                    </div>
                  </div>

                  {/* Shared/Bookable Flag */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <input
                      type="checkbox"
                      id="shared-flag"
                      checked={regIsShared}
                      onChange={(e) => setRegIsShared(e.target.checked)}
                      className="w-4.5 h-4.5 text-odoo-600 border-slate-300 rounded focus:ring-odoo-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="shared-flag" className="block text-sm font-bold text-slate-800 cursor-pointer">
                        Shared/Bookable Resource
                      </label>
                      <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">
                        Enable this asset to be booked via timeslots on the Resource Booking calendar.
                      </span>
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsRegModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-650 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isRegFormValid}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
                      isRegFormValid 
                        ? "bg-odoo-600 hover:bg-odoo-700 text-white shadow-odoo-600/10 cursor-pointer"
                        : "bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Asset Detail & Timeline History Slider/Drawer */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Sidebar Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-white w-full max-w-lg h-full shadow-2xl relative z-50 flex flex-col font-sans border-l border-slate-200"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-odoo-50 border border-odoo-100 flex items-center justify-center text-odoo-650 shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedAsset.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{selectedAsset.tag}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Meta details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border mt-1.5 ${getStatusStyle(selectedAsset.status)}`}>
                      {selectedAsset.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Condition</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border mt-1.5 ${getConditionStyle(selectedAsset.condition)}`}>
                      {selectedAsset.condition}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Category</p>
                    <p className="text-slate-900 text-sm mt-1">{selectedAsset.category}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Serial Number</p>
                    <p className="text-slate-955 font-mono text-sm mt-1">{selectedAsset.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Acquisition Date</p>
                    <p className="text-slate-900 text-sm mt-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedAsset.acquisitionDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Acquisition Cost</p>
                    <p className="text-slate-900 text-sm mt-1 flex items-center gap-1"><span className="text-slate-400 font-bold">₹</span> {selectedAsset.acquisitionCost.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Expected Location</p>
                    <p className="text-slate-900 text-sm mt-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedAsset.location}</p>
                  </div>
                </div>

                {/* Shared Flag Display */}
                {selectedAsset.isSharedBookable && (
                  <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl flex items-start gap-3 text-sky-955">
                    <Info className="w-5 h-5 text-sky-655 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-850">Bookable Shared Resource</h4>
                      <p className="text-xs font-medium leading-relaxed mt-1">
                        This asset is flagged as bookable. Employees can book overlapping slots via the Resource Booking Screen.
                      </p>
                    </div>
                  </div>
                )}

                {/* History Timeline */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-odoo-600" />
                    Asset Activity &amp; Status Timeline
                  </h4>

                  <div className="border-l border-slate-200 pl-4 py-2 space-y-5 ml-2.5">
                    {selectedAsset.history.map((log, idx) => {
                      let iconBg = "bg-slate-100 text-slate-500 border-slate-200";
                      
                      switch (log.type) {
                        case "Registration":
                          iconBg = "bg-odoo-50 text-odoo-600 border-odoo-100";
                          break;
                        case "Allocation":
                          iconBg = "bg-blue-50 text-blue-600 border-blue-100";
                          break;
                        case "Maintenance":
                          iconBg = "bg-amber-50 text-amber-600 border-amber-100";
                          break;
                        case "Audit":
                          iconBg = "bg-red-50 text-red-600 border-red-100";
                          break;
                      }

                      return (
                        <div key={idx} className="relative">
                          {/* Dot/Icon */}
                          <div className={`absolute -left-[27px] w-6 h-6 rounded-full border flex items-center justify-center ${iconBg} shadow-sm z-10`}>
                            {log.type === "Registration" ? <Tag className="w-3 h-3" /> :
                             log.type === "Allocation" ? <User className="w-3 h-3" /> :
                             log.type === "Maintenance" ? <Wrench className="w-3 h-3" /> :
                             <FileText className="w-3 h-3" />}
                          </div>
                          
                          {/* Detail */}
                          <div className="text-xs leading-relaxed space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800">{log.details}</span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{log.date}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">
                              Logged by: <span className="font-bold">{log.actor}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
