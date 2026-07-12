"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Plus, 
  UserCheck, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X,
  User,
  Info,
  Calendar,
  AlertCircle
} from "lucide-react";
import Sidebar from "../Sidebar";

interface MaintenanceRequest {
  id: string;
  assetTag: string;
  assetName: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Approved" | "Technician Assigned" | "In Progress" | "Resolved";
  technician?: string;
  resolvedDate?: string;
  resolutionNotes?: string;
  photoUrl?: string;
}

const INITIAL_REQUESTS: MaintenanceRequest[] = [
  {
    id: "req-1",
    assetTag: "AF-0062",
    assetName: "Projector Bulb",
    description: "not turning on",
    priority: "High",
    status: "Pending"
  },
  {
    id: "req-2",
    assetTag: "AF-0003",
    assetName: "AC Unit",
    description: "noisy compressor",
    priority: "Medium",
    status: "Approved"
  },
  {
    id: "req-3",
    assetTag: "AF-0078",
    assetName: "Forklift",
    description: "hydraulic lift failure",
    priority: "High",
    status: "Technician Assigned",
    technician: "R. Varma"
  },
  {
    id: "req-4",
    assetTag: "AF-0897",
    assetName: "Printer Jam",
    description: "parts ordered for rollers",
    priority: "Low",
    status: "In Progress",
    technician: "R. Varma"
  },
  {
    id: "req-5",
    assetTag: "AF-0873",
    assetName: "Chair Repair",
    description: "resolved hydraulic lift",
    priority: "Low",
    status: "Resolved",
    technician: "A. K. Sharma",
    resolvedDate: "7 Jul"
  }
];

const PRESET_ASSETS = [
  { tag: "AF-0012", name: "Dell Latitude Laptop" },
  { tag: "AF-0062", name: "Epson Projector" },
  { tag: "AF-0003", name: "Voltas AC Unit" },
  { tag: "AF-0078", name: "Toyota Forklift" },
  { tag: "AF-0897", name: "HP LaserJet Printer" },
  { tag: "AF-0873", name: "Ergonomic Office Chair" },
];

const TECHNICIANS = ["R. Varma", "S. Nair", "T. Gupta", "A. K. Sharma"];

