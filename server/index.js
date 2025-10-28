import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.get("/api/health/latest", (req, res) => {
  exec("./khms_agent", { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing khms_agent:", stderr || error.message);
      return res.status(500).json({ error: "Failed to fetch kernel metrics" });
    }

    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (err) {
      console.error("Invalid JSON output from khms_agent:", stdout);
      res.status(500).json({ error: "Invalid JSON from khms_agent" });
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
