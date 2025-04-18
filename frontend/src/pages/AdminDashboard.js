function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
        <p className="text-lg text-gray-600">
          👋 Welcome, Admin! Only logged-in users with the <span className="font-semibold text-purple-700">admin</span> role can view this dashboard.
        </p>

        {/* You can add admin-specific cards or stats here later */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-100 p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-purple-800">User Management</h3>
            <p className="text-sm text-purple-600">Manage registered users, roles, and permissions.</p>
          </div>
          <div className="bg-pink-100 p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-pink-800">Content Overview</h3>
            <p className="text-sm text-pink-600">Review site content and community interactions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
