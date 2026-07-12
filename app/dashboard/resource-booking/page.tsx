"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarClock, 
  Plus, 
  Calendar,
  AlertTriangle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Users,
  Search
} from "lucide-react";
import Sidebar from "../Sidebar";
import { apiRequest } from "../../../lib/api";

interface Booking {
  id: string;
  title: string;
  resourceId: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  date: string;      // "YYYY-MM-DD"
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | "Conflict";
  department: string;
  requestedBy: string;
}

const RESOURCES = [
  { id: "room-b2", name: "Conference room B2", type: "Room", info: "Building B, 2nd Floor", capacity: "12 seats" },
  { id: "van-1", name: "Delivery Van (Toyota)", type: "Vehicle", info: "Basement Parking B3", capacity: "1 Ton Cargo" },
  { id: "proj-1", name: "Tech Projector AF-0062", type: "Equipment", info: "IT Service Desk Closet", capacity: "4K UHD Laser" },
  { id: "room-aud", name: "Auditorium A1", type: "Room", info: "Ground Floor Main Wing", capacity: "150 seats" }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "1",
    title: "Booked - Procurement Team",
    resourceId: "room-b2",
    startTime: "09:00",
    endTime: "10:00",
    date: "2026-07-07",
    status: "Upcoming",
    department: "Procurement",
    requestedBy: "Siddharth Sen"
  },
  {
    id: "2",
    title: "Requested 9:30 to 10:30 - conflict - slot is unavailable",
    resourceId: "room-b2",
    startTime: "09:30",
    endTime: "10:30",
    date: "2026-07-07",
    status: "Conflict",
    department: "Marketing",
    requestedBy: "Priya Shah"
  },
  {
    id: "3",
    title: "Logistics Delivery Run",
    resourceId: "van-1",
    startTime: "11:00",
    endTime: "13:00",
    date: "2026-07-07",
    status: "Upcoming",
    department: "Logistics",
    requestedBy: "Ramesh Kumar"
  },
  {
    id: "4",
    title: "Product Demo",
    resourceId: "proj-1",
    startTime: "14:00",
    endTime: "15:30",
    date: "2026-07-07",
    status: "Ongoing",
    department: "Sales",
    requestedBy: "Karan Johar"
  }
];

const HOURS = [
  { label: "9:00 AM", val: 9 },
  { label: "10:00 AM", val: 10 },
  { label: "11:00 AM", val: 11 },
  { label: "12:00 PM", val: 12 },
  { label: "1:00 PM", val: 13 },
  { label: "2:00 PM", val: 14 },
  { label: "3:00 PM", val: 15 },
  { label: "4:00 PM", val: 16 },
  { label: "5:00 PM", val: 17 },
  { label: "6:00 PM", val: 18 }
];

