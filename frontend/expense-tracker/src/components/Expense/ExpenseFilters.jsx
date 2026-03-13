import React from "react";
import { Search, Filter, Calendar } from "lucide-react";

const ExpenseFilters = ({ search, onSearchChange, category, onCategoryChange, dateRange, onDateRangeChange, onClearFilters }) => {
    const hasActiveFilters = search || category || dateRange.start || dateRange.end;

    return (
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Search Input - Takes more space */}
            <div className="relative group flex-grow min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-base" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search expenses..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm h-10"
                />
            </div>

            {/* Category Filter - Fixed width */}
            <div className="relative group w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-base" />
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm appearance-none cursor-pointer h-10"
                >
                    <option value="">All Categories</option>
                    <option value="CAPEX">CAPEX</option>
                    <option value="OPEX">OPEX</option>
                    <option value="Transport Fee">Transport Fee</option>
                </select>
            </div>

            {/* Date Range Group */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 h-10 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all w-full lg:w-auto">
                <Calendar className="text-slate-400 text-sm flex-shrink-0" />
                <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                    className="bg-transparent border-none outline-none text-sm w-full lg:w-32 cursor-pointer"
                />
                <span className="text-slate-300">-</span>
                <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                    className="bg-transparent border-none outline-none text-sm w-full lg:w-32 cursor-pointer"
                />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="text-sm font-medium text-slate-500 hover:text-primary transition-colors px-2 py-1"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default ExpenseFilters;
