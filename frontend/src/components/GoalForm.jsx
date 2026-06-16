import { useState } from "react";

function GoalForm({ onAddGoal, goals }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [weightage, setWeightage] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [quarter, setQuarter] = useState("Q1");
  const [uomType, setUomType] = useState("Numeric");
  const [thrustArea, setThrustArea] = useState("");

  const handleAddGoal = () => {
    if (!thrustArea || !title || !description || !target || !weightage) {
     alert("Please fill all goal fields");
     return;
    }
    if (Number(weightage) < 10) {
     alert("Minimum weightage per goal must be 10%");
     return;
    }
    if (goals.length >= 8) {
     alert("Maximum 8 goals allowed");
     return;
    }
    const totalWeightage =
      (goals|| []).reduce(
        (sum, goal) => sum + Number(goal.weightage),
        0
      ) + Number(weightage);

    if (totalWeightage > 100) {
       alert("Total weightage cannot exceed 100%");
       return;
    }
    const newGoal = {
      title,
      description,
      target,
      weightage,
      status,
      uomType,
      thrustArea,
      quarter,
    };

    fetch("https://goal-tracker-backend-lzkr.onrender.com/api/goals", {
       method: "POST",
       headers: {
        "Content-Type": "application/json",
       },
       body: JSON.stringify(newGoal),
    })
       .then((response) => response.json())
.then((data) => {
  console.log("Backend response:", data);

  alert("Goal Added Successfully!");

})

    alert("Goal Added!");

    setTitle("");
    setDescription("");
    setTarget("");
    setWeightage("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-4">Create Goal</h2>
       
       <input
        type="text"
        placeholder="Thrust Area"
        className="w-full border p-3 rounded-lg mb-4"
        value={thrustArea}
        onChange={(e) => setThrustArea(e.target.value)}
      />

      <input
        type="text"
        placeholder="Goal Title"
        className="w-full border p-3 rounded-lg mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Goal Description"
        className="w-full border p-3 rounded-lg mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="w-full border p-3 rounded-lg mb-4"
        value={uomType}
        onChange={(e) => setUomType(e.target.value)}
      >
       <option>Numeric</option>
       <option>%</option>
       <option>Timeline</option>
       <option>Zero-based</option>
     </select>

      <input
        type="number"
        placeholder="Target"
        className="w-full border p-3 rounded-lg mb-4"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <input
        type="number"
        placeholder="Weightage (%)"
        className="w-full border p-3 rounded-lg mb-4"
        value={weightage}
        onChange={(e) => setWeightage(e.target.value)}
      />

      <button
        onClick={handleAddGoal}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Add Goal
      </button>
      <select
  className="w-full border p-3 rounded-lg mb-4"
  value={quarter}
  onChange={(e) => setQuarter(e.target.value)}
>
  <option>Q1</option>
  <option>Q2</option>
  <option>Q3</option>
  <option>Q4</option>
</select>
      <select
        className="w-full border p-3 rounded-lg mb-4"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Not Started</option>
        <option>On Track</option>
        <option>Completed</option>
      </select>
    </div>
  );
}

export default GoalForm;
