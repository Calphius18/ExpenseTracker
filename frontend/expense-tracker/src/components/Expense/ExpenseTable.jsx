import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Trash2, ArrowUpDown } from 'lucide-react';
import moment from 'moment';

const ExpenseTable = ({ data, onDelete, isAdmin }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'date',
                header: 'Date',
                cell: (info) => moment(info.getValue()).format('DD MMM YYYY'),
            },
            {
                accessorKey: 'name',
                header: 'Personnel Name',
            },
            {
                accessorKey: 'category',
                header: 'Category',
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                cell: (info) => (
                    <span className="font-semibold text-slate-900">
                        ${info.getValue().toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: 'percentagePaid',
                header: '% Paid',
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
                accessorKey: 'balanceAmount',
                header: 'Balance',
                cell: (info) => (
                    <span className={`font-medium ${info.getValue() > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        ${info.getValue().toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: 'source',
                header: 'Source',
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (info) => (
                    <button
                        onClick={() => onDelete(info.row.original._id)}
                        disabled={!isAdmin}
                        className={`p-2 rounded-lg transition-colors ${isAdmin
                            ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                            : 'text-slate-200 cursor-not-allowed'
                            }`}
                        title={isAdmin ? 'Delete Expense' : 'Admin only'}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                ),
            },
        ],
        [isAdmin, onDelete]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center animate-fade-in">
                <p className="text-slate-400 text-sm font-medium">No expenses found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-slate-50/50 border-b border-slate-100">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors group ${header.column.getIsSorted() ? 'text-primary bg-primary/5' : 'text-slate-500'} ${header.id === 'source' || header.id === 'type' ? 'hidden lg:table-cell' :
                                            header.id === 'percentagePaid' ? 'hidden md:table-cell' : ''
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
                                                <ArrowUpDown className="w-3 h-3 text-black opacity-40 group-hover:opacity-100 transition-opacity" />
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
                                        className={`px-6 py-4 text-sm text-slate-600 ${cell.column.id === 'source' || cell.column.id === 'type' ? 'hidden lg:table-cell' :
                                            cell.column.id === 'percentagePaid' ? 'hidden md:table-cell' : ''
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

export default ExpenseTable;
