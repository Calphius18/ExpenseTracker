import React from "react";
import { Search, Filter, Calendar, RefreshCcw } from "lucide-react";

const ReportFilters = ({ filters, onFilterChange, onReset }) => {
    const hasActiveFilters = filters.search || filters.type || filters.dateFrom || filters.dateTo;

    return (
        <div className="bg-white/70 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl shadow-slate-200/50 mb-8 animate-fade-in-up">
            <div className="flex flex-wrap items-end gap-4">
                {/* General Search - Grows */}
                <div className="relative group flex-grow min-w-[280px]">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Search Expenses</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Personnel, source, or category..."
                            value={filters.search}
                            onChange={(e) => onFilterChange("search", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm h-10"
                        />
                    </div>
                </div>

                {/* Expense Type - Fixed width */}
                <div className="relative group w-full sm:w-48">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Expense Type</label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4" />
                        <select
                            value={filters.type}
                            onChange={(e) => onFilterChange("type", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-8 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm appearance-none cursor-pointer h-10"
                        >
                            <option value="">All Types</option>
                            <option value="CAPEX">CAPEX</option>
                            <option value="OPEX">OPEX</option>
                            <option value="Transport Fee">Transport Fee</option>
                        </select>
                    </div>
                </div>

                {/* Date Range Group */}
                <div className="flex flex-col gap-1.5 w-full lg:w-auto">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0 ml-1">Date Range</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 h-10 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                        <Calendar className="text-slate-400 w-4 h-4 flex-shrink-0" />
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full lg:w-32 cursor-pointer"
                        />
                        <span className="text-slate-300">-</span>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => onFilterChange("dateTo", e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full lg:w-32 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Reset Button - Tucked at the end */}
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-primary hover:bg-primary/5 transition-all h-10"
                        title="Clear all filters"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReportFilters;