export default function MaintenanceScreen() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [dynamicAssets, setDynamicAssets] = useState(PRESET_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal toggle states
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  
  // Selected request for assignments/resolutions
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  // Form states
  const [formAssetTag, setFormAssetTag] = useState("AF-0062");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [selectedTech, setSelectedTech] = useState(TECHNICIANS[0]);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load and save localStorage
  useEffect(() => {
    const stored = localStorage.getItem("assetflow_maintenance_requests");
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch (e) {
        setRequests(INITIAL_REQUESTS);
      }
    } else {
      setRequests(INITIAL_REQUESTS);
      localStorage.setItem("assetflow_maintenance_requests", JSON.stringify(INITIAL_REQUESTS));
    }

    const storedAssets = localStorage.getItem("assetflow_assets");
    if (storedAssets) {
      try {
        const parsedAssets = JSON.parse(storedAssets);
        const mappedAssets = parsedAssets.map((a: any) => ({
          tag: a.tag,
          name: a.name
        }));
        
        const allAssets = [...PRESET_ASSETS];
        mappedAssets.forEach((ma: any) => {
          if (!allAssets.some(pa => pa.tag === ma.tag)) {
            allAssets.push(ma);
          }
        });
        setDynamicAssets(allAssets);
        if (allAssets.length > 0) {
          setFormAssetTag(allAssets[0].tag);
        }
      } catch (e) {}
    }
  }, []);

  const saveRequests = (updatedList: MaintenanceRequest[]) => {
    setRequests(updatedList);
    localStorage.setItem("assetflow_maintenance_requests", JSON.stringify(updatedList));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAsset = dynamicAssets.find(a => a.tag === formAssetTag);
    const newReq: MaintenanceRequest = {
      id: `req-${Date.now()}`,
      assetTag: formAssetTag,
      assetName: selectedAsset ? selectedAsset.name : "Company Asset",
      description: formDesc,
      priority: formPriority,
      status: "Pending",
      photoUrl: uploadedPhotoUrl || undefined
    };

    const updated = [...requests, newReq];
    saveRequests(updated);
    setIsRequestModalOpen(false);
    setFormDesc("");
    setUploadedPhotoUrl(null);
  };

  const handleApprove = (id: string) => {
    const updated = requests.map(req => {
      if (req.id === id) {
        return { ...req, status: "Approved" as const };
      }
      return req;
    });
    saveRequests(updated);

    // Dynamic flip status of asset in assets localStorage
    try {
      const storedAssets = localStorage.getItem("assetflow_assets");
      if (storedAssets) {
        const parsedAssets = JSON.parse(storedAssets);
        const req = requests.find(r => r.id === id);
        if (req) {
          const updatedAssets = parsedAssets.map((asset: any) => {
            if (asset.tag === req.assetTag) {
              return { 
                ...asset, 
                status: "Under Maintenance",
                history: [
                  {
                    type: "StatusChange",
                    date: new Date().toISOString().split("T")[0],
                    details: "Status changed to Under Maintenance (Repair approved)",
                    actor: "Jane Doe (Asset Manager)"
                  },
                  ...asset.history
                ]
              };
            }
            return asset;
          });
          localStorage.setItem("assetflow_assets", JSON.stringify(updatedAssets));
        }
      }
    } catch (err) {}
  };

  const handleOpenAssign = (id: string) => {
    setSelectedReqId(id);
    setSelectedTech(TECHNICIANS[0]);
    setIsAssignModalOpen(true);
  };

  const handleAssignTechnician = () => {
    if (!selectedReqId) return;
    const updated = requests.map(req => {
      if (req.id === selectedReqId) {
        return { 
          ...req, 
          status: "Technician Assigned" as const, 
          technician: selectedTech 
        };
      }
      return req;
    });
    saveRequests(updated);
    setIsAssignModalOpen(false);
    setSelectedReqId(null);
  };

  const handleStartWork = (id: string) => {
    const updated = requests.map(req => {
      if (req.id === id) {
        return { ...req, status: "In Progress" as const };
      }
      return req;
    });
    saveRequests(updated);
  };

  const handleOpenResolve = (id: string) => {
    setSelectedReqId(id);
    setResolutionNotes("");
    setIsResolveModalOpen(true);
  };

  const handleResolve = () => {
    if (!selectedReqId) return;
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${today.getDate()} ${monthNames[today.getMonth()]}`;

    const updated = requests.map(req => {
      if (req.id === selectedReqId) {
        return { 
          ...req, 
          status: "Resolved" as const, 
          resolvedDate: formattedDate,
          resolutionNotes: resolutionNotes
        };
      }
      return req;
    });
    saveRequests(updated);

    // Revert status of asset back to Available in assets localStorage
    try {
      const storedAssets = localStorage.getItem("assetflow_assets");
      if (storedAssets) {
        const parsedAssets = JSON.parse(storedAssets);
        const req = requests.find(r => r.id === selectedReqId);
        if (req) {
          const updatedAssets = parsedAssets.map((asset: any) => {
            if (asset.tag === req.assetTag) {
              return { 
                ...asset, 
                status: "Available",
                history: [
                  {
                    type: "StatusChange",
                    date: new Date().toISOString().split("T")[0],
                    details: `Status reverted to Available (Repair resolved. Notes: ${resolutionNotes})`,
                    actor: "Jane Doe (Asset Manager)"
                  },
                  ...asset.history
                ]
              };
            }
            return asset;
          });
          localStorage.setItem("assetflow_assets", JSON.stringify(updatedAssets));
        }
      }
    } catch (err) {}

    setIsResolveModalOpen(false);
    setSelectedReqId(null);
  };

  const handleReject = (id: string) => {
    const updated = requests.filter(req => req.id !== id);
    saveRequests(updated);
  };

  // Group requests by status for Kanban layout
  const filteredRequestsList = useMemo(() => {
    return requests.filter(r => {
      if (searchQuery.trim() === "") return true;
      const query = searchQuery.toLowerCase();
      return (
        r.assetTag.toLowerCase().includes(query) ||
        r.assetName.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        (r.technician && r.technician.toLowerCase().includes(query))
      );
    });
  }, [requests, searchQuery]);

  const pendingRequests = filteredRequestsList.filter(r => r.status === "Pending");
  const approvedRequests = filteredRequestsList.filter(r => r.status === "Approved");
  const techAssignedRequests = filteredRequestsList.filter(r => r.status === "Technician Assigned");
  const inProgressRequests = filteredRequestsList.filter(r => r.status === "In Progress");
  const resolvedRequests = filteredRequestsList.filter(r => r.status === "Resolved");

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800 font-sans">
      {/* Sidebar */}
      <Sidebar activeItem="Maintenance" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-55/50 flex flex-col min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8 flex-1 flex flex-col w-full">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-odoo-600" />
                </div>
                Maintenance Management
              </h1>
              <p className="text-slate-550 text-sm mt-2">
                Route asset repairs through an approval and technician tracking workflow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="🔍 Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-odoo-500 transition-all font-semibold w-full sm:w-64"
                />
              </div>

              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Raise Request
              </button>
            </div>
          </header>

          {/* Kanban Board Container */}
          <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-5 items-stretch min-h-[500px]">
            
            {/* 1. Pending Column */}
            <div className="w-80 shrink-0 flex flex-col bg-slate-100/75 border border-slate-200/60 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Pending
                </h3>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {pendingRequests.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence initial={false}>
                  {pendingRequests.map(req => (
                    <MaintenanceCard 
                      key={req.id} 
                      request={req} 
                      onAction={() => handleApprove(req.id)}
                      onReject={() => handleReject(req.id)}
                      actionLabel="Approve"
                      rejectLabel="Reject"
                    />
                  ))}
                </AnimatePresence>
                {pendingRequests.length === 0 && <EmptyColumnState />}
              </div>
            </div>

            {/* 2. Approved Column */}
            <div className="w-80 shrink-0 flex flex-col bg-slate-100/75 border border-slate-200/60 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Approved
                </h3>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {approvedRequests.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence initial={false}>
                  {approvedRequests.map(req => (
                    <MaintenanceCard 
                      key={req.id} 
                      request={req} 
                      onAction={() => handleOpenAssign(req.id)}
                      actionLabel="Assign Tech"
                    />
                  ))}
                </AnimatePresence>
                {approvedRequests.length === 0 && <EmptyColumnState />}
              </div>
            </div>

            {/* 3. Tech Assigned Column */}
            <div className="w-80 shrink-0 flex flex-col bg-slate-100/75 border border-slate-200/60 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  Technician Assigned
                </h3>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {techAssignedRequests.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence initial={false}>
                  {techAssignedRequests.map(req => (
                    <MaintenanceCard 
                      key={req.id} 
                      request={req} 
                      onAction={() => handleStartWork(req.id)}
                      actionLabel="Start Work"
                    />
                  ))}
                </AnimatePresence>
                {techAssignedRequests.length === 0 && <EmptyColumnState />}
              </div>
            </div>

            {/* 4. In Progress Column */}
            <div className="w-80 shrink-0 flex flex-col bg-slate-100/75 border border-slate-200/60 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-odoo-500 fill-odoo-500" />
                  In Progress
                </h3>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {inProgressRequests.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence initial={false}>
                  {inProgressRequests.map(req => (
                    <MaintenanceCard 
                      key={req.id} 
                      request={req} 
                      onAction={() => handleOpenResolve(req.id)}
                      actionLabel="Mark Resolved"
                    />
                  ))}
                </AnimatePresence>
                {inProgressRequests.length === 0 && <EmptyColumnState />}
              </div>
            </div>

            {/* 5. Resolved Column */}
            <div className="w-80 shrink-0 flex flex-col bg-slate-100/75 border border-slate-200/60 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-odoo-600" />
                  Resolved
                </h3>
                <span className="bg-odoo-100 text-odoo-800 px-2 py-0.5 rounded-full text-xs font-bold border border-odoo-200">
                  {resolvedRequests.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence initial={false}>
                  {resolvedRequests.map(req => (
                    <MaintenanceCard 
                      key={req.id} 
                      request={req} 
                    />
                  ))}
                </AnimatePresence>
                {resolvedRequests.length === 0 && <EmptyColumnState />}
              </div>
            </div>

          </div>

          {/* Workflow Rule Note (bottom right spec) */}
          <div className="flex items-center gap-3 p-4 bg-odoo-50 border border-odoo-100 rounded-2xl text-odoo-900 shrink-0 card-shadow">
            <Info className="w-5 h-5 text-odoo-600 shrink-0" />
            <p className="text-xs font-bold leading-relaxed">
              Workflow Note: Approving a card moves the asset to 'Under Maintenance', and resolving the card returns it to 'Available'.
            </p>
          </div>

        </div>
      </main>

      {/* 1. Raise Maintenance Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden z-50 relative font-sans"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-odoo-600" />
                  Raise Maintenance Request
                </h3>
                <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest}>
                <div className="p-6 space-y-4">
                  
                  {/* Select Asset */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Select Asset
                    </label>
                    <select
                      value={formAssetTag}
                      onChange={(e) => setFormAssetTag(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-semibold text-slate-900"
                    >
                      {dynamicAssets.map(asset => (
                        <option key={asset.tag} value={asset.tag}>
                          {asset.tag} — {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Describe Issue */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Describe the issue
                    </label>
                    <textarea
                      required
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="e.g. AC fan makes a grinding noise or screen flickers constantly."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-medium text-slate-900 resize-none"
                    />
                  </div>

                  {/* Priority Select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Low", "Medium", "High"] as const).map(prio => {
                        const isSelected = formPriority === prio;
                        return (
                          <button
                            key={prio}
                            type="button"
                            onClick={() => setFormPriority(prio)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                              isSelected
                                ? prio === "High"
                                  ? "bg-red-50 text-red-700 border-red-300 ring-2 ring-red-500/15"
                                  : prio === "Medium"
                                  ? "bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-500/15"
                                  : "bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/15"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-55"
                            }`}
                          >
                            {prio}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Functional Image Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Attach photo of defect (Optional)
                    </label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*"
                      className="hidden" 
                    />
                    
                    {uploadedPhotoUrl ? (
                      <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={uploadedPhotoUrl} 
                            alt="Defect Preview" 
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">Defect Image Attached</p>
                            <p className="text-[10px] text-slate-450">Image loaded successfully</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setUploadedPhotoUrl(null)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-odoo-500 hover:bg-odoo-50/10 rounded-xl p-4 text-center cursor-pointer transition-all"
                      >
                        <p className="text-xs text-slate-500 font-medium">Click to select files or drag-and-drop</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>

                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-odoo-600 hover:bg-odoo-700 text-white transition-colors shadow-sm cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Assign Technician Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden z-50 relative font-sans"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-odoo-600" />
                  Assign Technician
                </h3>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Technician
                  </label>
                  <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white font-semibold text-slate-900"
                  >
                    {TECHNICIANS.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignTechnician}
                  className="px-4.5 py-2 rounded-xl text-xs font-bold bg-odoo-600 hover:bg-odoo-700 text-white cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Mark Resolved Modal */}
      <AnimatePresence>
        {isResolveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResolveModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden z-50 relative font-sans"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-odoo-600" />
                  Mark Repair Resolved
                </h3>
                <button onClick={() => setIsResolveModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="e.g. Replaced faulty capacitor on the motherboard. Tested okay."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white resize-none font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResolve}
                  className="px-4.5 py-2 rounded-xl text-xs font-bold bg-odoo-600 hover:bg-odoo-700 text-white cursor-pointer"
                >
                  Confirm Resolved
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Subcomponent: Empty Column Placeholder
function EmptyColumnState() {
  return (
    <div className="h-28 border border-dashed border-slate-300 rounded-xl flex items-center justify-center p-4">
      <p className="text-xs text-slate-400 font-medium text-center">No cards in this stage</p>
    </div>
  );
}

// Subcomponent: Kanban Card
interface MaintenanceCardProps {
  request: MaintenanceRequest;
  onAction?: () => void;
  onReject?: () => void;
  actionLabel?: string;
  rejectLabel?: string;
}

function MaintenanceCard({ request, onAction, onReject, actionLabel, rejectLabel }: MaintenanceCardProps) {
  const isResolved = request.status === "Resolved";
  const priorityColors = {
    High: "bg-red-50 text-red-700 border-red-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    Low: "bg-blue-50 text-blue-700 border-blue-100"
  };

  // Simulated AI Urgency rating
  const urgencyScore = useMemo(() => {
    let base = 35;
    if (request.priority === "High") base = 85;
    else if (request.priority === "Medium") base = 60;
    base += Math.min(request.description.length * 0.2, 10);
    return Math.min(Math.round(base), 99);
  }, [request.priority, request.description]);

  return (
    <motion.div
      layoutId={request.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-xl border card-shadow bg-white flex flex-col gap-3 group relative overflow-hidden transition-all ${
        isResolved ? "border-odoo-250 bg-odoo-50/20 hover:border-odoo-300" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Top Details */}
      <div className="flex justify-between items-start gap-1">
        <div>
          <span className="font-extrabold text-[13px] text-slate-900">{request.assetTag}</span>
          <h4 className="font-bold text-xs text-slate-500 mt-0.5">{request.assetName}</h4>
        </div>
        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${priorityColors[request.priority]}`}>
          {request.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-650 font-medium leading-relaxed break-words">
        {request.description}
      </p>

      {/* Defect photo preview */}
      {request.photoUrl && (
        <div className="relative rounded-lg overflow-hidden border border-slate-100 max-h-24 bg-slate-55 mt-1">
          <img 
            src={request.photoUrl} 
            alt="Defect defect" 
            className="w-full h-20 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* AI Urgency Rating */}
      <div className="flex items-center justify-between text-[10px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 mt-1">
        <span className="text-slate-500 font-bold flex items-center gap-1">
          🤖 AI Urgency Score
        </span>
        <span className={`font-extrabold ${
          urgencyScore > 80 ? "text-red-700" : urgencyScore > 50 ? "text-amber-600" : "text-blue-700"
        }`}>
          {urgencyScore}%
        </span>
      </div>

      {/* Technician Assigned Badge */}
      {request.technician && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-550 font-bold bg-slate-50 px-2 py-1 rounded-lg w-fit border border-slate-100">
          <User className="w-3 h-3 text-slate-400" />
          <span>Tech: {request.technician}</span>
        </div>
      )}

      {/* Custom Resolved Meta info */}
      {isResolved && (
        <div className="flex items-center gap-1.5 justify-between text-[10px] pt-1.5 border-t border-odoo-100/50 mt-1">
          <span className="text-odoo-700 font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
          <span className="text-slate-400 font-semibold flex items-center gap-0.5">
            <Calendar className="w-3 h-3" /> {request.resolvedDate}
          </span>
        </div>
      )}

      {/* Action Trigger Buttons */}
      {!isResolved && onAction && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
          <button
            onClick={onAction}
            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold text-center text-white bg-odoo-600 hover:bg-odoo-700 cursor-pointer shadow-sm shadow-odoo-600/10 transition-colors`}
          >
            {actionLabel}
          </button>
          
          {onReject && (
            <button
              onClick={onReject}
              className="py-1.5 px-2.5 rounded-lg text-[10px] font-bold text-center text-slate-500 hover:bg-slate-100 cursor-pointer border border-slate-200 transition-colors"
            >
              {rejectLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
