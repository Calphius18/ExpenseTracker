import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import { useUserAuth } from "../hooks/useUserAuth";

const AdminPage = () => {
  useUserAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showPending, setShowPending] = useState(true);
  const itemsPerPage = 8; // ✅ how many users per page

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
    try {
      const res = await axiosInstance.put(
        API_ENDPOINTS.ADMIN.UPDATE_ROLE(userId),
        { role }
      );
      toast.success(`✅ ${res.data.user.fullName} is now ${role.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating role");
    }
  };

  // ✅ Filter users
  const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.role.toLowerCase().includes(search)
    );
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Role badge colors
  const roleColors = {
    admin: "bg-red-100 text-red-600",
    user: "bg-blue-100 text-blue-600",
    viewer: "bg-gray-100 text-gray-600",
  };

  const pendingRequests = users.filter((u) => u.pendingAdminRequest);

  return (
    <DashboardLayout activeMenu="Admin">
      <div className="my-6 space-y-6">
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            👥 User Management
          </h2>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, or role..."
            className="border border-gray-300 rounded-md p-2 w-full sm:w-80 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* ✅ Pending Admin Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-yellow-700">
                Pending Admin Requests ({pendingRequests.length})
              </h3>
              <button
                onClick={() => setShowPending((prev) => !prev)}
                className="text-xs text-yellow-700 underline hover:text-yellow-900"
              >
                {showPending ? "Hide" : "Show"}
              </button>
            </div>

            {showPending && (
              <div className="flex flex-col gap-2">
                {pendingRequests.map((u) => (
                  <div
                    key={u._id}
                    className="flex flex-wrap justify-between items-center bg-white border border-yellow-200 p-3 rounded-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      <span className="font-medium text-gray-800">
                        {u.fullName}
                      </span>
                      <span className="text-sm text-gray-500">{u.email}</span>
                    </div>

                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => updateRole(u._id, "admin")}
                        className="bg-green-500 text-white text-xs px-3 py-1.5 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateRole(u._id, "viewer")}
                        className="bg-red-500 text-white text-xs px-3 py-1.5 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-gray-400">No users found.</p>
        ) : (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-gray-600 text-left">
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Role</th>
                    <th className="p-3 font-medium text-center">Pending</th>
                    <th className="p-3 font-medium text-center">Manage</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 whitespace-nowrap">{u.fullName}</td>
                      <td className="p-3 whitespace-nowrap text-gray-600">
                        {u.email}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role]}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {u.pendingAdminRequest ? (
                          <span className="text-green-500 font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                          className="border border-gray-300 rounded-md p-1.5 text-sm bg-white hover:border-gray-400 focus:outline-none"
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

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{startIndex + 1}</span>–{" "}
                <span className="font-semibold">
                  {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                </span>{" "}
                of <span className="font-semibold">{filteredUsers.length}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1.5 rounded border text-sm ${
                    page === 1
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  Prev
                </button>

                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1.5 rounded border text-sm ${
                    page === totalPages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
