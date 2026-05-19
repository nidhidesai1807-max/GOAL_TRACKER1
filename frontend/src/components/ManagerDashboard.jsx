import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ManagerDashboard({ onLogout }) {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/goals")
      .then((response) => response.json())
      .then((data) => {
        const submittedGoals = data.goals.filter(
          (goal) => goal.approval_status === "Submitted"
        );

        setGoals(submittedGoals);
      })
      .catch((error) => {
        console.log("Error fetching manager goals:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
        <Navbar />
      <h1 className="text-4xl font-bold text-purple-600 mb-6">
        Manager Dashboard
      </h1>

      <button
        onClick={onLogout}
        className="mb-6 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Submitted Goals</h2>

        {goals.length === 0 ? (
          <p className="text-gray-500">No submitted goals pending approval.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="border p-4 rounded-lg mb-4">
              <h3 className="font-bold text-lg">{goal.title}</h3>
              <p className="text-sm text-purple-600 font-semibold">
                Thrust Area: {goal.thrust_area}
              </p>
              <p>{goal.description}</p>
              <p>Target: {goal.target}</p>
              <p>UoM Type: {goal.uom_type}</p>
              <p>Weightage: {goal.weightage}%</p>
              <p>Status: {goal.status}</p>
              <p>Achievement: {goal.achievement || "0"}</p>
              <p>Remarks: {goal.remarks || "No remarks yet"}</p>
              <p className="font-semibold">
                Approval Status: {goal.approval_status}
              </p>
               <textarea
  placeholder="Add manager check-in comment"
  className="w-full border p-3 rounded-lg mt-3"
  onChange={(e) => {
    goal.managerCommentInput = e.target.value;
  }}
/>
<button
  onClick={() => {
    fetch(`http://localhost:5000/api/goals/${goal.id}/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        managerComment: goal.managerCommentInput || "",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Manager comment saved successfully!");
      })
      .catch((error) => {
        console.log(error);
        alert("Error saving comment");
      });
  }}
  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  Save Comment
</button>
              <div className="mt-4 flex gap-3">
                <button
                    onClick={() => {
                       fetch(`http://localhost:5000/api/goals/${goal.id}/approve`, {
                        method: "PUT",
                       })
                            .then((response) => response.json())
                            .then((data) => {
                                 alert("Goal approved successfully!");

                                const remainingGoals = goals.filter((g) => g.id !== goal.id);
                                setGoals(remainingGoals);
                              })
                              .catch((error) => {
                                console.log(error);
                                alert("Error approving goal");
                               });
                            }}
                             className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
  onClick={() => {
    fetch(`http://localhost:5000/api/goals/${goal.id}/return`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Goal returned for rework!");

        const remainingGoals = goals.filter((g) => g.id !== goal.id);
        setGoals(remainingGoals);
      })
      .catch((error) => {
        console.log(error);
        alert("Error returning goal");
      });
  }}
  className="bg-orange-500 text-white px-4 py-2 rounded-lg"
>
  Return for Rework
</button>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ManagerDashboard;