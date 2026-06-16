import AnalyticsDashboard from "./AnalyticsDashboard";
import ProgressUpdate from "./ProgressUpdate";
import { useEffect, useState } from "react";
import GoalForm from "./GoalForm";
import Navbar from "./Navbar";
import Footer from "./Footer";


function Dashboard({ onLogout , backendMessage}) {
  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);
useEffect(() => {
  fetch("https://goal-tracker-backend-lzkr.onrender.com/api/goals")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched goals:", data);

      if (Array.isArray(data)) {
        setGoals(data);
      } else if (Array.isArray(data.goals)) {
        setGoals(data.goals);
      } else {
        setGoals([]);
      }
    })
    .catch((error) => {
      console.log("Error fetching goals:", error);
      setGoals([]);
    });
}, []);
const addGoal = (newGoal) => {
  console.log("Goal received in Dashboard:", newGoal);

  if (!newGoal) {
    console.log("No goal received");
    return;
  }

  setGoals((prevGoals) => [
    newGoal,
    ...(Array.isArray(prevGoals) ? prevGoals : []),
  ]);
};

  return (
    <div className="min-h-screen bg-gray-100 p-10">
        <Navbar />
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Employee Dashboard
      </h1>

      <button
        onClick={onLogout}
        className="mb-6 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>

      <p className="mb-6 text-green-600 font-semibold">
         Backend Status: {backendMessage}
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to Goal Tracking Portal
        </h2>

        <p className="text-gray-600">
          Here employees will create goals, update achievements, and track
          progress.
        </p>
      </div>

   <GoalForm onAddGoal={addGoal} goals={goals} />

      <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">My Goals</h2>
        <p className="text-blue-600 font-semibold mb-4">
           Total Weightage:{" "}
           {(goals || []).reduce((sum, goal) => sum + Number(goal.weightage), 0)}%
        </p>

        {(goals || []).length === 0 ? (
          <p className="text-gray-500">No goals added yet.</p>
        ) : (
          (goals || []).map((goal, index) => (
            <div key={index} className="border p-4 rounded-lg mb-3">
              <h3 className="font-bold text-lg">{goal.title}</h3>
              <p className="text-sm text-blue-600 font-semibold">
                Thrust Area: {goal.thrust_area}
              </p>
              <p>{goal.description}</p>
              <p>Target: {goal.target}</p>
              <p>UoM Type: {goal.uom_type}</p>
              <p>Weightage: {goal.weightage}%</p>
              <p>Status: {goal.status}</p>
              <p>Quarter: {goal.quarter || "Q1"}</p>
              <p>
                Approval Status:
                <span className="font-semibold text-blue-600 ml-2">
                  {goal.approval_status || "Draft"}
                </span>
            </p>
            <p>
               Lock Status:
               <span
                     className={`font-semibold ml-2 ${
                          goal.is_locked ? "text-red-600" : "text-green-600"
                         }`}
               >
                  {goal.is_locked ? "Locked" : "Editable"}
                 </span>
            </p>
              <p>Achievement: {goal.achievement}</p>

<p>
  Progress:
  {" "}
  {goal.target && Number(goal.target) > 0
    ? Math.min(
        100,
        Math.round(
          (Number(goal.achievement || 0) /
            Number(goal.target)) *
            100
        )
      )
    : 0}
  %
</p>
<div className="w-full bg-gray-200 rounded-full h-4 mt-2 mb-3">
  <div
    className="bg-green-500 h-4 rounded-full"
    style={{
      width: `${
        goal.target && Number(goal.target) > 0
          ? Math.min(
              100,
              Math.round(
                (Number(goal.achievement || 0) /
                  Number(goal.target)) *
                  100
              )
            )
          : 0
      }%`,
    }}
  ></div>
</div>
              <p>Remarks: {goal.remarks || "No remarks yet"}</p>
              <p>
  Manager Comment:{" "}
  {goal.manager_comment || "No manager comment yet"}
</p>
              <button
  onClick={() => setEditingGoalId(goal.id)}
  disabled={goal.is_locked}
  className={`mt-3 px-4 py-2 rounded-lg text-white ${
    goal.is_locked
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-yellow-500 hover:bg-yellow-600"
  }`}
>
  {goal.is_locked ? "Goal Locked" : "Update Progress"}
</button>
<button
  onClick={() => {
    fetch(`https://goal-tracker-backend-lzkr.onrender.com/api/goals/${goal.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);

        const updatedGoals = (goals || []).filter((g) => g.id !== goal.id);

        setGoals(updatedGoals);
      })
      .catch((error) => {
        console.log(error);
        alert("Error deleting goal");
      });
  }}
  className="mt-3 ml-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
>
  Delete Goal
</button>
              {editingGoalId === goal.id && (
                <ProgressUpdate
                   goal={goal}
                   onCancel={() => setEditingGoalId(null)}
                   onUpdate={(goalId, achievement, remarks) => {
                    fetch(`https://goal-tracker-backend-lzkr.onrender.com/api/goals/${goalId}/progress`, {
                       method: "PUT",
                       headers: {
                            "Content-Type": "application/json",
                       },
                       body: JSON.stringify({
                        achievement,
                        remarks,
                       }),
                    })
                     .then((response) => response.json())
                     .then((data) => {
                      const updatedGoals = (goals || []).map((g) =>
                        g.id === goalId ? data.goal : g
                     );

                    setGoals(updatedGoals);

                    setEditingGoalId(null);

                    alert("Progress updated successfully!");
                   })
                   .catch((error) => {
                     console.log(error);

                     alert("Error updating progress");
                    });
                  }}
                />
              )}
            </div>
          ))
        )}
        <button
           onClick={() => {
            const totalWeightage = (goals || []).reduce(
             (sum, goal) => sum + Number(goal.weightage),
             0
            );

            if (totalWeightage !== 100) {
               alert("Total weightage must be exactly 100% before submission");
               return;
            }

            fetch("https://goal-tracker-backend-lzkr.onrender.com/api/goals/submit", {
                method: "PUT",
            })
                .then((response) => response.json())
                .then((data) => {
                   alert(data.message);

                 const updatedGoals = (goals || []).map((goal) => ({
                    ...goal,
                    approval_status:
                     goal.approval_status === "Draft" || !goal.approval_status
                      ? "Submitted"
                      : goal.approval_status,
                }));

                 setGoals(updatedGoals);
               })
              .catch((error) => {
               console.log(error);
               alert("Error submitting goals");
             });
            
           }}
           className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Submit Goals
        </button>
      </div>
      <AnalyticsDashboard /> 
      <Footer />
    </div>
  );
}

export default Dashboard;