export default function ResourceBookingScreen() {
  const [selectedResourceId, setSelectedResourceId] = useState("room-b2");
  const [selectedDate, setSelectedDate] = useState("2026-07-07");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [focusedBookingId, setFocusedBookingId] = useState<string | null>(null);
  const [dynamicResources, setDynamicResources] = useState(RESOURCES);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"All" | "Room" | "Vehicle" | "Equipment">("All");

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formStart, setFormStart] = useState("10:00");
  const [formEnd, setFormEnd] = useState("11:00");
  const [formDept, setFormDept] = useState("Engineering");
  const [formRequestor, setFormRequestor] = useState("Jane Doe");

  const stats = useMemo(() => {
    const active = bookings.filter(b => b.status !== "Cancelled" && b.status !== "Conflict");
    const total = active.length;
    const rooms = active.filter(b => {
      const res = dynamicResources.find(r => r.id === b.resourceId);
      return res?.type === "Room";
    }).length;
    const vehicles = active.filter(b => {
      const res = dynamicResources.find(r => r.id === b.resourceId);
      return res?.type === "Vehicle";
    }).length;
    const equip = active.filter(b => {
      const res = dynamicResources.find(r => r.id === b.resourceId);
      return res?.type === "Equipment";
    }).length;

    return { total, rooms, vehicles, equip };
  }, [bookings, dynamicResources]);

  const filteredResources = useMemo(() => {
    return dynamicResources.filter(r => {
      if (selectedTypeFilter === "All") return true;
      return r.type === selectedTypeFilter;
    });
  }, [dynamicResources, selectedTypeFilter]);

  // Adjust selection when filtered resource list changes
  useEffect(() => {
    if (filteredResources.length > 0 && !filteredResources.some(r => r.id === selectedResourceId)) {
      const firstId = filteredResources[0].id;
      setTimeout(() => setSelectedResourceId(firstId), 0);
    }
  }, [filteredResources, selectedResourceId]);

  // Load and save bookings/resources
  useEffect(() => {
    const stored = localStorage.getItem("assetflow_bookings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => setBookings(parsed), 0);
        } else {
          setTimeout(() => {
            setBookings(INITIAL_BOOKINGS);
            localStorage.setItem("assetflow_bookings", JSON.stringify(INITIAL_BOOKINGS));
          }, 0);
        }
      } catch {
        setTimeout(() => setBookings(INITIAL_BOOKINGS), 0);
      }
    } else {
      setTimeout(() => {
        setBookings(INITIAL_BOOKINGS);
        localStorage.setItem("assetflow_bookings", JSON.stringify(INITIAL_BOOKINGS));
      }, 0);
    }

    const fetchBookableAssets = async () => {
      try {
        const res = await apiRequest("/api/assets");
        const list = res.data || res || [];
        const bookableAssets = list
          .filter((a: { sharedBookable?: boolean; isSharedBookable?: boolean }) => a.sharedBookable || a.isSharedBookable)
          .map((a: { _id: string; assetTag?: string; tag?: string; name: string; category?: string | { name: string }; location?: string; condition?: string }) => {
            const catName = a.category && typeof a.category === "object" ? a.category.name : (a.category || "");
            const tagVal = a.assetTag || a.tag || "AF-0000";
            return {
              id: `asset-${tagVal.toLowerCase()}`,
              name: `${a.name} (${tagVal})`,
              type: catName === "Vehicles" ? "Vehicle" : catName === "Electronics" ? "Equipment" : "Equipment",
              info: `Location: ${a.location || "Unknown"}`,
              capacity: a.condition === "New" ? "Excellent Condition" : "Good Condition"
            };
          });
        
        const allResources = [...RESOURCES];
        bookableAssets.forEach((ba: { id: string; name: string; type: string; info: string; capacity: string }) => {
          if (!allResources.some(r => r.id === ba.id)) {
            allResources.push(ba);
          }
        });
        setTimeout(() => setDynamicResources(allResources), 0);
      } catch (e) {
        // ignore
      }
    };
    fetchBookableAssets();
  }, []);

  const saveBookings = (updatedList: Booking[]) => {
    setBookings(updatedList);
    localStorage.setItem("assetflow_bookings", JSON.stringify(updatedList));
  };

  const activeResource = useMemo(() => {
    return dynamicResources.find(r => r.id === selectedResourceId) || dynamicResources[0];
  }, [dynamicResources, selectedResourceId]);

  const activeResourceStatus = useMemo(() => {
    const todayBookings = bookings.filter(b => b.resourceId === selectedResourceId && b.date === selectedDate && b.status !== "Cancelled");
    if (todayBookings.length === 0) return { label: "Available All Day", color: "bg-emerald-50 text-emerald-700 border-emerald-250" };
    const conflict = todayBookings.some(b => b.status === "Conflict");
    if (conflict) return { label: "Conflicts Detected", color: "bg-red-50 text-red-700 border-red-250" };
    return { label: `${todayBookings.length} Allocated Slot(s)`, color: "bg-blue-50 text-blue-700 border-blue-250" };
  }, [bookings, selectedResourceId, selectedDate]);

  const activeBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.resourceId !== selectedResourceId || b.date !== selectedDate) return false;
      if (searchQuery.trim() === "") return true;
      return (
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [bookings, selectedResourceId, selectedDate, searchQuery]);

  // Convert HH:MM to minutes relative to 9:00 AM
  const parseTimeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (h - 9) * 60 + m;
  };

  const bookingPositions = useMemo(() => {
    const positions: { [key: string]: { left: string; width: string; zIndex: number; isOverlapping: boolean } } = {};
    const activeAndNotCancelled = activeBookings.filter(b => b.status !== "Cancelled");
    
    // Find all overlaps for each booking
    const overlapsMap: { [key: string]: string[] } = {};
    activeAndNotCancelled.forEach(b1 => {
      overlapsMap[b1.id] = [];
      const b1Start = parseTimeToMinutes(b1.startTime);
      const b1End = parseTimeToMinutes(b1.endTime);
      
      activeAndNotCancelled.forEach(b2 => {
        if (b1.id === b2.id) return;
        const b2Start = parseTimeToMinutes(b2.startTime);
        const b2End = parseTimeToMinutes(b2.endTime);
        
        // Check if they overlap
        if (b1Start < b2End && b1End > b2Start) {
          overlapsMap[b1.id].push(b2.id);
        }
      });
    });

    // Assign columns for side-by-side rendering
    const columns: { [key: string]: number } = {};
    const maxColumnsInGroup: { [key: string]: number } = {};
    
    activeAndNotCancelled.forEach(b => {
      if (columns[b.id] === undefined) {
        const neighbors = overlapsMap[b.id];
        const usedCols = neighbors
          .map(nid => columns[nid])
          .filter(col => col !== undefined);
        
        let col = 0;
        while (usedCols.includes(col)) {
          col++;
        }
        columns[b.id] = col;
      }
    });

    activeAndNotCancelled.forEach(b => {
      const neighbors = overlapsMap[b.id];
      let maxCol = columns[b.id];
      neighbors.forEach(nid => {
        if (columns[nid] > maxCol) {
          maxCol = columns[nid];
        }
      });
      const groupSize = neighbors.length > 0 ? maxCol + 1 : 1;
      maxColumnsInGroup[b.id] = groupSize;
    });

    activeAndNotCancelled.forEach(b => {
      const colIndex = columns[b.id] || 0;
      const groupSize = maxColumnsInGroup[b.id] || 1;
      const hasOverlap = overlapsMap[b.id].length > 0;
      
      const widthPercent = hasOverlap ? 90 / groupSize : 96;
      const leftPercent = hasOverlap ? 2 + colIndex * (94 / groupSize) : 2;
      
      positions[b.id] = {
        width: `${widthPercent}%`,
        left: `${leftPercent}%`,
        zIndex: 10 + colIndex,
        isOverlapping: hasOverlap
      };
    });

    return { positions, overlapsMap };
  }, [activeBookings]);


  const getPositionStyles = (startTime: string, endTime: string) => {
    const startMins = parseTimeToMinutes(startTime);
    const endMins = parseTimeToMinutes(endTime);
    const duration = endMins - startMins;

    // Hour block height is 80px in our design
    const hourHeight = 80;
    const top = (startMins / 60) * hourHeight;
    const height = (duration / 60) * hourHeight;

    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const startMins = parseTimeToMinutes(formStart);
    const endMins = parseTimeToMinutes(formEnd);

    if (startMins < 0 || endMins > 540) {
      setValidationError("Booking must be within operating hours (9:00 AM to 6:00 PM).");
      return;
    }

    if (startMins >= endMins) {
      setValidationError("End time must be after start time.");
      return;
    }

    // Check for overlap with active/upcoming/ongoing bookings
    const overlapping = bookings.find(b => {
      if (b.resourceId !== selectedResourceId || b.date !== selectedDate) return false;
      if (b.status === "Cancelled") return false;
      
      const bStart = parseTimeToMinutes(b.startTime);
      const bEnd = parseTimeToMinutes(b.endTime);

      return startMins < bEnd && endMins > bStart;
    });

    if (overlapping) {
      if (overlapping.status === "Conflict") {
        setValidationError(`Requested slot overlaps with a pending conflicting request.`);
      } else {
        setValidationError(`Overlap Conflict: Already booked by '${overlapping.title.replace("Booked - ", "")}' (${overlapping.startTime} - ${overlapping.endTime})`);
        
        // Add a temporary conflict block to the calendar grid for visual display
        const conflictId = `conflict-${Date.now()}`;
        const newConflict: Booking = {
          id: conflictId,
          title: `Requested ${formStart} to ${formEnd} - conflict - slot is unavailable`,
          resourceId: selectedResourceId,
          startTime: formStart,
          endTime: formEnd,
          date: selectedDate,
          status: "Conflict",
          department: formDept,
          requestedBy: formRequestor
        };

        saveBookings([...bookings, newConflict]);
      }
      return;
    }

    // Success - add booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      title: `Booked - ${formTitle || "Meeting"}`,
      resourceId: selectedResourceId,
      startTime: formStart,
      endTime: formEnd,
      date: selectedDate,
      status: "Upcoming",
      department: formDept,
      requestedBy: formRequestor
    };

    saveBookings([...bookings, newBooking]);
    setIsModalOpen(false);
    // Reset form
    setFormTitle("");
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: "Cancelled" as const } : b);
    saveBookings(updated);
  };

  const handleRemoveConflict = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    saveBookings(updated);
  };

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800 font-sans">
      {/* Sidebar */}
      <Sidebar activeItem="Resource Booking" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-55/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-odoo-50 border border-odoo-100 flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-odoo-600" />
                </div>
                Resource Booking
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Book meeting rooms, company vehicles, and presentation equipment. Overlap checking prevents conflicts.
              </p>
            </div>

            <button
              onClick={() => {
                setValidationError(null);
                setIsModalOpen(true);
              }}
              className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Book a slot
            </button>
          </header>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
              </div>
              <div className="w-10 h-10 bg-odoo-50 text-odoo-600 rounded-xl flex items-center justify-center border border-odoo-100">
                <CalendarClock className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rooms Booked</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.rooms}</h3>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicles Booked</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.vehicles}</h3>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                <Info className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Equipment Booked</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.equip}</h3>
              </div>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                <Info className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filters, Search & Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-4 border border-slate-200 rounded-2xl card-shadow">
            
            {/* Type Filter */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Resource Type</label>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value as "All" | "Room" | "Vehicle" | "Equipment")}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-odoo-500 transition-colors"
              >
                <option value="All">All Types</option>
                <option value="Room">Rooms Only</option>
                <option value="Vehicle">Vehicles Only</option>
                <option value="Equipment">Equipment Only</option>
              </select>
            </div>

            {/* Resource Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Resource</label>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-odoo-500 transition-colors"
              >
                {filteredResources.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Search Bookings</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title/requester/dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-2 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-odoo-500 transition-colors"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Date Pick Picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Booking Date</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const prev = new Date(selectedDate);
                    prev.setDate(prev.getDate() - 1);
                    setSelectedDate(prev.toISOString().split('T')[0]);
                  }}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-900 text-center focus:outline-none focus:border-odoo-500 transition-colors"
                />
                <button 
                  onClick={() => {
                    const next = new Date(selectedDate);
                    next.setDate(next.getDate() + 1);
                    setSelectedDate(next.toISOString().split('T')[0]);
                  }}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Active Resource Details Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 card-shadow">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-odoo-50 border border-odoo-100 rounded-xl flex items-center justify-center text-odoo-600 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Resource Details</p>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeResource.name}</h4>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">
                  {activeResource.info} · Capacity: {activeResource.capacity}
                </p>
              </div>
            </div>
            
            <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold text-center shrink-0 self-start sm:self-auto ${activeResourceStatus.color}`}>
              {activeResourceStatus.label}
            </div>
          </div>

          {/* Calendar Display Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Timeline View (Left 3 columns) */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-odoo-600" />
                  Schedule Timeline
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  Operating Hours: 9:00 AM – 6:00 PM
                </span>
              </div>

              {/* Hourly Timeline Container */}
              <div className="relative border-l border-slate-100 pl-4 sm:pl-8 py-2" style={{ height: `${HOURS.length * 80}px` }}>
                
                {/* Background Grid Lines */}
                <div className="absolute inset-0 left-4 sm:left-8 right-0 pointer-events-none">
                  {HOURS.map((hr, idx) => (
                    <div 
                      key={idx} 
                      className="absolute left-0 right-0 border-t border-slate-100 flex items-start" 
                      style={{ top: `${idx * 80}px`, height: "80px" }}
                    >
                      {/* Hour Label */}
                      <span className="absolute -left-16 sm:-left-20 text-[11px] font-bold text-slate-400 w-12 text-right -mt-2">
                        {hr.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Absolute Bookings Wrapper */}
                <div 
                  className="absolute inset-0 left-4 sm:left-8 right-0 pointer-events-none"
                  onClick={() => setFocusedBookingId(null)}
                >
                  <AnimatePresence>
                    {activeBookings.map((b) => {
                      if (b.status === "Cancelled") return null;

                      const isConflict = b.status === "Conflict";
                      const isOngoing = b.status === "Ongoing";
                      const baseStyles = getPositionStyles(b.startTime, b.endTime);
                      
                      const layout = bookingPositions.positions[b.id] || { left: "2%", width: "96%", zIndex: 10, isOverlapping: false };
                      const isThisFocused = focusedBookingId === b.id;
                      const isAnotherOverlappingFocused = focusedBookingId !== null && 
                                                          focusedBookingId !== b.id && 
                                                          (bookingPositions.overlapsMap[focusedBookingId]?.includes(b.id) || false);

                      const mergedStyles = {
                        ...baseStyles,
                        left: layout.left,
                        width: layout.width,
                        zIndex: isThisFocused ? 40 : (isAnotherOverlappingFocused ? 5 : layout.zIndex),
                      };

                      return (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          style={mergedStyles}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFocusedBookingId(b.id);
                          }}
                          className={`absolute pointer-events-auto rounded-xl p-3 border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                            isThisFocused 
                              ? (isConflict ? "ring-2 ring-red-500 scale-[1.02] shadow-lg shadow-red-500/20" : "ring-2 ring-odoo-500 scale-[1.02] shadow-lg shadow-odoo-500/20") 
                              : ""
                          } ${
                            isAnotherOverlappingFocused 
                              ? "blur-[1.5px] opacity-40 scale-[0.98] saturate-50" 
                              : ""
                          } ${
                            isConflict
                              ? "bg-red-50/95 border-2 border-dashed border-red-400 text-red-900 shadow-sm"
                              : isOngoing
                              ? "bg-amber-50 border-amber-300 text-amber-900 border-l-4 border-l-amber-500"
                              : "bg-blue-50/95 border-blue-200 text-blue-900 border-l-4 border-l-blue-600"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 min-w-0">
                            <div>
                              <p className="text-xs font-bold truncate">
                                {b.title}
                              </p>
                              <p className="text-[10px] opacity-75 font-semibold mt-0.5">
                                Requested by: {b.requestedBy} ({b.department})
                              </p>
                            </div>
                            
                            {/* Close/Action buttons */}
                            {isConflict ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveConflict(b.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded text-red-500 pointer-events-auto transition-colors shrink-0 cursor-pointer"
                                title="Dismiss Conflict View"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelBooking(b.id);
                                }}
                                className="p-1 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 pointer-events-auto transition-colors shrink-0 cursor-pointer"
                                title="Cancel Booking"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-80 mt-auto">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{b.startTime} – {b.endTime}</span>
                            {isConflict && (
                              <span className="ml-auto bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-0.5 animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> OVERLAP
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

              </div>
            </div>

            {/* Bookings Directory List (Right 1 column) */}
            <div className="space-y-6">
              
              {/* Conflicts Summary Alert if any exists */}
              {activeBookings.some(b => b.status === "Conflict") && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl card-shadow text-red-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    Conflict Warning
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    A requested time slot overlaps with an existing booking. The system blocks double-allocation of shared resources automatically.
                  </p>
                </div>
              )}

              {/* Selected Booking Receipt/Pass */}
              {focusedBookingId && (() => {
                const b = bookings.find(x => x.id === focusedBookingId);
                if (!b || b.status === "Cancelled") return null;
                const resourceObj = dynamicResources.find(r => r.id === b.resourceId);
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 text-white rounded-2xl p-5 card-shadow space-y-4 border border-slate-800 relative overflow-hidden"
                  >
                    {/* Decorative barcode overlay */}
                    <div className="absolute right-4 bottom-4 opacity-10 font-mono text-[9px] select-none text-right">
                      ||||||||||||||||||||||||||||||<br/>
                      {b.id.toUpperCase()}
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-850 border border-slate-700 px-2.5 py-0.5 rounded-full">
                          Booking Access Pass
                        </span>
                        <h4 className="text-sm font-extrabold mt-2 text-white">{b.title}</h4>
                      </div>
                      <button 
                        onClick={() => setFocusedBookingId(null)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300 font-semibold border-t border-slate-800 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Resource:</span>
                        <span className="text-white">{resourceObj?.name || "Shared Resource"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Scheduled:</span>
                        <span className="text-white">{b.startTime} - {b.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span className="text-white">{b.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Holder:</span>
                        <span className="text-white">{b.requestedBy} ({b.department})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>Booking Pass - ${b.title}</title>
                                <style>
                                  body { font-family: monospace; padding: 40px; color: #333; text-align: center; }
                                  .pass-box { border: 2px dashed #333; padding: 30px; display: inline-block; text-align: left; }
                                  h2 { margin-top: 0; }
                                  .barcode { font-size: 24px; letter-spacing: 2px; margin-top: 20px; font-weight: bold; text-align: center; }
                                </style>
                              </head>
                              <body>
                                <div class="pass-box">
                                  <h2>ASSETFLOW BOOKING PASS</h2>
                                  <hr />
                                  <p><strong>Title:</strong> ${b.title}</p>
                                  <p><strong>Resource:</strong> ${resourceObj?.name || "Shared Resource"} (${resourceObj?.type})</p>
                                  <p><strong>Scheduled Slot:</strong> ${b.startTime} - ${b.endTime} (${b.date})</p>
                                  <p><strong>Holder:</strong> ${b.requestedBy} (${b.department})</p>
                                  <p><strong>Status:</strong> ${b.status}</p>
                                  <hr />
                                  <div class="barcode">|||| ||||| |||| |||||</div>
                                  <div style="text-align:center;font-size:9px;margin-top:5px;">SECURE-TOKEN: ${b.id}</div>
                                </div>
                                <script>window.print();</script>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                        }
                      }}
                      className="w-full bg-white hover:bg-slate-100 text-slate-900 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Print Booking Pass
                    </button>
                  </motion.div>
                );
              })()}

              {/* Active list card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 card-shadow space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Current Bookings List</h4>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {activeBookings.filter(b => b.status !== "Cancelled").length === 0 ? (
                    <p className="text-xs font-medium text-slate-400 text-center py-6">No bookings scheduled for this date.</p>
                  ) : (
                    activeBookings.map((b) => (
                      <div 
                        key={b.id} 
                        className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 transition-colors ${
                          b.status === "Conflict"
                            ? "bg-red-50/55 border-red-100 text-red-950"
                            : "bg-slate-50 border-slate-100 text-slate-700"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-bold truncate">{b.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            b.status === "Conflict" 
                              ? "bg-red-100 text-red-800" 
                              : b.status === "Ongoing" 
                              ? "bg-amber-100 text-amber-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          By: {b.requestedBy} ({b.department})
                        </p>
                        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 pt-1.5 border-t border-slate-200/60 mt-1">
                          <span>{b.startTime} - {b.endTime}</span>
                          {b.status !== "Conflict" ? (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRemoveConflict(b.id)}
                              className="text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Informational Guidelines Card */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 card-shadow space-y-2 text-blue-900">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">Conflict Handling Rules</h4>
                <ul className="text-xs font-medium space-y-1.5 list-disc list-inside">
                  <li>Double-booking is physically impossible.</li>
                  <li>Booking end time can be exactly equal to next booking&apos;s start time.</li>
                  <li>Overlapping starts/ends are flagged immediately.</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Book Slot Modal */}
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
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-odoo-600" />
                  New Resource Booking
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleBookingSubmit}>
                <div className="p-6 space-y-4 font-sans">

                  {/* Resource Info Block */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Resource</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{activeResource.name}</p>
                    </div>
                    <span className="bg-odoo-50 text-odoo-700 border border-odoo-100 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {activeResource.type}
                    </span>
                  </div>

                  {/* Error Notification inside modal */}
                  {validationError && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2.5 text-red-900">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5 animate-bounce" />
                      <p className="text-xs font-bold leading-relaxed">{validationError}</p>
                    </div>
                  )}

                  {/* Title / Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Booking Purpose / Team Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Weekly Scrum Meeting"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-medium text-slate-900"
                    />
                  </div>

                  {/* Date Pick */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-medium text-slate-900 font-semibold"
                    />
                  </div>

                  {/* Times Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Start Time
                      </label>
                      <input
                        type="time"
                        required
                        value={formStart}
                        onChange={(e) => setFormStart(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-semibold text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        End Time
                      </label>
                      <input
                        type="time"
                        required
                        value={formEnd}
                        onChange={(e) => setFormEnd(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Department & Requestor */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Department
                      </label>
                      <select
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-medium text-slate-900"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Procurement">Procurement</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Sales">Sales</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Booked On Behalf Of
                      </label>
                      <input
                        type="text"
                        required
                        value={formRequestor}
                        onChange={(e) => setFormRequestor(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-odoo-500 bg-slate-50 focus:bg-white transition-colors font-medium text-slate-900"
                      />
                    </div>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-odoo-600 hover:bg-odoo-700 text-white transition-colors shadow-sm cursor-pointer"
                  >
                    Request Slot
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
