import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function AdminDashboard({ onLogout }) {
  const [goals, setGoals] = useState([]);
  const [logs, setLogs] = useState([]);

  const fetchGoals = () => {
    fetch("http://localhost:5000/api/goals")
      .then((res) => res.json())
      .then((data) => {
  setGoals(data.goals || []);

  fetch("http://localhost:5000/api/audit-logs")
    .then((res) => res.json())
    .then((logData) => setLogs(logData.logs || []));
})
      .catch((error) => console.log("Admin fetch error:", error));
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalGoals = goals.length;
  const approved = goals.filter((g) => g.approval_status === "Approved").length;
  const submitted = goals.filter((g) => g.approval_status === "Submitted").length;
  const returned = goals.filter((g) => g.approval_status === "Returned").length;
  const locked = goals.filter((g) => g.is_locked).length;
const exportCSV = () => {
  const headers = [
    "ID",
    "Title",
    "Thrust Area",
    "UoM Type",
    "Target",
    "Achievement",
    "Weightage",
    "Status",
    "Approval Status",
    "Quarter",
    "Manager Comment",
  ];

  const rows = goals.map((goal) => [
    goal.id,
    goal.title,
    goal.thrust_area,
    goal.uom_type,
    goal.target,
    goal.achievement || "0",
    goal.weightage,
    goal.status,
    goal.approval_status || "Draft",
    goal.quarter || "Q1",
    goal.manager_comment || "",
  ]);

  const csvContent =
    [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "achievement_report.csv";
  link.click();
};
  return (
    <div className="min-h-screen bg-gray-100 p-10">
        <Navbar />
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Admin / HR Dashboard
      </h1>

      <button
        onClick={onLogout}
        className="mb-6 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
<button
  onClick={exportCSV}
  className="mb-6 ml-3 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
>
  Export CSV Report
</button>
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total Goals</p>
          <h2 className="text-3xl font-bold">{totalGoals}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Approved</p>
          <h2 className="text-3xl font-bold text-green-600">{approved}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Submitted</p>
          <h2 className="text-3xl font-bold text-blue-600">{submitted}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Returned</p>
          <h2 className="text-3xl font-bold text-orange-600">{returned}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Locked</p>
          <h2 className="text-3xl font-bold text-red-600">{locked}</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">All Goals Overview</h2>

        {goals.length === 0 ? (
          <p className="text-gray-500">No goals found.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="border p-4 rounded-lg mb-4">
              <h3 className="font-bold text-lg">{goal.title}</h3>
              <p>Thrust Area: {goal.thrust_area}</p>
              <p>Target: {goal.target}</p>
              <p>UoM Type: {goal.uom_type}</p>
              <p>Weightage: {goal.weightage}%</p>
              <p>Status: {goal.status}</p>
              <p>Achievement: {goal.achievement || "0"}</p>
              <p>Approval Status: {goal.approval_status || "Draft"}</p>
              <p>
                Lock Status:{" "}
                <span className={goal.is_locked ? "text-red-600" : "text-green-600"}>
                  {goal.is_locked ? "Locked" : "Editable"}
                </span>
              </p>
              <p>
                Manager Comment:{" "}
                {goal.manager_comment || "No manager comment yet"}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    fetch(`http://localhost:5000/api/goals/${goal.id}/unlock`, {
                      method: "PUT",
                    })
                      .then((res) => res.json())
                      .then(() => {
                        alert("Goal unlocked successfully");
                        fetchGoals();
                      })
                      .catch(() => alert("Error unlocking goal"));
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Unlock Goal
                </button>

                <button
                  onClick={() => {
                    fetch(`http://localhost:5000/api/goals/${goal.id}`, {
                      method: "DELETE",
                    })
                      .then((res) => res.json())
                      .then(() => {
                        alert("Goal deleted successfully");
                        fetchGoals();
                      })
                      .catch(() => alert("Error deleting goal"));
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete Goal
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
  <h2 className="text-2xl font-semibold mb-4">Audit Logs</h2>

  {logs.length === 0 ? (
    <p>No audit logs found.</p>
  ) : (
    logs.map((log) => (
      <div key={log.id} className="border p-3 rounded-lg mb-3">
        <p className="font-semibold">{log.action}</p>
        <p>{log.details}</p>
        <p className="text-sm text-gray-500">
          {new Date(log.created_at).toLocaleString()}
        </p>
      </div>
    ))
  )}
</div>
<Footer />
    </div>
  );
}

export default AdminDashboard;