import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AnalyticsDashboard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/goals")
      .then((res) => res.json())
      .then((data) => {
  setGoals(data.goals || []);
  setLoading(false);
});
  }, []);

  const totalGoals = goals.length;
  const approvedGoals = goals.filter((g) => g.approval_status === "Approved").length;
  const submittedGoals = goals.filter((g) => g.approval_status === "Submitted").length;
  const draftGoals = goals.filter((g) => !g.approval_status || g.approval_status === "Draft").length;
  const returnedGoals = goals.filter((g) => g.approval_status === "Returned").length;

  const approvalData = [
    { name: "Approved", value: approvedGoals },
    { name: "Submitted", value: submittedGoals },
    { name: "Draft", value: draftGoals },
    { name: "Returned", value: returnedGoals },
  ];

  const weightageData = goals.map((goal) => ({
    name: goal.title,
    weightage: Number(goal.weightage),
  }));
if (loading) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p>Loading analytics...</p>
    </div>
  );
}

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl">
          <p>Total Goals</p>
          <h3 className="text-3xl font-bold">{totalGoals}</h3>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <p>Approved</p>
          <h3 className="text-3xl font-bold">{approvedGoals}</h3>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl">
          <p>Submitted</p>
          <h3 className="text-3xl font-bold">{submittedGoals}</h3>
        </div>

        <div className="bg-orange-100 p-4 rounded-xl">
          <p>Returned</p>
          <h3 className="text-3xl font-bold">{returnedGoals}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border p-4 rounded-xl">
          <h3 className="font-semibold mb-4">Approval Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={approvalData} dataKey="value" nameKey="name" outerRadius={90} label>
                {approvalData.map((entry, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="border p-4 rounded-xl">
          <h3 className="font-semibold mb-4">Goal Weightage Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weightageData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weightage" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;