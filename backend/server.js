const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from backend!",
  });
});
app.delete("/api/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM goals WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.post("/api/goals", async (req, res) => {
  try {
    const {
      thrustArea,
      title,
      description,
      uomType,
      target,
      weightage,
      status,
      quarter,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO goals
      (
        thrust_area,
        title,
        description,
        uom_type,
        target,
        weightage,
        status,
        quarter
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        thrustArea,
        title,
        description,
        uomType,
        target,
        weightage,
        status,
        quarter,
      ]
    );

    res.status(201).json({
      success: true,
      goal: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.get("/api/goals", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM goals ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      goals: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.put("/api/goals/:id/progress", async (req, res) => {
  try {
    const { id } = req.params;
    const { achievement, remarks } = req.body;

    const result = await pool.query(
      `UPDATE goals
       SET achievement = $1, remarks = $2
       WHERE id = $3
       RETURNING *`,
      [achievement, remarks, id]
    );

    res.json({
      success: true,
      goal: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.put("/api/goals/submit", async (req, res) => {
  try {
    await pool.query(
      `UPDATE goals
       SET approval_status = 'Submitted'
       WHERE approval_status = 'Draft'`
    );
    await pool.query(
  `INSERT INTO audit_logs (action, details)
   VALUES ($1, $2)`,
  [
    "GOALS_SUBMITTED",
    "Employee submitted goals for manager review",
  ]
);

    res.json({
      success: true,
      message: "Goals submitted for approval",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.put("/api/goals/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE goals
       SET approval_status = 'Approved',
           is_locked = true
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      goal: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.put("/api/goals/:id/return", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE goals
       SET approval_status = 'Returned',
           is_locked = false
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      goal: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.put("/api/goals/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { managerComment } = req.body;

    const result = await pool.query(
      `UPDATE goals
       SET manager_comment = $1
       WHERE id = $2
       RETURNING *`,
      [managerComment, id]
    );

    res.json({
      success: true,
      goal: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.put("/api/goals/:id/unlock", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE goals
       SET is_locked = false,
           approval_status = 'Returned'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      goal: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.get("/api/audit-logs", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM audit_logs ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      logs: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});