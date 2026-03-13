import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ArrowUpDown, FileText } from 'lucide-react';
import moment from 'moment';

const ExpenseReportTable = ({ data, loading }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'date',
                header: 'Date',
                cell: (info) => moment(info.getValue()).format('DD MMM YYYY'),
            },
            {
                accessorKey: 'name',
                header: 'Personnel',
            },
            {
                accessorKey: 'source',
                header: 'Source',
            },
            {
                accessorKey: 'category',
                header: 'Category',
            },
            {
                accessorKey: 'type',
                header: 'Type',
                cell: (info) => (
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${info.getValue() === 'CAPEX' ? 'bg-blue-50 text-blue-600' :
                        info.getValue() === 'OPEX' ? 'bg-purple-50 text-purple-600' :
                            'bg-orange-50 text-orange-600'
                        }`}>
                        {info.getValue()}
                    </span>
                ),
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                cell: (info) => (
                    <span className="font-semibold text-slate-900">
                        ₦{info.getValue().toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: 'percentagePaid',
                header: '% Paid',
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1 overflow-hidden hidden sm:block">
                            <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{ width: `${info.getValue()}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-slate-500">{info.getValue()}%</span>
                    </div>
                ),
            },
            {
                accessorKey: 'balanceAmount',
                header: 'Balance',
                cell: (info) => (
                    <span className={`font-medium ${info.getValue() > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        ₦{info.getValue().toLocaleString()}
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading) {
        return (
            <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl p-20 text-center animate-pulse">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full animate-bounce" />
                    <p className="text-slate-400 text-sm font-medium">Fetching your report...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-slate-100 rounded-2xl p-20 text-center shadow-sm shadow-slate-200/50">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-medium">No results found.</p>
                <p className="text-slate-300 text-xs mt-1">Adjust your filters to see more data.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 animate-fade-in-up">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-slate-50/50 border-b border-slate-100">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={`px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors group ${header.id === 'source' || header.id === 'category' ? 'hidden xl:table-cell' :
                                            header.id === 'type' || header.id === 'percentagePaid' ? 'hidden lg:table-cell' :
                                                header.id === 'name' ? 'hidden sm:table-cell' : ''
                                            }`}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() === 'asc' ? (
                                                    <ChevronUp className="w-3 h-3 text-black" />
                                                ) : (
                                                    <ChevronDown className="w-3 h-3 text-black" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 text-black opacity-50 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/30 transition-colors group">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`px-6 py-4 text-sm text-slate-600 ${cell.column.id === 'source' || cell.column.id === 'category' ? 'hidden xl:table-cell' :
                                            cell.column.id === 'type' || cell.column.id === 'percentagePaid' ? 'hidden lg:table-cell' :
                                                cell.column.id === 'name' ? 'hidden sm:table-cell' : ''
                                            }`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseReportTable;
