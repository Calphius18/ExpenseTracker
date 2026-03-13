import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import { useUserAuth } from "../hooks/useUserAuth";
import { Search, Users, ShieldAlert, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

const AdminPage = () => {
  useUserAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showPending, setShowPending] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });
  const itemsPerPage = 8;

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN.GET_ALL_USERS);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Change user role
  const updateRole = async (userId, role) => {
    const toastId = toast.loading("Updating role...");
    try {
      const res = await axiosInstance.put(
        API_ENDPOINTS.ADMIN.UPDATE_ROLE(userId),
        { role }
      );
      toast.success(`${res.data.user.fullName} is now ${role.toUpperCase()}`, { id: toastId });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating role", { id: toastId });
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ✅ Filter & Sort users
  const processedUsers = users
    .filter((u) => {
      const search = searchTerm.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.role.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // ✅ Pagination logic
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedUsers = processedUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Role badge colors mapping
  const roleStyles = {
    admin: "bg-rose-50 text-rose-600 border-rose-100",
    user: "bg-blue-50 text-blue-600 border-blue-100",
    viewer: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const pendingRequests = users.filter((u) => u.pendingAdminRequest);

  return (
    <DashboardLayout activeMenu="Admin">
      <div className="my-8 mx-auto max-w-7xl px-4 md:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              User Management
            </h1>
            <p className="text-slate-500 mt-1">
              Control access levels and manage administrative requests.
            </p>
          </div>

          <div className="relative group w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-base" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, or role..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm h-11 shadow-sm"
            />
          </div>
        </div>

        {/* ✅ Pending Admin Requests (Integrated Glassmorphism Design) */}
        {pendingRequests.length > 0 && (
          <div className="bg-amber-50/50 backdrop-blur-sm border border-amber-200/50 p-5 rounded-2xl shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wider text-xs">
                <ShieldAlert className="w-4 h-4" />
                Pending Admin Requests ({pendingRequests.length})
              </div>
              <button
                onClick={() => setShowPending((prev) => !prev)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
              >
                {showPending ? "Hide All" : "Show All"}
              </button>
            </div>

            {showPending && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingRequests.map((u) => (
                  <div
                    key={u._id}
                    className="flex justify-between items-center bg-white border border-amber-100 p-4 rounded-xl shadow-sm hover:border-amber-200 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {u.fullName}
                      </span>
                      <span className="text-xs text-slate-500">{u.email}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateRole(u._id, "admin")}
                        className="bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateRole(u._id, "viewer")}
                        className="bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-slate-200 transition-all active:scale-95"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 text-sm font-medium">Loading user data...</p>
            </div>
          ) : processedUsers.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No users found matching your search.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      {[
                        { label: 'Name', key: 'fullName' },
                        { label: 'Email', key: 'email' },
                        { label: 'Role', key: 'role' },
                        { label: 'Status', key: 'pendingAdminRequest' },
                        { label: 'Manage', key: null }
                      ].map((col) => (
                        <th
                          key={col.label}
                          className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider transition-colors ${col.key ? 'cursor-pointer group' : 'text-slate-500'}`}
                          onClick={() => col.key && handleSort(col.key)}
                        >
                          <div className={`flex items-center gap-2 ${col.key && sortConfig.key === col.key ? 'text-primary' : 'text-slate-500'}`}>
                            {col.label}
                            {col.key && (
                              <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig.key === col.key ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {paginatedUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-slate-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{u.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleStyles[u.role]}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.pendingAdminRequest ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                              Pending
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">Default</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u._id, e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer hover:border-slate-300"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section */}
              <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{startIndex + 1}</span>
                  <span className="text-[10px]">—</span>
                  <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {Math.min(startIndex + itemsPerPage, processedUsers.length)}
                  </span>
                  <span className="ml-1 text-[10px] text-slate-300">from</span>
                  <span className="text-primary/80">{processedUsers.length}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`p-2 rounded-lg border transition-all ${page === 1
                        ? "bg-transparent text-slate-300 border-slate-100 cursor-not-allowed"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary shadow-sm"
                        }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center px-4 h-9 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                      {page} <span className="mx-1 text-slate-300">/</span> {totalPages}
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={`p-2 rounded-lg border transition-all ${page === totalPages
                        ? "bg-transparent text-slate-300 border-slate-100 cursor-not-allowed"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary shadow-sm"
                        }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
