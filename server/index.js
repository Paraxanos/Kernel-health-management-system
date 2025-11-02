import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let latestMetric = null;

// POST endpoint (called by khms_agent)
app.post("/api/health", (req, res) => {
  latestMetric = req.body;
  console.log("✅ New metric received:", latestMetric);
  res.json({ status: "ok" });
});

// GET endpoint (used by frontend)
app.get("/api/health/latest", (req, res) => {
  if (!latestMetric) return res.status(404).json({ error: "No metrics yet" });
  res.json(latestMetric);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

