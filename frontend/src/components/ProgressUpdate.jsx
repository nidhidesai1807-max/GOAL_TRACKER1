import { useState } from "react";

function ProgressUpdate({ goal, onUpdate, onCancel }) {
  const [achievement, setAchievement] = useState(goal.achievement || "");
  const [remarks, setRemarks] = useState(goal.remarks || "");

  const handleSubmit = () => {
    if (!achievement) {
      alert("Please enter achievement");
      return;
    }

    onUpdate(goal.id, achievement, remarks);
  };

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
      <h4 className="font-semibold mb-3">Update Progress</h4>

      <input
        type="text"
        placeholder="Actual Achievement"
        className="w-full border p-3 rounded-lg mb-3"
        value={achievement}
        onChange={(e) => setAchievement(e.target.value)}
      />

      <textarea
        placeholder="Remarks"
        className="w-full border p-3 rounded-lg mb-3"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
      >
        Save Progress
      </button>

      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
      >
        Cancel
      </button>
    </div>
  );
}

export default ProgressUpdate;